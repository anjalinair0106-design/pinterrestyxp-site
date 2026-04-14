# 📊 Hashtag Analyzer

> A sleek, interactive web app that instantly analyzes hashtags — revealing popularity scores, related tags, and weekly trend visualizations.

![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-2.x-000000?style=flat&logo=flask&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.x-FF6384?style=flat&logo=chartdotjs&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔥 **Popularity Score** | Instantly evaluates a hashtag's performance and reach |
| 🔗 **Related Hashtags** | Suggests similar and trending tags to expand your strategy |
| 📈 **Trend Visualization** | Interactive weekly trend graph powered by Chart.js |
| 📌 **Trending Board** | Live board showing currently trending hashtags |
| 🖱️ **Clickable Tags** | Click any hashtag to analyze it instantly |
| ⚡ **Fast & Responsive** | Smooth UI that works great on all screen sizes |

---

## 🖼️ Preview

<!-- Add a screenshot here -->
> _Add a screenshot or GIF of the app here to make this section shine!_

---

## 🛠️ Tech Stack

- **Backend** — [Flask](https://flask.palletsprojects.com/) (Python)
- **Frontend** — HTML5, CSS3, Vanilla JavaScript
- **Visualization** — [Chart.js](https://www.chartjs.org/)

---

## 📂 Project Structure

```
hashtag-analyzer/
│
├── app.py                  # Flask backend & API routes
├── requirements.txt        # Python dependencies
├── README.md               # Project documentation
├── templates/
│   └── index.html          # Main HTML template
├── static/
│   ├── style.css           # Styling & layout
│   └── script.js           # Frontend logic & Chart.js integration
└── tests/                  # Test suite
    ├── __init__.py
    ├── conftest.py         # Pytest fixtures
    ├── test_api.py         # Unit tests for API endpoints
    └── test_integration.py # Integration tests
```

## 🧪 Testing

This project includes comprehensive unit and integration tests using pytest.

### Running Tests

```bash
# Install test dependencies
pip install -r requirements.txt

# Run all tests
pytest tests/

# Run with verbose output
pytest tests/ -v

# Run specific test file
pytest tests/test_api.py

# Run specific test
pytest tests/test_api.py::TestAnalyzeRoute::test_analyze_existing_hashtag
```

### Test Structure

- `tests/conftest.py`: Pytest fixtures for test app and database setup
- `tests/test_api.py`: Unit tests for API endpoints
- `tests/test_integration.py`: Integration tests for full application workflows

Tests use an in-memory SQLite database for isolation and speed.
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- pip

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/hashtag-analyzer.git
   cd hashtag-analyzer
   ```

2. **Install dependencies**
   ```bash
   pip install flask
   ```

3. **Run the app**
   ```bash
   python app.py
   ```

4. **Open in your browser**
   ```
   http://127.0.0.1:5000
   ```

---

## 📖 How It Works

1. Enter any hashtag (e.g., `#python`) in the search bar
2. The app calculates a **popularity score** based on usage patterns
3. A **weekly trend graph** shows how the hashtag has performed over time
4. **Related hashtags** are suggested to help you discover similar content
5. The **trending board** highlights the hottest hashtags right now
6. Click any hashtag on the board to analyze it instantly

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

- 🐛 Report bugs via [Issues](https://github.com/your-username/hashtag-analyzer/issues)
- 💡 Suggest features or improvements
- 🔧 Submit a pull request

### Steps to Contribute

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "Add your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👤 Author

**Anjali Nair**  
[@anjalinair0106](https://github.com/anjalinair0106)....

---

_If you found this useful, consider giving it a ⭐ — it helps a lot!_
