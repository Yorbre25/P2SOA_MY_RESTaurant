import unittest
import requests

def http_request(url, method, data=None):
    if method == "POST":
        response = requests.post(url, json=data)
    elif method == "GET":
        response = requests.get(url)
    else:
        raise ValueError("Invalid HTTP method")
    return response

url = "https://us-central1-smart-spark-418815.cloudfunctions.net/reservation-service"

class TestReservationService(unittest.TestCase):

    def test_wrong_method(self): # Checks that the POST method fails
        response = http_request(url, "GET")
        self.assertEqual(response.status_code, 405)

    def test_invalid_date_format(self): # Checks validation for invalid date format
        data = {"fecha": "2023/01/01", "hora": "08:00"}
        response = http_request(url, "POST", data)
        self.assertEqual(response.status_code, 400)

    def test_invalid_time_format(self): # Checks validation for invalid time format
        data = {"fecha": "2023-01-01", "hora": "08-00"}
        response = http_request(url, "POST", data)
        self.assertEqual(response.status_code, 400)

    def test_available_time_slot(self): # Checks availability for a valid time slot
        data = {"fecha": "2023-01-01", "hora": "08:00"}
        response = http_request(url, "POST", data)
        body = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertTrue(body["available"])

    def test_unavailable_time_slot(self): # Checks unavailability for an occupied time slot
        data = {"fecha": "2024-05-15", "hora": "19:00"}
        response = http_request(url, "POST", data)
        body = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertFalse(body["available"])
        self.assertIn("alternative_date", body)
        self.assertIn("alternative_time", body)

    def test_missing_fields(self): # Checks handling of missing fields
        data = {"fecha": "2023-01-01"} # Missing 'hora' field
        response = http_request(url, "POST", data)
        self.assertEqual(response.status_code, 400)

if __name__ == '__main__':
    unittest.main()
