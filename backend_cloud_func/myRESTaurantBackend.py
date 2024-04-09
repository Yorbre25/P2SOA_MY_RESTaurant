from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# URL del servicio de ExpressJS
express_service_url = "http://<IP_DEL_SERVICIO>:<PUERTO>"
sentiment_service_url = "http://<IP_DEL_SERVICIO_SENTIMENT>:<PUERTO_SENTIMENT>"

@app.route('/create-reservation', methods=['POST'])
def create_reservation():
    try:
        # Hacer una solicitud POST al servicio de ExpressJS
        response = requests.post(f"{express_service_url}/create-reservation", json=request.json)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"message": f"Error: {e}"}), 500

@app.route('/get-reservations', methods=['GET'])
def get_reservations():
    try:
        # Hacer una solicitud GET al servicio de ExpressJS
        response = requests.get(f"{express_service_url}/get-reservations")
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"message": f"Error: {e}"}), 500

@app.route('/recommend-reservation-time', methods=['GET'])
def recommend_reservation_time():
    try:
        # Hacer una solicitud GET al servicio de ExpressJS
        response = requests.get(f"{express_service_url}/recommend-reservation-time", params=request.args)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"message": f"Error: {e}"}), 500

@app.route('/sentiment-api', methods=['POST'])
def sentiment_api():
    try:
        # Hacer una solicitud POST al servicio de Sentiment Analysis
        response = requests.post(f"{sentiment_service_url}/sentiment-api", json=request.json)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"message": f"Error: {e}"}), 500

@app.route('/')
def index():
    return 'Welcome to the MYRESTaurant Reservation System!'

if __name__ == '__main__':
    app.run(debug=True, port=8080)
