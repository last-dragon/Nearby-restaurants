from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_cors import cross_origin
import populartimes
from dotenv import dotenv_values

app = Flask(__name__)
cors = CORS(app)

env_vars = dotenv_values("./../front-end/.env")
api_key = env_vars["REACT_APP_GOOGLE_MAPS_API_KEY"]

@app.route('/api/getpopulartime', methods=['POST'])
@cross_origin()
def my_function():
    # Retrieve data from the request
    data = request.get_json()

    # Call your Python function with the provided data
    result = get_popular_time(data)

    # Return the result as a JSON response
    return jsonify(result)

def get_popular_time(data):
    place_id = data.get("placeId")
    result = populartimes.get_id(api_key, place_id)
    return {'message': 'Hello from Python!', 'data': result}

if __name__ == '__main__':
    app.run()