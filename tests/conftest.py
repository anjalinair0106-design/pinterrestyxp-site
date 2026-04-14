import pytest
from app import app, db, Hashtag, SEED_HASHTAGS, seed_database


@pytest.fixture
def test_app():
    """Create and configure a test app instance."""
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    with app.app_context():
        db.create_all()
        seed_database()

        yield app

        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(test_app):
    """A test client for the app."""
    return test_app.test_client()


@pytest.fixture
def runner(test_app):
    """A test runner for the app's Click commands."""
    return test_app.test_cli_runner()