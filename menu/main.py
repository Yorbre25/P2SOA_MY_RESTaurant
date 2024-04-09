import functions_framework
from menu import get_restaurant_menu

@functions_framework.errorhandler(AssertionError)
def handle_assertion_error(e):
    return "Method not allowed", 405


@functions_framework.http
def get_menu(request):

    assert request.method == "GET" #checking that the only method used is GET
    menu_json=get_restaurant_menu()

    
    return menu_json,200
