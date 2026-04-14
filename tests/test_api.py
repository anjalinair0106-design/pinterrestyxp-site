import json
import pytest
from app import db, Hashtag


class TestHomeRoute:
    def test_home_route(self, client):
        """Test the home route returns the index template."""
        response = client.get('/')
        assert response.status_code == 200
        assert b'Hashtag Analyzer' in response.data


class TestAnalyzeRoute:
    def test_analyze_existing_hashtag(self, client):
        """Test analyzing an existing hashtag."""
        response = client.post('/analyze', json={'hashtag': '#tech'})
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'popularity' in data
        assert 'related' in data
        assert 'trend' in data
        assert data['popularity'] == 92

    def test_analyze_nonexistent_hashtag(self, client):
        """Test analyzing a nonexistent hashtag."""
        response = client.post('/analyze', json={'hashtag': '#nonexistent'})
        assert response.status_code == 404
        data = json.loads(response.data)
        assert 'error' in data

    def test_analyze_empty_hashtag(self, client):
        """Test analyzing with empty hashtag."""
        response = client.post('/analyze', json={'hashtag': ''})
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data

    def test_analyze_missing_hashtag(self, client):
        """Test analyzing with missing hashtag field."""
        response = client.post('/analyze', json={})
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data


class TestCreateHashtagRoute:
    def test_create_hashtag_success(self, client):
        """Test creating a new hashtag successfully."""
        data = {
            'tag': '#testtag',
            'popularity': 75,
            'related': ['#test1', '#test2'],
            'trend': [10, 20, 30, 40, 50, 60, 70],
            'isTrending': True
        }
        response = client.post('/hashtags', json=data)
        assert response.status_code == 201
        response_data = json.loads(response.data)
        assert 'message' in response_data
        assert '#testtag' in response_data['message']

        # Verify it was added to database
        hashtag = Hashtag.query.filter_by(tag='#testtag').first()
        assert hashtag is not None
        assert hashtag.popularity == 75

    def test_create_duplicate_hashtag(self, client):
        """Test creating a hashtag that already exists."""
        data = {
            'tag': '#tech',  # Already exists
            'popularity': 80,
            'related': ['#test'],
            'trend': [1, 2, 3, 4, 5, 6, 7],
            'isTrending': False
        }
        response = client.post('/hashtags', json=data)
        assert response.status_code == 409
        response_data = json.loads(response.data)
        assert 'error' in response_data

    def test_create_hashtag_invalid_popularity(self, client):
        """Test creating hashtag with invalid popularity."""
        data = {
            'tag': '#invalid',
            'popularity': 150,  # Invalid
            'related': ['#test'],
            'trend': [1, 2, 3, 4, 5, 6, 7],
            'isTrending': False
        }
        response = client.post('/hashtags', json=data)
        assert response.status_code == 400
        response_data = json.loads(response.data)
        assert 'error' in response_data

    def test_create_hashtag_invalid_trend_length(self, client):
        """Test creating hashtag with invalid trend length."""
        data = {
            'tag': '#invalid',
            'popularity': 50,
            'related': ['#test'],
            'trend': [1, 2, 3],  # Invalid length
            'isTrending': False
        }
        response = client.post('/hashtags', json=data)
        assert response.status_code == 400
        response_data = json.loads(response.data)
        assert 'error' in response_data

    def test_create_hashtag_missing_tag(self, client):
        """Test creating hashtag without tag."""
        data = {
            'popularity': 50,
            'related': ['#test'],
            'trend': [1, 2, 3, 4, 5, 6, 7],
            'isTrending': False
        }
        response = client.post('/hashtags', json=data)
        assert response.status_code == 400
        response_data = json.loads(response.data)
        assert 'error' in response_data


class TestTrendingRoute:
    def test_trending_route(self, client):
        """Test the trending route returns trending hashtags."""
        response = client.get('/trending')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'trending' in data
        assert isinstance(data['trending'], list)
        # Should include some trending hashtags from seed data
        assert len(data['trending']) > 0