import os
import requests
import json
import numpy as np
import cv2
import base64
import tensorflow as tf
from tensorflow.keras.models import load_model
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
API_KEY = os.getenv("OPENROUTER_API_KEY")
API_URL = "https://openrouter.ai/api/v1/chat/completions"

# Ensure API key exists
if not API_KEY:
    raise ValueError("Missing API key. Please set OPENROUTER_API_KEY in .env file.")

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Load Emotion Detection Model
model_path = "models/model.h5"
if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model file not found at {model_path}")

model = load_model(model_path, compile=False)
model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])

# Define emotions
EMOTIONS = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']

# Load Haar Cascade for face detection
face_cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
if not os.path.exists(face_cascade_path):
    raise FileNotFoundError(f"Haarcascade file not found at {face_cascade_path}")

face_cascade = cv2.CascadeClassifier(face_cascade_path)

### ======== EMOTION DETECTION FUNCTIONS ======== ###

def decode_base64_image(base64_string):
    """ Convert base64 string to an OpenCV image """
    try:
        base64_string = base64_string.split(",")[-1]  # Remove header if present
        img_data = base64.b64decode(base64_string)
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)  # Read as color

        if img is None:
            raise ValueError("Failed to decode image. Check base64 format.")

        return img
    except Exception as e:
        print(f"Error decoding image: {e}")
        return None

def preprocess_image(image):
    """ Detects face, converts to grayscale, resizes to 48x48, normalizes, and ensures correct input shape """
    try:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        if len(faces) == 0:
            return None  # No face detected

        # Select largest face
        (x, y, w, h) = max(faces, key=lambda f: f[2] * f[3])
        roi = gray[y:y + h, x:x + w]
        roi = cv2.resize(roi, (48, 48))
        roi = roi.astype("float32") / 255.0
        roi = np.expand_dims(roi, axis=-1)  # Add channel
        roi = np.expand_dims(roi, axis=0)   # Add batch dimension

        return roi
    except Exception as e:
        print(f"Error in preprocessing image: {e}")
        return None

### ======== EMOTION DETECTION ROUTES ======== ###

@app.route("/")
def home():
    return jsonify({"message": "Emotion Detection & Chatbot API is running!"})

@app.route('/predict', methods=['POST'])
def predict():
    """ Predict emotion from image """
    try:
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({"error": "No image data provided"}), 400

        image = decode_base64_image(data['image'])
        if image is None:
            return jsonify({"error": "Invalid image data"}), 400

        processed_img = preprocess_image(image)
        if processed_img is None:
            return jsonify({"error": "No face detected"}), 400

        predictions = model.predict(processed_img)[0]
        max_index = np.argmax(predictions)
        predicted_emotion = EMOTIONS[max_index]
        confidence = float(predictions[max_index])

        response = {
            "emotion": predicted_emotion,
            "confidence": round(confidence, 2),
            "all_predictions": {EMOTIONS[i]: float(predictions[i]) for i in range(len(EMOTIONS))}
        }
        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

### ======== CHATBOT FUNCTIONS ======== ###

def chat_with_bot(user_input):
    """ Communicate with OpenRouter AI """
    payload = {
        "model": "meta-llama/llama-3-8b-instruct",
        "messages": [{"role": "user", "content": user_input}]
    }

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    response = requests.post(API_URL, json=payload, headers=headers)

    if response.status_code == 200:
        data = response.json()
        return data["choices"][0]["message"]["content"]
    else:
        return f"Error: {response.json()}"

### ======== CHATBOT ROUTE ======== ###

@app.route('/chat', methods=['POST'])
def chat():
    """ Handle chatbot conversation """
    data = request.get_json()
    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({"response": "Please enter a message."})

    ai_response = chat_with_bot(user_message)

    return jsonify({"response": ai_response})

### ======== RUN FLASK APP ======== ###

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
