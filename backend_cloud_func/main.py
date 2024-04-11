from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

express_service_url = "http://<IP_DEL_SERVICIO>:<PUERTO>"
base_url = 'https://us-central1-smart-spark-418815.cloudfunctions123.net'

@app.route('/create-reservation', methods=['POST'])
def create_reservation():
    try:
        # Hacer una solicitud POST al servicio de ExpressJS
        response = requests.post(f"{express_service_url}/create-reservation", json=request.json)
        return jsonify(response.json()), response.status_code, {'Access-Control-Allow-Origin': '*'}
    except Exception as e:
        return jsonify({"message": f"Error: {e}"}), response.status_code, {}

@app.route('/get-reservations', methods=['GET'])
def get_reservations():
    try:
        # Hacer una solicitud GET al servicio de ExpressJS
        response = requests.get(f"{express_service_url}/get-reservations")
        return jsonify(response.json()), response.status_code, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        return jsonify({"message": f"Error: no se pudo accesar al servicio de reservas {e}"}), response.status_code, {}


@app.route('/recommend-reservation-time', methods=['GET'])
def recommend_reservation_time():

    try:
        # Hacer una solicitud GET al servicio de ExpressJS
        response = requests.get(f"{express_service_url}/recommend-reservation-time", params=request.args)
        return jsonify(response.json()), response.status_code, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        return jsonify({"message": f"Error: {e}"}), response.status_code, {}

@app.route('/sentiment-api', methods=['POST'])
def sentiment_api():
    try:
        response = requests.post(f"{base_url}/Sentiment_Review", json=request.json)
        return jsonify(response.text), response.status_code, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        return jsonify({"message": f"Error: {e}"}), response.status_code, {}


@app.route('/get-recommendation', methods=['POST'])
def get_recommendation():
    try:
        # Hacer una solicitud POST al servicio de Sentiment Analysis
        response = requests.post(f"{base_url}/Recommendation_Items", json=request.json)
        return jsonify(response.text), response.status_code, {'Access-Control-Allow-Origin': '*'}
    except Exception as e:
        return jsonify({"message": f"Error: {e}"}), response.status_code, {}


@app.route('/get-menu', methods=['GET'])
def get_menu():
    try:
        response = requests.get(f"{base_url}/menu_service")
        response.raise_for_status()  # Raise exception for non-200 status codes
        return jsonify(response.json()), response.status_code, {'Access-Control-Allow-Origin': '*'}
    except requests.exceptions.RequestException as e:
        return jsonify({"message": f"Error: {e}"}), response.status_code, {}  # Internal Server Error

@app.route('/')
def index():
    return 'Welcome to the MYRESTaurant Reservation System!'

if __name__ == '__main__':
    app.run(debug=True, port=8080)
