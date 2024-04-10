import requests
import unittest

url="https://us-central1-smart-spark-418815.cloudfunctions.net/Sentiment_Review"
def http_request(url,method,body):
    if(method=="POST"):
        response=requests.post(url,json=body)
    else:
        response=requests.get(url)
    return response

class TestStringMethods(unittest.TestCase):

    def test_wrong_method(self): #checks that the GET method fails
        response=http_request(url,"GET",{})
        self.assertEqual(response.status_code, 405)
    
    def test_missing_key(self): #checks the output result
        request_body={
            "wrong_key":"" #wrong key
            }
        response=http_request(url,"POST",request_body)
        self.assertEqual(response.status_code,400)

    def test_wrong_key_type(self): #checks the output result
        request_body={
            "review": [], #wrong type
            }
        response=http_request(url,"POST",request_body)
        self.assertEqual(response.status_code,400)

    def test_empty_message(self): #checks the output result
        request_body={
            "review": "", #empty message
            }
        response=http_request(url,"POST",request_body)
        response_json=response.json()
        self.assertEqual(response.status_code,200)
        self.assertEqual(response_json['scale'],0) #scale 0
        self.assertEqual(response_json['msg'],"no valid review message, please review your message") # msg no valid
    
    def test_very_possitive_msg(self):
        request_body={
            "review": "I loved the food. The pasta was really amazing and the wait was quite short. I will come back as soon as I can", #Very possitive message
            }
        response=http_request(url,"POST",request_body)
        response_json=response.json()

        self.assertEqual(response.status_code,200)

        self.assertEqual(response_json['scale'],4)

    def test_very_negative_msg(self):
        request_body={
            "review": "The worse, the food was awful and the wait was too long", #Very possitive message
            }
        response=http_request(url,"POST",request_body)
        response_json=response.json()

        self.assertEqual(response.status_code,200)

        self.assertEqual(response_json['scale'],0)

    
if __name__ == '__main__':
    unittest.main()