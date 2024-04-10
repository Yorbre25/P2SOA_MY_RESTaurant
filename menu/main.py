import functions_framework
from menu import get_restaurant_menu

@functions_framework.errorhandler(AssertionError)
def handle_assertion_error(e):
    return "Method not allowed", 405


@functions_framework.http
def get_menu(request):

    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }


    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    assert request.method == "GET" #checking that the only method used is GET
    menu_json=get_restaurant_menu()

    
    return menu_json,200,headers
