import logging
import os
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import worker  # Import the worker module
import llm

# Initialize Flask app and CORS
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.logger.setLevel(logging.ERROR)

# Define the route for the index page
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')  # Render the index.html template

@app.route('/llm', methods=['GET'])
def llmhome():
    return render_template('index3.html')

@app.route('/llmp', methods=['POST']) 
def process():
    user_message = request.json['userMessage']  # Extract the user's message from the request
    print('user_message', user_message)

    bot_response = llm.chatbot(user_message)  # Process the user's message using the worker module

    # Return the bot's response as JSON
    return jsonify({
        "botResponse": bot_response
    }), 200   


@app.route('/cover', methods=['POST']) 
def process():
    user_message = request.json['userMessage']  # Extract the user's message from the request
    print('user_message', user_message)
    (p,c,s) = user_message.split(',')
    bot_response = llm.coverletter(p,c,s)  # Process the user's message using the worker module

    # Return the bot's response as JSON
    return jsonify({
        "botResponse": bot_response
    }), 200 

# Define the route for processing messages
@app.route('/process-message', methods=['POST'])
def process_message_route():
    user_message = request.json['userMessage']  # Extract the user's message from the request
    print('user_message', user_message)

    bot_response = worker.process_prompt(user_message)  # Process the user's message using the worker module

    # Return the bot's response as JSON
    return jsonify({
        "botResponse": bot_response
    }), 200

# Define the route for processing documents
@app.route('/process-document', methods=['POST'])
def process_document_route():
    # Check if a file was uploaded
    if 'file' not in request.files:
        return jsonify({
            "botResponse": "It seems like the file was not uploaded correctly, can you try "
                           "again. If the problem persists, try using a different file"
        }), 400

    file = request.files['file']  # Extract the uploaded file from the request

    file_path = file.filename  # Define the path where the file will be saved
    file.save(file_path)  # Save the file

    worker.process_document(file_path)  # Process the document using the worker module

    # Return a success message as JSON
    return jsonify({
        "botResponse": "Thank you for providing your PDF document. I have analyzed it, so now you can ask me any "
                       "questions regarding it!"
    }), 200

import json
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

model_name = "facebook/blenderbot-400M-distill"
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)
conversation_history = []

@app.route('/2', methods=['GET'])
def home():
    return render_template('index2.html')


@app.route('/chatbot', methods=['POST'])
def handle_prompt():
    data = request.get_data(as_text=True)
    data = json.loads(data)
    print(data) # DEBUG
    input_text = data['prompt']
    
    # Create conversation history string
    history = "\n".join(conversation_history)

    # Tokenize the input text and history
    inputs = tokenizer.encode_plus(history, input_text, return_tensors="pt")

    # Generate the response from the model
    outputs = model.generate(**inputs)

    # Decode the response
    response = tokenizer.decode(outputs[0], skip_special_tokens=True).strip()

    # Add interaction to conversation history
    conversation_history.append(input_text)
    conversation_history.append(response)

    return response


# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True, port=8000, host='0.0.0.0')

