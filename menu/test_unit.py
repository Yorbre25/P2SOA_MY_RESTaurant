import unittest

import requests
def http_request(url,method):
    if(method=="POST"):
        response=requests.post(url)
    else:
        response=requests.get(url)
    return response

url="https://us-central1-smart-spark-418815.cloudfunctions.net/menu_service"


class TestStringMethods(unittest.TestCase):

    def test_wrong_method(self): #checks that the POST method fails
        response=http_request(url,"POST")
        self.assertEqual(response.status_code, 405)
    
    def test_result_format(self): #checks the output result
        response=http_request(url,"GET")
        body=response.json()
        self.assertEqual(type(body['main_dishes']),list)
        self.assertEqual(type(body['drinks']),list)
        self.assertEqual(type(body['desserts']),list)

  

if __name__ == '__main__':
    unittest.main()