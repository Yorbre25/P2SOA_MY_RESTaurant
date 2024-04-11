from locust import HttpUser, task, between

class WebsiteUser(HttpUser):
    wait_time = between(1, 5)  # Time between tasks, simulating realistic user behavior.

    @task
    def post_reservation_request(self):
        url = "/reservation-service"
        data = {"fecha": "2023-01-01", "hora": "08:00"}  # Example data for reservation checking.
        headers = {'Content-Type': 'application/json'}
        self.client.post(url, json=data, headers=headers)
