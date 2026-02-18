
from flask import Flask, request, jsonify
from flask_cors import CORS
import io
import random # Mocking model inference

app = Flask(__name__)
CORS(app) # Enable CORS for React frontend

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No image selected'}), 400

    try:
        # Read the image
        img_bytes = file.read()
        
        # --- MODEL INFERENCE START ---
        # In a real scenario, you would load your .h5 or .pth model here:
        # model = load_model('pneumonia_model.h5')
        # prediction = model.predict(processed_image)
        
        # Mocking logic for demonstration:
        prediction_type = random.choice(["Pneumonia", "Normal"])
        confidence = round(random.uniform(0.75, 0.99), 2)
        # --- MODEL INFERENCE END ---

        return jsonify({
            'prediction': prediction_type,
            'confidence': confidence
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Starting Flask AI Server on http://localhost:5000...")
    app.run(debug=True, port=5000)
