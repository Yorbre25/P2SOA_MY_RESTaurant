import unittest

import requests
def http_request(url,method,body):
    if(method=="POST"):
        response=requests.post(url,json=body)
    else:
        response=requests.get(url)
    return response

url="https://us-central1-smart-spark-418815.cloudfunctions.net/Recommendation_Items"


class TestStringMethods(unittest.TestCase):

    def test_wrong_method(self): #checks that the GET method fails
        response=http_request(url,"GET",{})
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
        response=http_request(url,"POST",request_body)
        self.assertEqual(response.status_code,400)

    def test_wrong_key_type(self): #checks the output result
        request_body={
            "meal": [], #wrong type
            "recommendation_of":["drink"]
            }
        response=http_request(url,"POST",request_body)
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
        response=http_request(url,"POST",request_body)
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
        response=http_request(url,"POST",request_body)
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
        response=http_request(url,"POST",request_body)
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
        response=http_request(url,"POST",request_body)
        self.assertEqual(response.status_code,200)  
        response_body=response.json()
        self.assertEqual(response_body['main_dish'],"pizza") 
        self.assertEqual(response_body['drink'],"coke")
        self.assertEqual(response_body['dessert'],"ice cream")         
  

if __name__ == '__main__':
    unittest.main()