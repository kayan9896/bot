import logging
import os
import re
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
#import worker  # Import the worker module
#import llm
import requests

# Initialize Flask app and CORS
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.logger.setLevel(logging.ERROR)

chat_history=[]
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

@app.route('/cover', methods=['GET'])
def coverhome():
    return render_template('index3.html')

@app.route('/coverp', methods=['POST']) 
def coverprocess():
    user_message = request.json['userMessage']  # Extract the user's message from the request
    print('user_message', user_message)
    (p,c,s) = user_message.split(',')
    bot_response = llm.coverletter(p,c,s)  # Process the user's message using the worker module

    # Return the bot's response as JSON
    return jsonify({
        "botResponse": bot_response
    }), 200 

@app.route('/historical', methods=['GET'])
def historicalhome():
    return render_template('index3.html')

@app.route('/historicalp', methods=['POST']) 
def historicalprocess():
    message = request.json['userMessage']  # Extract the user's message from the request
    chat_history.append({"role": "user", "content": message})
    headers = {"Authorization": "Bearer 4de76c8205114bccb723bb3923f674e5",
         "Content-Type": "application/json"}
    data={"model": "gpt-3.5-turbo",
    "messages": chat_history[-11:]}
    response = requests.post("https://api.aimlapi.com/chat/completions", headers=headers, json=data)
    res=response.content.decode('utf-8')
    print(res)
    redict=json.loads(res)
    bot_response=redict['choices'][0]['message']
    chat_history.append(bot_response)
    print(chat_history)
    '''
    headers = {Authorization: "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJndXBlZGlsaUBjbG91dC53aWtpIiwiZW1haWxfdmVyaWZpZWQiOnRydWV9LCJodHRwczovL2FwaS5vcGVuYWkuY29tL2F1dGgiOnsicG9pZCI6Im9yZy1BeFFoVUFzd3ZBaW9JWFR0TGF0MGk1b1QiLCJ1c2VyX2lkIjoidXNlci1rcXZtRkxyT09QdjE0RU1yakVkNHZ3Nk4ifSwiaXNzIjoiaHR0cHM6Ly9hdXRoMC5vcGVuYWkuY29tLyIsInN1YiI6ImF1dGgwfDY1MzJmNTE3YmNkZTVhZjdjZDQxOWExMiIsImF1ZCI6WyJodHRwczovL2FwaS5vcGVuYWkuY29tL3YxIiwiaHR0cHM6Ly9vcGVuYWkub3BlbmFpLmF1dGgwYXBwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE3MDQ2MTA2MjcsImV4cCI6MTcwNTQ3NDYyNywiYXpwIjoiVGRKSWNiZTE2V29USHROOTVueXl3aDVFNHlPbzZJdEciLCJzY29wZSI6Im9wZW5pZCBlbWFpbCBwcm9maWxlIG1vZGVsLnJlYWQgbW9kZWwucmVxdWVzdCBvcmdhbml6YXRpb24ucmVhZCBvcmdhbml6YXRpb24ud3JpdGUgb2ZmbGluZV9hY2Nlc3MifQ.LOOQm2MdEOirdbTyUvzu41SAmHeReRHVjO8luGZLG-1mdk5YqJlQaAjdt_ijojG4wNvLb8bP_VPPsjz8b4RSF96tXeQoGy0-ojMvfKs88WMVFlJIEziMDPsvDN8Lz8_Xii0D4pT7mUAUJ3RSgY9UQo2iq7gxNN3M8jg4_I_3XvfJxInRsv1j1jY7c9IHX06GZN_Z4kGCnKGcV-bxLd3pdhrpVaWCOz75hsjk4yqHYvgwGfleaT3nb6Q6NhYcGLsimsW1rvhx6vF8iwfpw1mjKjBwaXa3Ou2ij5NKhVMIbXujmpnHKEQX5X8gapZeXimoNrU4Yeqnv9eRJWbp0muhzA",
         "Content-Type": "application/json"}
    data={"action":"next","messages":[{"id":"aaa2f527-fe5d-4dd5-a623-e363ffac5b41","author":{"role":"user"},"content":{"content_type":"text","parts":[message]},"metadata":{}}],"conversation_id":"0fe72a09-94a1-4816-9bfa-a5e73e85b163","parent_message_id":"af0f9497-73f4-4a0a-9717-77db9d257079","model":"gpt-3.5-turbo","timezone_offset_min":480,"suggestions":[],"history_and_training_disabled":False,"arkose_token":None,"conversation_mode":{"kind":"primary_assistant"},"force_paragen":False,"force_rate_limit":False}
    response = requests.post("https://chat.openai.com/backend-api/conversation", headers=headers, json=data)
    print(response)
    '''
    return jsonify({
        "botResponse": bot_response['content']
    }), 200 

@app.route('/goo', methods=['GET'])
def google():
    return render_template('index3.html')

@app.route('/goop', methods=['POST']) 
def googleprocess():
    user_message = request.json['userMessage']  # Extract the user's message from the request
    print('user_message', user_message)
    search=requests.get(f'https://serpapi.com/search.json?engine=google&q={user_message}&api_key=a5f61cdd8578c66b218fa0e2b8c30fdd708274e1d4843dd3937e0c10414828c1')
    res=search.content.decode('utf-8')
    print(res)
    redict=json.loads(res)
    unwant=['search_metadata','search_parameters','search_information','pagination','serpapi_pagination']
    for k in unwant:
        redict.pop(k)
    
    def remove_urls(data):
        try:
            if isinstance(data, list):
                return [remove_urls(item) for item in data]
            tmp={}
            for key in data:
                if isinstance(data[key], str) and ('http://' in data[key] or 'https://' in data[key]): 
                    continue
                
                tmp[key]=remove_urls(data[key])
            return tmp
        except TypeError:
            return data
    goo=remove_urls(redict)
    goosearch=json.dumps(goo)

    headers = {"Authorization": "Bearer 4de76c8205114bccb723bb3923f674e5",
         "Content-Type": "application/json"}
    data={"model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": f'{user_message}\n online search result:\n {goosearch}'}]}
    response = requests.post("https://api.aimlapi.com/chat/completions", headers=headers, json=data)
    res=response.content.decode('utf-8')
    print(res)
    redict=json.loads(res)
    bot_response=redict['choices'][0]['message']['content']

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

