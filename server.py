import logging
import os
import re
from flask import Flask, render_template, request, jsonify, session, send_file
from flask_cors import CORS
#import worker  # Import the worker module
#import llm
from PyPDF2 import PdfReader
from dotenv import load_dotenv
import io
import requests
from uuid import uuid4
import time
from jose import jwt
from functools import wraps
import pymongo
from authlib.integrations.flask_oauth2 import ResourceProtector
from validator import Auth0JWTBearerTokenValidator
import stripe

stripe.api_key = "YOUR_STRIPE_SECRET_KEY"


require_auth = ResourceProtector()
validator = Auth0JWTBearerTokenValidator(
    "dev-4u2fhsz3qpodveaq.us.auth0.com",
    "https://dev-4u2fhsz3qpodveaq.us.auth0.com/api/v2/"
)
require_auth.register_token_validator(validator)

# Initialize Flask app and CORS
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.logger.setLevel(logging.ERROR)

link="https://api.aimlapi.com/chat/completions"
key=os.getenv('key')
gookey=os.getenv('gookey')
audiokey=os.getenv('audiokey')

MONGO_URI = os.environ.get("MONGO_URI")
client = pymongo.MongoClient(MONGO_URI)
db = client["your_database_name"]
subscriptions_collection = db["subscriptions"]

chat_history = {}

# Helper function to get the user ID from the token
def get_user_id():
    auth = request.headers.get("Authorization", None)
    if not auth:
        raise Exception("Authorization header is missing")

    parts = auth.split()

    if parts[0].lower() != "bearer":
        raise Exception("Authorization header must start with Bearer")
    elif len(parts) == 1:
        raise Exception("Token not found")
    elif len(parts) > 2:
        raise Exception("Authorization header must be Bearer token")

    token = parts[1]
    unverified_header = jwt.get_unverified_header(token)
    jsonurl = requests.get(f"https://dev-4u2fhsz3qpodveaq.us.auth0.com/.well-known/jwks.json")
    jwks = jsonurl.json()
    rsa_key = {}
    for key in jwks["keys"]:
        if key["kid"] == unverified_header["kid"]:
            rsa_key = {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"]
            }
    if rsa_key:
        payload = jwt.decode(
            token,
            rsa_key,
            algorithms="RS256",
            audience="https://dev-4u2fhsz3qpodveaq.us.auth0.com/api/v2/",
            issuer=f"https://dev-4u2fhsz3qpodveaq.us.auth0.com/"
        )
        
        
    print(payload)
    return payload["sub"]

# Route to check if the user is subscribed
@app.route("/check-subscription", methods=["GET"])
@require_auth(None)
def check_subscription():
    user_id = get_user_id()
    subscription_data = subscriptions_collection.find_one({"user_id": user_id})
    is_subscribed = subscription_data.get("isSubscribed", False) if subscription_data else False
    return jsonify({"isSubscribed": is_subscribed}) 

# Route to handle payment processing 
@app.route("/process-payment", methods=["POST"])
@require_auth(None)
def process_payment():
    # Get the payment information from the request body
    payment_info = request.get_json()
    
    # Validate the presence of necessary fields
    required_fields = ['cardNumber', 'expiryDate', 'cvv']
    if not all(field in payment_info for field in required_fields):
        return jsonify({"success": False, "error": "Missing required fields"}), 400

    # Format the expiry date for Stripe (Stripe expects it in separate month and year)
    month, year = map(int, payment_info['expiryDate'].split('/'))
    card_info = {
        "number": payment_info['cardNumber'],
        "exp_month": month,
        "exp_year": year,
        "cvc": payment_info['cvv'],
    }
    try:
        # Assuming payment is successful
        l=payment_info['cardNumber'][15]
        
        user_id = get_user_id()
        subscriptions_collection.update_one(
            {"user_id": user_id},
            {"$set": {"user_id": user_id, "isSubscribed": True}},
            upsert=True
        )
        return jsonify({"success": True})
    except Exception as e:
        print(e)
        return jsonify({"success": False, "error": str(e)}), 400

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

@app.route('/audio/<string:filename>', methods=['GET'])
def serve_audio(filename):
    return send_file(f'./{filename}', mimetype='audio/wav')

@app.route('/audio', methods=['POST'])
def handle_audio_post():
    print(request.files)
    audio_file = request.files['audio']
    if audio_file:
        filename = 'recording.wav'  # You can customize the filename here if needed
        audio_file.save(f'./{filename}')
        
        # Make a POST request to the Speech-to-Text API
        audiourl = f'https://legendary-fishstick-67w6q66jwxgh4q49-8000.app.github.dev/audio/{filename}'
        headers = {"Authorization": f'Bearer {audiokey}',
         "Content-Type": "application/json"}
        data={"audio_url": audiourl}
        response = requests.post("https://api.assemblyai.com/v2/transcript",json=data,headers=headers)
        id=response.json()['id']
        text=[]
        
        while True:
            response2=requests.get("https://api.assemblyai.com/v2/transcript/"+id,headers=headers)
            res=json.loads(response2.text)
            print(res)
            if res['text']:
                text.append(res['text'])
            if res['status']=='completed': break
            if res['status']=='error': 
                text=['error']
                break
            else: time.sleep(3)
        
        # Parse the response from the Speech-to-Text API
        try:
            text=''.join(text)
            print(text)
            transcript = text
        except json.JSONDecodeError:
            transcript = "Error decoding response from Speech-to-Text API"
            print(f"Error: {response.text}")
        
        # Return the transcript
        return jsonify(transcript=transcript)
    else:
        return jsonify(error="Audio file not found in the request"), 400  

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
    user_id = request.json.get('userId', 'default_user')  # Get a user ID from the request or use a default
    message = request.json['userMessage']  # Extract the user's message from the request
    if user_id not in chat_history:
        chat_history[user_id] = []
    chat_history[user_id].append({"role": "user", "content": message})

    headers = {"Authorization": f'Bearer {key}',
         "Content-Type": "application/json"}
    data={"model": "gpt-4o",
    "messages": chat_history[user_id][-11:]}
    response = requests.post("https://api.aimlapi.com/chat/completions", headers=headers, json=data)
    res=response.content.decode('utf-8')
    print(res)
    redict=json.loads(res)
    
    bot_response=redict['choices'][0]['message']
    chat_history[user_id].append(bot_response)
    print(chat_history)
    
    return jsonify({
        "botResponse": bot_response['content']
    }), 200 


@app.route('/goo', methods=['GET'])
def google():
    return render_template('index3.html')


@app.route("/goop", methods=["POST"])
@require_auth(None)
def googleprocess():
    user_id = get_user_id()
    subscription_data = subscriptions_collection.find_one({"user_id": user_id})
    is_subscribed = subscription_data.get("isSubscribed", False) if subscription_data else False
    if not is_subscribed:
        return jsonify({"error": "Subscription required"}), 403
    user_message = request.json['userMessage']  # Extract the user's message from the request
    print('user_message', user_message)
    search=requests.get(f'https://serpapi.com/search.json?engine=google&q={user_message}&api_key={gookey}')
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

    headers = {"Authorization": f'Bearer {key}',
         "Content-Type": "application/json"}
    data={"model": "gpt-4o",
    "messages": [{"role": "user", "content": f'{user_message}\n online search result:\n {goosearch}'}]}
    response = requests.post(link, headers=headers, json=data)
    res=response.content.decode('utf-8')
    print(res)
    redict=json.loads(res)
    bot_response=redict['choices'][0]['message']

    # Return the bot's response as JSON
    return jsonify({
        "botResponse": bot_response['content']
    }), 200 

pages = []
# Define the route for processing messages
@app.route('/process-message', methods=['POST'])
def process_message_route():
    message = request.json['userMessage']  # Extract the user's message from the request
    chat_history.append({"role": "user", "content": message})

    headers = {"Authorization": f'Bearer {key}',
        "Content-Type": "application/json"}
    data={"model": "gpt-4o",
    "messages": chat_history[-8:] if len(chat_history)<8 else chat_history[:1]+chat_history[-5:]}
    response = requests.post(link, headers=headers, json=data)
    res=response.content.decode('utf-8')
    print(res)
    redict=json.loads(res)

    bot_response=redict['choices'][0]['message']
    chat_history.append(bot_response)
    print(chat_history)
    # Return the bot's response as JSON
    return jsonify({
        "botResponse": bot_response['content']
    }), 200

# Define the route for processing documents
@app.route('/process-document', methods=['POST'])
def process_document():
    try:
        # Check if the file is present in the request
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']
        # Check if the file is PDF
        if file.filename.rsplit('.', 1)[1] != 'pdf':
            return jsonify({'error': 'Invalid file format'}), 400

        # Save the uploaded file temporarily
        file.save(file.filename)

        # Read the PDF file as text
        with open(file.filename, 'rb') as f:
            pdf = PdfReader(f)
            for page in pdf.pages:
                pages.append(page.extract_text())
            text = "\n\n".join(pages)  

        # Remove the temporary file
        import os
        os.remove(file.filename)
        

        chat_history.extend([{"role": "user", "content": f'Pdf:{pages[0]}'},{"role": "system", "content": "You are a file analyist. Only respond 'Uploaded! Ask me any questions about the file.' when you first receive the file"}])
        headers = {"Authorization": f'Bearer {key}',
            "Content-Type": "application/json"}
        data={"model": "gpt-4o",
        "messages": chat_history}
        response = requests.post(link, headers=headers, json=data)
        res=response.content.decode('utf-8')
        print(res)
        redict=json.loads(res)

        bot_response=redict['choices'][0]['message']
        chat_history.append(bot_response)
        print(chat_history)

        # Return the extracted text in the response
        return jsonify({'botResponse': bot_response['content']}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

'''
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
'''
import time

def cleanup_chat_history(max_age_in_seconds=3000):  # Cleanup every hour
    while True:
        time.sleep(max_age_in_seconds)
        current_time = time.time()
        for user_id, history in chat_history.items():
            print(history)
            chat_history[user_id] = [
                entry for entry in history 
                if current_time - entry.get('timestamp', 0) < max_age_in_seconds
            ]

# Start cleanup task in the background
import threading
cleanup_thread = threading.Thread(target=cleanup_chat_history)
cleanup_thread.daemon = True
cleanup_thread.start()

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True, port=8000, host='0.0.0.0')

