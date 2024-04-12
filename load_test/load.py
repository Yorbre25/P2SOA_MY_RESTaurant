from locust import HttpUser, task, between, tag
import time


review_body={
    "review": "I loved the food. The pasta was really amazing and the wait was quite short. I will come back as soon as I can", #Very possitive message
}
recommendation_body={
    "meal":{
    "main_dish":"pizza", 
    "drink":"coke",  
    "dessert":"ice cream"
            },
    "recommendation_of":["dessert"]
}
review_reservation = {"fecha": "2023-01-01", "hora": "08:00"}  # Example data for reservation checking.

class User(HttpUser):
    @task
    def get_menu(self):
        url="/menu_service"
        self.client.get(url)
    @task
    def get_reservation_data(self):
        url="/reservation-data"
        self.client.get(url)
    @task
    def post_reservation_request(self):
        url = "/reservation-service"
        headers = {'Content-Type': 'application/json'}
        self.client.post(url, json=review_reservation, headers=headers)
    @task
    def post_sentiment_analysis_request(self):
        url = "/Sentiment_Review"
        headers = {'Content-Type': 'application/json'}
        self.client.post(url, json=review_body, headers=headers)
    @task
    def post_recommendation_request(self):
        url = "/Recommendation_Items"
        headers = {'Content-Type': 'application/json'}
        self.client.post(url, json=recommendation_body, headers=headers)