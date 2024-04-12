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

url = "https://backendcloudfunc-x3adwyscpa-uc.a.run.app"

class TestReservationService(unittest.TestCase):

    def test_wrong_method(self): # Checks that the POST method fails
        response = http_request(f"{url}/get-reservations", "GET")
        self.assertEqual(response.status_code, 405)

    def test_invalid_date_format(self): # Checks validation for invalid date format
        data = {"fecha": "2023/01/01", "hora": "08:00"}
        response = http_request(f"{url}/get-reservations", "POST", data)
        self.assertEqual(response.status_code, 400)

    def test_invalid_time_format(self): # Checks validation for invalid time format
        data = {"fecha": "2023-01-01", "hora": "08-00"}
        response = http_request(f"{url}/get-reservations", "POST", data)
        self.assertEqual(response.status_code, 400)

    def test_available_time_slot(self): # Checks availability for a valid time slot
        data = {"fecha": "2023-01-01", "hora": "08:00"}
        response = http_request(f"{url}/get-reservations", "POST", data)
        body = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertTrue(body["available"])

    def test_unavailable_time_slot(self): # Checks unavailability for an occupied time slot
        data = {"fecha": "2024-05-15", "hora": "19:00"}
        response = http_request(f"{url}/get-reservations", "POST", data)
        body = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertFalse(body["available"])
        self.assertIn("alternative_date", body)
        self.assertIn("alternative_time", body)

    def test_missing_fields(self): # Checks handling of missing fields
        data = {"fecha": "2023-01-01"} # Missing 'hora' field
        response = http_request(f"{url}/get-reservations", "POST", data)
        self.assertEqual(response.status_code, 400)


class TestSentimentService(unittest.TestCase):

    def test_wrong_method(self): #checks that the GET method fails
        response=http_request(f"{url}/sentiment-api","GET",{})
        self.assertEqual(response.status_code, 405)
    
    def test_missing_key(self): #checks the output result
        request_body={
            "wrong_key":"" #wrong key
            }
        response=http_request(f"{url}/sentiment-api","POST",request_body)
        self.assertEqual(response.status_code,400)

    def test_wrong_key_type(self): #checks the output result
        request_body={
            "review": [], #wrong type
            }
        response=http_request(f"{url}/sentiment-api","POST",request_body)
        self.assertEqual(response.status_code,400)

    def test_empty_message(self): #checks the output result
        request_body={
            "review": "", #empty message
            }
        response=http_request(f"{url}/sentiment-api","POST",request_body)
        response_json=response.json()
        self.assertEqual(response.status_code,200)
        self.assertEqual(response_json['scale'],0) #scale 0
        self.assertEqual(response_json['msg'],"no valid review message, please review your message") # msg no valid
    
    def test_very_possitive_msg(self):
        request_body={
            "review": "I loved the food. The pasta was really amazing and the wait was quite short. I will come back as soon as I can", #Very possitive message
            }
        response=http_request(f"{url}/sentiment-api","POST",request_body)
        response_json=response.json()

        self.assertEqual(response.status_code,200)

        self.assertEqual(response_json['scale'],4)

    def test_very_negative_msg(self):
        request_body={
            "review": "The worse, the food was awful and the wait was too long", #Very possitive message
            }
        response=http_request(f"{url}/sentiment-api","POST",request_body)
        response_json=response.json()

        self.assertEqual(response.status_code,200)

        self.assertEqual(response_json['scale'],0)

class TestMenuService(unittest.TestCase):

    def test_wrong_method(self): #checks that the POST method fails
        response=http_request(f"{url}/get-menu","POST")
        self.assertEqual(response.status_code, 405)
    
    def test_result_format(self): #checks the output result
        response=http_request(f"{url}/get-menu","GET")
        body=response.json()
        self.assertEqual(type(body['main_dishes']),list)
        self.assertEqual(type(body['drinks']),list)
        self.assertEqual(type(body['desserts']),list)

class TestRecommendationService(unittest.TestCase):

    def test_wrong_method(self): #checks that the GET method fails
        response=http_request(f"{url}/get-recommendation","GET",{})
        self.assertEqual(response.status_code, 405)
    
    def test_missing_key(self): #checks the output result
        request_body={
            "meal":{
            "main_dish":"Pizza",
            "hola":"",  #changed to avoid drinks to be recieved
            "dessert":""
                    },
            "recommendation_of":["drink"]
            }
        response=http_request(f"{url}/get-recommendation","POST",request_body)
        self.assertEqual(response.status_code,400)

    def test_wrong_key_type(self): #checks the output result
        request_body={
            "meal": [], #wrong type
            "recommendation_of":["drink"]
            }
        response=http_request(f"{url}/get-recommendation","POST",request_body)
        self.assertEqual(response.status_code,400)
    
    def test_empty_list(self): #checks the output result
        request_body={
            "meal":{
            "main_dish":"Pizza",
            "drink":"", 
            "dessert":""
                    },
            "recommendation_of":[] #empty list
            }
        response=http_request(f"{url}/get-recommendation","POST",request_body)
        self.assertEqual(response.status_code,400)


    def test_no_existing_element(self): #checks the output result
        request_body={
            "meal":{
            "main_dish":"xmtuvasdfasdf", #element does not exist in the menu
            "drink":"",  
            "dessert":""
                    },
            "recommendation_of":["dessert"]
            }
        response=http_request(f"{url}/get-recommendation","POST",request_body)
        self.assertEqual(response.status_code,400)

    def test_mirror_no_existing(self): #checks the output result
        request_body={
            "meal":{
            "main_dish":"Pizza", #element does not exist in the menu
            "drink":"Coke",  
            "dessert":"Sweets"
                    },
            "recommendation_of":["dessert"]
            }
        response=http_request(f"{url}/get-recommendation","POST",request_body)
        self.assertEqual(response.status_code,200)   

    def test_mirror_existing(self): #checks the output result
        request_body={
            "meal":{
            "main_dish":"pizza", #element does not exist in the menu
            "drink":"coke",  
            "dessert":"ice cream"
                    },
            "recommendation_of":["dessert"]
            }
        response=http_request(f"{url}/get-recommendation","POST",request_body)
        self.assertEqual(response.status_code,200)  
        response_body=response.json()
        self.assertEqual(response_body['main_dish'],"pizza") 
        self.assertEqual(response_body['drink'],"coke")
        self.assertEqual(response_body['dessert'],"ice cream")         
  
if __name__ == '__main__':
    unittest.main()
