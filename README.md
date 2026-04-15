# 📊 Hashtag Analyzer

A small Flask web app that analyzes hashtags using a seeded SQLite database. Enter a hashtag to see popularity, related tag suggestions, and weekly trend data.

---

## ✨ Features

- Search and analyze hashtags
- Popularity score display
- Related hashtag suggestions
- Weekly trend chart
- Trending hashtag feed
- Create new hashtag data via API

---

## 🛠️ Tech Stack

- Python 3.8+
- Flask
- Flask-SQLAlchemy
- SQLite
- HTML, CSS, JavaScript
- Chart.js

---

## 📁 Project Structure

```
hashtag-analyzer/
├── app.py
├── requirements.txt
├── README.md
├── templates/
│   └── index.html
├── static/
│   ├── script.js
│   └── style.css
└── tests/
    ├── __init__.py
    ├── conftest.py
    ├── test_api.py
    └── test_integration.py
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or newer
- pip

### Installation

```bash
cd c:/Users/Anjali/OneDrive/Desktop/hashtag-analyzer
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

### Run the app

```bash
python app.py
```

Then open:

```text
http://127.0.0.1:5000
```

The app will create the SQLite database and seed initial hashtag data automatically.

---

## 📌 Usage

- Visit the home page
- Enter a hashtag in the search field
- Click Analyze to view popularity, related tags, and weekly trend data
- Trending hashtags are available through the UI and the API

---

## 🔌 API Endpoints

### `GET /`

Returns the main web page.

### `POST /analyze`

Analyze a hashtag.

Request body example:

```json
{
  "hashtag": "#tech"
}
```

Successful response:

```json
{
  "popularity": 92,
  "related": ["#innovation", "#gadgets", "#ai", "#coding", "#startups"],
  "trend": [68, 72, 74, 79, 84, 88, 92]
}
```

### `POST /hashtags`

Create a new hashtag entry.

Request body example:

```json
{
  "tag": "#newtag",
  "popularity": 70,
  "related": ["#example", "#demo"],
  "trend": [10, 20, 30, 40, 50, 60, 70],
  "isTrending": true
}
```

### `GET /trending`

Returns a JSON list of currently trending hashtag tags.

Response example:

```json
{
  "trending": ["#reels", "#tech", "#fashion", "#travel", "#photography"]
}
```

---

## 🧪 Testing

Install test dependencies and run pytest:

```bash
pip install -r requirements.txt
pytest tests/
```

Key test files:

- `tests/conftest.py` — app fixtures and setup
- `tests/test_api.py` — API route tests
- `tests/test_integration.py` — end-to-end integration tests

---

## ⚠️ Notes

- The app uses `sqlite:///hashtags.db` for storage.
- On first run, `app.py` creates the database and seeds initial sample hashtags.
- Hashtags are normalized to lowercase and prefixed with `#` if missing.

---

## 💡 Improvements

Possible next steps:

- Add database persistence for user-created hashtags
- Improve frontend design and mobile responsiveness
- Add authentication for admin hashtag management
- Add live hashtag analytics from an external API
