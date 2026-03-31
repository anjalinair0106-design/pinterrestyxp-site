from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

# Mock function (later replace with API)
def analyze_hashtag(tag):
    popularity = random.randint(50, 100)

    related = [
        tag + "love",
        tag + "trend",
        tag + "viral",
        "insta" + tag,
        tag + "2026"
    ]

    trend_data = [random.randint(10, 100) for _ in range(7)]

    return {
        "popularity": popularity,
        "related": related,
        "trend": trend_data
    }

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/analyze", methods=["POST"])
def analyze():
    tag = request.json.get("hashtag")
    result = analyze_hashtag(tag)
    return jsonify(result)
@app.route("/trending")
def trending():
    trending_tags = [
        "#trending",
        "#viral",
        "#explorepage",
        "#instagood",
        "#reels",
        "#photography",
        "#fashion",
        "#love",
        "#motivation",
        "#tech"
    ]

    return {"trending": trending_tags}

if __name__ == "__main__":
    app.run(debug=True)