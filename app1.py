import tensorflow as tf
import numpy as np
import cv2

# Load model
model = tf.keras.models.load_model("best_model.h5")

def preprocess_image(image_path):
    image = cv2.imread(image_path)  # Load image
    if image is None:
        print(f"Error: Could not read image from {image_path}")
        return None
    
    image = cv2.resize(image, (224, 224))  # Resize to match model's input size
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # Convert to RGB (3-channel)
    image = image / 255.0  # Normalize pixel values
    image = np.expand_dims(image, axis=0)  # Expand dimensions for batch processing
    
    return image


# Test with an image
image_path = "anger.png"
image = preprocess_image(image_path)
prediction = model.predict(image)

# Assuming softmax output
emotion_labels = ["Angry", "Disgust", "Fear", "Happy", "Neutral", "Sad", "Surprise"]
predicted_emotion = emotion_labels[np.argmax(prediction)]
print(f"Predicted Emotion: {predicted_emotion}")
print(prediction)  # Prints confidence scores for each emotion
