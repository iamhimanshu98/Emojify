import os
import requests
import json
import numpy as np
import cv2
import base64
import tensorflow as tf
from tensorflow.keras.models import load_model # type: ignore
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from deepface import DeepFace

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

def decode_base64_image(base64_string):
    """ Convert base64 string to an OpenCV image """
    try:
        # Handle data URL format
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        # Decode base64 string
        img_data = base64.b64decode(base64_string)
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            raise ValueError("Failed to decode image")
            
        return img
    except Exception as e:
        print(f"Error decoding image: {e}")
        return None

def preprocess_image(image):
    """ Detects face, converts to grayscale, resizes to 48x48, normalizes """
    try:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(
            gray, 
            scaleFactor=1.1, 
            minNeighbors=5, 
            minSize=(30, 30)
        )

        if len(faces) == 0:
            return None

        # Select largest face
        (x, y, w, h) = max(faces, key=lambda f: f[2] * f[3])
        roi = gray[y:y + h, x:x + w]
        roi = cv2.resize(roi, (48, 48))
        roi = roi.astype("float32") / 255.0
        roi = np.expand_dims(roi, axis=-1)  # Add channel
        roi = np.expand_dims(roi, axis=0)   # Add batch dimension

        return roi
    except Exception as e:
        print(f"Error preprocessing image: {e}")
        return None

def predict_with_tensorflow(image):
    """Predict emotion using TensorFlow model"""
    try:
        processed_img = preprocess_image(image)
        if processed_img is None:
            raise ValueError("No face detected in the image")

        predictions = model.predict(processed_img)[0]
        max_index = np.argmax(predictions)
        
        return {
            "emotion": EMOTIONS[max_index],
            "confidence": float(predictions[max_index]),
            "all_predictions": {EMOTIONS[i]: float(predictions[i]) for i in range(len(EMOTIONS))}
        }
    except Exception as e:
        raise Exception(f"TensorFlow prediction failed: {str(e)}")

def predict_with_deepface(image):
    """Predict emotion using DeepFace"""
    try:
        result = DeepFace.analyze(
            image, 
            actions=['emotion'], 
            enforce_detection=False
        )
        
        # DeepFace returns a list with one dictionary
        emotions = result[0]['emotion']
        dominant_emotion = result[0]['dominant_emotion']
        
        return {
            "emotion": dominant_emotion,
            "confidence": None,  # DeepFace doesn't provide a single confidence score
            "all_predictions": emotions
        }
    except Exception as e:
        raise Exception(f"DeepFace prediction failed: {str(e)}")

@app.route('/predict', methods=['POST'])
def predict():
    """Predict emotion from image using specified model"""
    try:
        # Validate request data
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({"error": "No image data provided"}), 400

        # Get model type, default to TensorFlow if not provided
        model_type = data.get('model', '').strip().lower() or 'tensorflow'

        if model_type not in ['tensorflow', 'deepface']:
            return jsonify({"error": "Invalid model type. Use 'tensorflow' or 'deepface'"}), 400

        # Decode image
        image = decode_base64_image(data['image'])
        if image is None:
            return jsonify({"error": "Invalid image data"}), 400

        # Predict using selected model
        if model_type == 'deepface':
            result = predict_with_deepface(image)
            print("Deepface")
        else:  # Default is TensorFlow
            result = predict_with_tensorflow(image)
            print("Tensorflow")

        return jsonify(result)


    except Exception as e:
        error_message = str(e)
        print(f"Error in prediction: {error_message}")
        return jsonify({"error": error_message}), 500

@app.route('/chat', methods=['POST'])
def chat():
    """Handle chatbot conversation"""
    try:
        data = request.get_json()
        user_message = data.get("message", "").strip()

        if not user_message:
            return jsonify({"error": "Please enter a message"}), 400

        # Chat with OpenRouter AI
        payload = {
            "model": "meta-llama/llama-3-8b-instruct",
            "messages": [{"role": "user", "content": user_message}]
        }

        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        }

        response = requests.post(API_URL, json=payload, headers=headers)
        response.raise_for_status()  # Raise exception for bad status codes

        chat_response = response.json()
        return jsonify({
            "response": chat_response["choices"][0]["message"]["content"]
        })

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Chat API error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)