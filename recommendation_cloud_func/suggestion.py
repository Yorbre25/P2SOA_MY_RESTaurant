import random

from models import Meal
from database import IDataSource, init_data_source



class PredefinedRecommender:
    def __init__(self, data_source: IDataSource):
        self.data_source = data_source


    def recommend(self, user_meal : Meal, recommendation_of: list[str]):
        user_meal = user_meal.__dict__
        candidate_food_by_type = self.get_candidate_food_by_type(user_meal)
        self.are_inputs_valid(candidate_food_by_type, recommendation_of)
        for item in recommendation_of:
            if item == "main_dish" and user_meal["main_dish"] == "":
                user_meal["main_dish"] = random.choice(candidate_food_by_type["main_dish"])
            elif item == "drink" and user_meal["drink"] == "":
                user_meal["drink"] = random.choice(candidate_food_by_type["drink"])
            elif item == "dessert" and user_meal["dessert"] == "":
                user_meal["dessert"] = random.choice(candidate_food_by_type["dessert"])
        return Meal(**user_meal)
    
    def get_candidate_food_by_type(self, user_meal):
        cadidate_food_by_type = {}
        cadidate_food_by_type["main_dish"] = []
        cadidate_food_by_type["drink"] = []
        cadidate_food_by_type["dessert"] = []
        for key,food in user_meal.items():
            meal = self.data_source.get_meal(food)
            cadidate_food_by_type = self.add_candidate_meal(cadidate_food_by_type, meal)
        return self.remove_empty_meals(cadidate_food_by_type)
    
    def are_inputs_valid(self, posible_food_by_type, recommendation_of):
        self.check_recommendation_of(recommendation_of)
        self.check_if_enough(posible_food_by_type)
    
    def check_recommendation_of(self, recommendation_of):
        if len(recommendation_of) == 0:
            raise ValueError("The recommendation_of list can not be empty.")
        for item in recommendation_of:
            if item not in ["main_dish", "drink", "dessert"]:
                raise ValueError("Invalid recommendation type: " + item)        

    def check_if_enough(self, posible_food_by_type):
        if len(posible_food_by_type["main_dish"]) == 0:
            raise ValueError("There are no recommendations available for your input. Please try another one.")
    
    
    def add_candidate_meal(self, posible_meals, meal):
        posible_meals["main_dish"].append(meal["main_dish"])
        posible_meals["drink"].append(meal["drink"])
        posible_meals["dessert"].append(meal["dessert"])
        return posible_meals
    
        
    def remove_empty_meals(self, posible_meals):
        for key in posible_meals:
            posible_meals[key] = list(filter(None, posible_meals[key]))
        return posible_meals
    
    
def get_predefined_recom(meal: Meal, recomendation_of: list[str]) -> str:
    
    response = predefined_recommender.recommend(meal, recomendation_of)
    return response
  


def init_default_recommender(data_source):
    return PredefinedRecommender(data_source)

data_source = init_data_source()
predefined_recommender = init_default_recommender(data_source)

