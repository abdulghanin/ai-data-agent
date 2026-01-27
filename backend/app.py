import io
import re
import pandas as pd
import pymysql
import requests

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# ==============================
# APP
# ==============================

app = FastAPI(title="AI Data Agent")


# ==============================
# CORS
# ==============================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==============================
# CONFIG
# ==============================

MYSQL_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "ai_data",
    "charset": "utf8mb4",
    "cursorclass": pymysql.cursors.DictCursor
}

OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3"

TABLE_NAME = "dataset"


# ==============================
# DB CONNECTION
# ==============================

def get_conn():
    return pymysql.connect(**MYSQL_CONFIG)


# ==============================
# MODELS
# ==============================

class AskRequest(BaseModel):
    question: str


# ==============================
# HELPERS
# ==============================

def clean_column(col: str) -> str:
    col = col.lower().strip()
    col = re.sub(r"[^a-z0-9_]", "_", col)
    return col


def only_select(sql: str):

    sql = sql.strip().lower()

    if not sql.startswith("select"):
        raise HTTPException(400, "Only SELECT allowed")

    banned = ["drop", "delete", "update", "insert", "alter", "truncate"]

    for w in banned:
        if w in sql:
            raise HTTPException(400, "Dangerous SQL detected")


def get_schema():

    conn = get_conn()

    with conn.cursor() as cur:
        cur.execute(f"DESCRIBE {TABLE_NAME}")
        rows = cur.fetchall()

    conn.close()

    return "\n".join(
        [f"- {r['Field']} ({r['Type']})" for r in rows]
    )


# ==============================
# LLM
# ==============================

def ask_llm(question: str, schema: str):

    prompt = f"""
You are a professional SQL expert.

Only table: {TABLE_NAME}

Schema:
{schema}

Rules:
- Only SELECT
- No explanation

Question:
{question}

SQL:
"""

    res = requests.post(
        OLLAMA_URL,
        json={
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False
        },
        timeout=120
    )

    data = res.json()

    if "response" not in data:
        raise Exception("LLM Error")

    return data["response"].strip()


# ==============================
# ROUTES
# ==============================

@app.get("/")
def home():
    return {"status": "running"}


# ==============================
# UPLOAD
# ==============================

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    name = file.filename.lower()

    if not name.endswith((".csv", ".xlsx", ".xls")):
        raise HTTPException(400, "Only CSV / Excel allowed")

    content = await file.read()

    try:
        if name.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(content))
        else:
            df = pd.read_excel(io.BytesIO(content))
    except Exception as e:
        raise HTTPException(400, str(e))

    if df.empty:
        raise HTTPException(400, "Empty file")

    df.columns = [clean_column(c) for c in df.columns]

    conn = get_conn()
    cur = conn.cursor()

    cur.execute(f"DROP TABLE IF EXISTS {TABLE_NAME}")

    cols = ", ".join(
        [f"`{c}` TEXT" for c in df.columns]
    )

    cur.execute(f"""
    CREATE TABLE {TABLE_NAME} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        {cols}
    )
    """)

    placeholders = ", ".join(["%s"] * len(df.columns))
    columns = ", ".join([f"`{c}`" for c in df.columns])

    insert_sql = f"""
    INSERT INTO {TABLE_NAME} ({columns})
    VALUES ({placeholders})
    """

    for _, row in df.iterrows():
        cur.execute(insert_sql, tuple(row.astype(str)))

    conn.commit()
    conn.close()

    return {
        "message": "Uploaded",
        "rows": len(df),
        "columns": list(df.columns)
    }


# ==============================
# DASHBOARD
# ==============================

@app.get("/stats")
def get_stats():

    conn = get_conn()
    cur = conn.cursor()

    cur.execute(f"SELECT COUNT(*) as total FROM {TABLE_NAME}")
    total = cur.fetchone()["total"]

    cur.execute(f"SHOW COLUMNS FROM {TABLE_NAME}")
    cols = len(cur.fetchall())

    cur.execute(f"SELECT * FROM {TABLE_NAME} LIMIT 2")
    preview = cur.fetchall()

    conn.close()

    return {
        "total_rows": total,
        "total_columns": cols,
        "preview": preview
    }


# ==============================
# ASK
# ==============================

@app.post("/ask")
def ask(req: AskRequest):

    schema = get_schema()

    sql = ask_llm(req.question, schema)

    only_select(sql)

    conn = get_conn()

    with conn.cursor() as cur:
        cur.execute(sql)
        rows = cur.fetchall()

    conn.close()

    return {
        "sql": sql,
        "rows": rows,
        "count": len(rows)
    }
