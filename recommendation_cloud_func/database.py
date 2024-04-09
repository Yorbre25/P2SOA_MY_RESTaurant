from models import Meal
from abc import ABC, abstractmethod
from menu_retriever import get_menu

def init_data_source():
    return JsonDataSource()
class IDataSource(ABC):
    @abstractmethod
    def get_meal(self, input: str) -> None:
        pass

class JsonDataSource(IDataSource):
    def __init__(self):
        self.meals = get_menu()

    def get_meal(self, input_food : str):
        for meal in self.meals:
            for food_type, db_food in meal.items():
                if input_food.lower() == db_food.lower():
                    return meal
        return Meal().__dict__
