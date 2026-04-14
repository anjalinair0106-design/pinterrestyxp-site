import json
import pytest
from app import db, Hashtag


class TestFullApplicationFlow:
    def test_complete_hashtag_workflow(self, client):
        """Test a complete workflow: create, analyze, check trending."""
        # 1. Create a new hashtag
        create_data = {
            'tag': '#workflowtest',
            'popularity': 85,
            'related': ['#test', '#workflow'],
            'trend': [10, 15, 20, 25, 30, 35, 40],
            'isTrending': True
        }
        response = client.post('/hashtags', json=create_data)
        assert response.status_code == 201

        # 2. Analyze the created hashtag
        analyze_response = client.post('/analyze', json={'hashtag': '#workflowtest'})
        assert analyze_response.status_code == 200
        analyze_data = json.loads(analyze_response.data)
        assert analyze_data['popularity'] == 85
        assert '#test' in analyze_data['related']

        # 3. Check if it appears in trending
        trending_response = client.get('/trending')
        assert trending_response.status_code == 200
        trending_data = json.loads(trending_response.data)
        assert '#workflowtest' in trending_data['trending']

    def test_database_persistence(self, client):
        """Test that data persists across requests."""
        # Create hashtag
        client.post('/hashtags', json={
            'tag': '#persistent',
            'popularity': 90,
            'related': ['#persist'],
            'trend': [5, 10, 15, 20, 25, 30, 35],
            'isTrending': False
        })

        # Analyze in separate request
        response = client.post('/analyze', json={'hashtag': '#persistent'})
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['popularity'] == 90

    def test_seed_data_integrity(self, client):
        """Test that seed data is properly loaded and accessible."""
        # Test a few seed hashtags
        seed_hashtags = ['#tech', '#fashion', '#photography']
        for tag in seed_hashtags:
            response = client.post('/analyze', json={'hashtag': tag})
            assert response.status_code == 200
            data = json.loads(response.data)
            assert 'popularity' in data
            assert isinstance(data['related'], list)
            assert len(data['trend']) == 7

    def test_error_handling_integration(self, client):
        """Test error handling across the application."""
        # Test various error scenarios
        error_cases = [
            ({'hashtag': '#nonexistent'}, 404),
            ({'hashtag': ''}, 400),
            ({}, 400),
        ]

        for payload, expected_status in error_cases:
            response = client.post('/analyze', json=payload)
            assert response.status_code == expected_status
            data = json.loads(response.data)
            assert 'error' in data

    def test_trending_list_accuracy(self, client):
        """Test that trending list shows correct hashtags."""
        # Get trending list
        response = client.get('/trending')
        assert response.status_code == 200
        data = json.loads(response.data)

        # Verify each trending hashtag exists and is marked as trending
        for tag in data['trending']:
            hashtag = Hashtag.query.filter_by(tag=tag).first()
            assert hashtag is not None
            assert hashtag.is_trending == True

        # Verify non-trending hashtags are not in the list
        non_trending = Hashtag.query.filter_by(is_trending=False).all()
        for hashtag in non_trending:
            assert hashtag.tag not in data['trending']