import json

def get_restaurant_menu():
    menu={}
    with open('menu.json') as json_menu:
        menu = json.load(json_menu)
    return menu