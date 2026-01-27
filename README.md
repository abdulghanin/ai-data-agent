# 🤖 AI Data Agent

An end‑to‑end **AI‑powered data exploration tool** that lets you upload CSV/Excel files, automatically store them in MySQL, and **ask natural‑language questions** that are converted into safe SQL queries using a local LLM (Ollama).

> Built with **FastAPI + MySQL + Ollama + Next.js (Dashboard)**

---

## ✨ Features

* 📁 Upload **CSV / Excel** datasets
* 🧠 Ask questions in **natural language**
* 🔐 **SQL‑safe AI** (SELECT‑only enforcement)
* ⚡ FastAPI backend
* 📊 Interactive React dashboard
* 📈 Auto preview + sample chart
* 🧩 Schema‑aware LLM prompting
* 🖥️ Local LLM via **Ollama (llama3)**

---

## 🏗️ Project Structure

```
ai-data-agent/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│
├── dashboard/
│   ├── app/
│   ├── package.json
│
├── README.md
```

---

## ⚙️ Tech Stack

### Backend

* Python 3.10+
* FastAPI
* Pandas
* PyMySQL
* Ollama (llama3)

### Frontend

* Next.js / React
* Tailwind CSS
* Axios
* Recharts
* React Dropzone

### Database

* MySQL

---

## 🚀 Getting Started

### 1️⃣ Prerequisites

* Python 3.10+
* Node.js 18+
* MySQL running locally
* Ollama installed

```bash
ollama pull llama3
```

---

### 2️⃣ Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Update MySQL config inside `main.py` if needed:

```python
MYSQL_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "ai_data"
}
```

Run the API:

```bash
uvicorn main:app --reload
```

Backend runs on:

```
http://127.0.0.1:8000
```

---

### 3️⃣ Frontend Setup

```bash
cd dashboard
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

## 🧪 API Endpoints

### `POST /upload`

Upload CSV or Excel file

### `GET /stats`

Returns dataset stats + preview

### `POST /ask`

Ask a natural‑language question

```json
{
  "question": "How many records are there?"
}
```

Response:

```json
{
  "sql": "SELECT COUNT(*) FROM dataset",
  "rows": [...],
  "count": 1
}
```

---

## 🔐 Security Notes

* Only **SELECT** queries allowed
* Dangerous SQL keywords blocked
* Table access strictly limited to uploaded dataset

> ⚠️ This is a local MVP. For production, add authentication and role‑based access.

---

## 🧠 How AI Works

1. Dataset schema is extracted from MySQL
2. User question + schema sent to Ollama
3. LLM generates safe SQL
4. SQL validated (SELECT‑only)
5. Query executed and results returned

---

## 📌 Roadmap

* [ ] Multi‑dataset projects
* [ ] Authentication & users
* [ ] Self‑correcting SQL (error feedback loop)
* [ ] AI‑generated charts
* [ ] Export results (PDF / Excel)
* [ ] Docker Compose support

---

## 💡 Use Cases

* Data exploration
* Internal analytics
* AI‑powered dashboards
* Client reporting tools
* SaaS data assistants

---

## 👤 Author

**Abdulghani Ibrahim**
Software Engineer | MERN & Backend Developer

---

## 📜 License

MIT License — free to use, modify, and distribute.

---

⭐ If you find this project useful, please give it a star on GitHub!
