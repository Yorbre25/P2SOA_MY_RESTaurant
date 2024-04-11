
import requests
url="https://backendcloudfunc-x3adwyscpa-uc.a.run.app/get-menu"

def request_restaurant_menu():
    response=requests.get(url)
    return response.json(),response.status_code

def build_format(menu_json):
    main_dishes=menu_json["main_dishes"]
    drinks=menu_json["drinks"]
    desserts=menu_json["desserts"]
    formated_menu=[]
    for i in range(len(main_dishes)):
        meal={
            "main_dish":main_dishes[i],
            "drink":drinks[i],
            "dessert":desserts[i]
        }
        formated_menu.append(meal)
    return formated_menu

def get_menu():
    menu,status_code=request_restaurant_menu()
    if(status_code!=200):
        return []
    formatted_menu=build_format(menu)
    return formatted_menu
