from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

base_url = 'https://us-central1-smart-spark-418815.cloudfunctions.net'

@app.route('/get-reservations', methods=['POST'])
def get_reservations():
    try:
        # Hacer una solicitud GET al servicio de reservas
        response = requests.post(f"{base_url}/reservation-service", json=request.json)
        return jsonify(response.json()), response.status_code

    except Exception as e:
        return jsonify({"message": f"Error: {e}"}), response.status_code

@app.route('/sentiment-api', methods=['POST'])
def sentiment_api():
    try:
        # Hacer una solicitud GET al servicio de sentiment
        response = requests.post(f"{base_url}/Sentiment_Review", json=request.json)
        return jsonify(response.json()), response.status_code

    except Exception as e:
        return jsonify({"message": f"Error: {e}"}), response.status_code

@app.route('/get-recommendation', methods=['POST'])
def get_recommendation():
    try:
        # Hacer una solicitud POST al servicio de Sentiment Analysis
        response = requests.post(f"{base_url}/Recommendation_Items", json=request.json)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"message": f"Error: {e}"}), response.status_code


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
