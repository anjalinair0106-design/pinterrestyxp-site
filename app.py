from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///hashtags.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


class Hashtag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tag = db.Column(db.String(100), unique=True, nullable=False)
    popularity = db.Column(db.Integer, nullable=False)
    related = db.Column(db.JSON, nullable=False, default=list)
    trend = db.Column(db.JSON, nullable=False, default=list)
    is_trending = db.Column(db.Boolean, nullable=False, default=False)


SEED_HASHTAGS = [
    {
        "tag": "#tech",
        "popularity": 92,
        "related": ["#innovation", "#gadgets", "#ai", "#coding", "#startups"],
        "trend": [68, 72, 74, 79, 84, 88, 92],
        "is_trending": True,
    },
    {
        "tag": "#fashion",
        "popularity": 87,
        "related": ["#style", "#ootd", "#streetstyle", "#luxury", "#runway"],
        "trend": [60, 65, 67, 73, 79, 82, 87],
        "is_trending": True,
    },
    {
        "tag": "#photography",
        "popularity": 84,
        "related": ["#portrait", "#travelgram", "#dslr", "#moodygrams", "#creative"],
        "trend": [58, 62, 66, 70, 75, 80, 84],
        "is_trending": True,
    },
    {
        "tag": "#reels",
        "popularity": 95,
        "related": ["#videocontent", "#creator", "#trendingaudio", "#viralvideo", "#explore"],
        "trend": [75, 78, 81, 86, 89, 93, 95],
        "is_trending": True,
    },
    {
        "tag": "#python",
        "popularity": 89,
        "related": ["#programming", "#developer", "#datascience", "#flask", "#machinelearning"],
        "trend": [64, 69, 71, 76, 81, 85, 89],
        "is_trending": False,
    },
    {
        "tag": "#travel",
        "popularity": 83,
        "related": ["#wanderlust", "#trip", "#vacation", "#adventure", "#exploremore"],
        "trend": [55, 59, 63, 68, 73, 78, 83],
        "is_trending": True,
    },
]


def seed_database():
    if Hashtag.query.first():
        return

    for item in SEED_HASHTAGS:
        db.session.add(Hashtag(**item))

    db.session.commit()


def serialize_hashtag(hashtag):
    return {
        "popularity": hashtag.popularity,
        "related": hashtag.related,
        "trend": hashtag.trend,
    }


def normalize_hashtag(tag):
    cleaned = (tag or "").strip().lower()
    if not cleaned:
        return ""
    return cleaned if cleaned.startswith("#") else f"#{cleaned}"


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/analyze", methods=["POST"])
def analyze():
    payload = request.get_json(silent=True) or {}
    tag = (payload.get("hashtag") or "").strip()

    if not tag:
        return jsonify({"error": "Please provide a hashtag."}), 400

    normalized_tag = normalize_hashtag(tag)
    hashtag = Hashtag.query.filter_by(tag=normalized_tag).first()

    if not hashtag:
        return jsonify({"error": f"{normalized_tag} was not found in the database."}), 404

    return jsonify(serialize_hashtag(hashtag))


@app.route("/hashtags", methods=["POST"])
def create_hashtag():
    payload = request.get_json(silent=True) or {}

    tag = normalize_hashtag(payload.get("tag"))
    related = payload.get("related") or []
    trend = payload.get("trend") or []
    popularity = payload.get("popularity")
    is_trending = bool(payload.get("isTrending"))

    if not tag:
        return jsonify({"error": "Hashtag is required."}), 400

    if Hashtag.query.filter_by(tag=tag).first():
        return jsonify({"error": f"{tag} already exists."}), 409

    if not isinstance(popularity, int) or popularity < 0 or popularity > 100:
        return jsonify({"error": "Popularity must be a number between 0 and 100."}), 400

    if not isinstance(related, list) or not all(isinstance(item, str) and item.strip() for item in related):
        return jsonify({"error": "Related hashtags must be a list of non-empty values."}), 400

    if not isinstance(trend, list) or len(trend) != 7 or not all(isinstance(value, int) and value >= 0 for value in trend):
        return jsonify({"error": "Trend data must contain exactly 7 non-negative whole numbers."}), 400

    hashtag = Hashtag(
        tag=tag,
        popularity=popularity,
        related=[normalize_hashtag(item) for item in related],
        trend=trend,
        is_trending=is_trending,
    )
    db.session.add(hashtag)
    db.session.commit()

    return jsonify({
        "message": f"{tag} saved successfully.",
        "hashtag": serialize_hashtag(hashtag),
        "tag": hashtag.tag,
    }), 201


@app.route("/trending")
def trending():
    trending_tags = (
        Hashtag.query.filter_by(is_trending=True)
        .order_by(Hashtag.popularity.desc())
        .limit(10)
        .all()
    )

    return {"trending": [tag.tag for tag in trending_tags]}


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        seed_database()
    app.run(debug=True)
