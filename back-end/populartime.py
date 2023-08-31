from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_cors import cross_origin
import populartimes

app = Flask(__name__)
cors = CORS(app)

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
    result = populartimes.get_id("AIzaSyAqZqcJ_WYIffSu__AsX1FIm0v5IFcOajM", place_id)
    return {'message': 'Hello from Python!', 'data': result}

if __name__ == '__main__':
    app.run()