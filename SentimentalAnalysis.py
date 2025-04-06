from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch.nn.functional as F
import torch
import spacy
import requests
import json
import os
import dotenv
# Load environment variables from .env file
dotenv.load_dotenv()

# get locations from google maps via latitude and longitude
latitude = 51.5304
longitude = -0.1232
placeId_list = []
url = f'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={latitude},{longitude}&radius=1500&type=restaurant&keyword=cruise&key={os.getenv("GOOGLE_MAPS_API_KEY")}'
response = requests.get(url)
data = json.loads(response.text)
for place in data['results']:
    placeId = place['place_id']
    placeId_list.append(placeId)
print(placeId_list)

# get reviews from google maps
for placeId in placeId_list:
    url = f'https://maps.googleapis.com/maps/api/place/details/json?place_id={placeId}&key={os.getenv("GOOGLE_MAPS_API_KEY")}'
    response = requests.get(url)
    data = json.loads(response.text)
    print(data['result']['reviews'])

# Load the spaCy model
nlp = spacy.load("en_core_web_sm")

# Sample text
text = "The battery life is excellent, but the screen resolution is poor."

# Process the text with spaCy
doc = nlp(text)

# Extract noun phrases as aspect candidates
aspects = [chunk.text for chunk in doc.noun_chunks]

print(aspects)

# Load a pre-trained ABSA model and tokenizer
model_name = "yangheng/deberta-v3-base-absa-v1.1"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

# Sample text and aspects
text = "The battery life is excellent, but the screen resolution is poor."

# Analyze sentiment for each aspect
for aspect in aspects:
    inputs = tokenizer(text, aspect, return_tensors="pt")
    outputs = model(**inputs)
    scores = F.softmax(outputs.logits, dim=1)
    sentiment = torch.argmax(scores).item()
    sentiment_label = model.config.id2label[sentiment]
    print(f"Aspect: {aspect}, Sentiment: {sentiment_label}")
