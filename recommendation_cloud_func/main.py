import functions_framework
from models import Meal
from pydantic import ValidationError
from suggestion import get_predefined_recom
import json

@functions_framework.errorhandler(AssertionError) #to check Post method
def handle_assertion_error(e):
    body={
        "msg":"Method not allowed"
    }
    return body, 405

@functions_framework.errorhandler(KeyError) #"Check json input structure. The json should have a meal object a a recommmendation_of's list of string"
def handle_key_error(e):
    body={
        "msg": "Bad request the json must hava a meal and a recommendation of keys. The meal must have the fields: main_dish,drink and dessert"
    }
    return body, 400

@functions_framework.errorhandler(ValidationError) #"Checks the meal object type and the type of recommedation of"
def handle_validation_error(e):
    body={
        "msg":"Bad request the wrong type for either meal for recommendation_of"
    }
    return body , 400

@functions_framework.errorhandler(ValueError) #"If the main_dish/drink/dessert or type of item does not exist in the database"
def handle_value_error(e):
    body={
        "msg":str(e)
    }
    return body, 400

@functions_framework.errorhandler(TypeError) #"If the main_dish/drink/dessert or type of item does not exist in the database"
def handle_type_error(e):
    body= {
        "msg": "The item selected its not in the database"
    }
    return body, 400

@functions_framework.http
def recommendations(request):
    
    assert request.method == "POST" #checking that the only method used is POST


    request_json = request.get_json(silent=True)
    meal,recommedation_of=process_input(request_json)
    suggestion=get_predefined_recom(meal,recommedation_of)
    return suggestion.json(),200

def process_input(request_json):
    meal_json=request_json['meal']
    meal = Meal(main_dish=meal_json["main_dish"], drink=meal_json["drink"],dessert=meal_json["dessert"])
    recommedation_of=request_json['recommendation_of']
    if(type(recommedation_of) != list):
        raise ValidationError()
    return meal,recommedation_of

