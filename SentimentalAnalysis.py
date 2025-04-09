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
url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=51.53160339999999,-0.1235978&radius=1500&type=DIY&keyword=repairer&key=AIzaSyBlo_CbZwwhVEtT8V5x0zW6JCmItgUWGAA'
response = requests.get(url)
data = json.loads(response.text)
for place in data['results']:
    placeId = place['place_id']
    placeId_list.append(placeId)

# get reviews from google maps
# storing the location id and the reviews as a key-pair
# in a dictionary
# storing the location id and the reviews as a key-pair
# in a dictionary
location_to_review = {}


# Load the spaCy model
def get_aspect_and_score(placeId_list):
    """
    Extract 5 unique aspects from the given texts.
    
    Args:
        texts: List of text reviews
        
    Returns:
        List of unique aspects (features)
    """
    location_to_review = {}
    placeId_list = json.loads(placeId_list)
    placeId_list = placeId_list["data"]
    for placeId in placeId_list:
        reviews = []
        print("placeId", placeId)
        url = f'https://maps.googleapis.com/maps/api/place/details/json?place_id={placeId}&key={os.getenv("GOOGLE_MAPS_API_KEY")}'
        response = requests.get(url)
        data = json.loads(response.text)
        print("data", data)
        if "reviews" in data["result"]: 
            for review in data["result"]["reviews"]:
                reviews.append(review['text'])
        else:
            print(f"No reviews found for this place. Place data: {data.get('result', {}).get('name', 'Unknown place')}")
        location_to_review[placeId] = reviews
        # print(f"No reviews found for this place. Place data: {data.get('result', {}).get('name', 'Unknown place')}")
    unique_aspects = set()  # Use a set to ensure uniqueness
    keys = list(location_to_review.keys())
    for key in keys:
        texts = location_to_review[key]
        for text in texts:
            doc = nlp(text)
            # Extract noun phrases as aspect candidates
            aspects = [chunk.text.lower() for chunk in doc.noun_chunks if len(chunk.text) > 2]
            # Filter out common, non-informative aspects
            filtered_aspects = []
            for aspect in aspects:
                # Skip very common words that aren't useful features
                if aspect not in ["i", "me", "my", "mine", "you", "your", "he", "she", "it", "they", "them", 
                                "this", "that", "these", "those", "the", "a", "an"]:
                    filtered_aspects.append(aspect)
            
            # Add unique aspects to our set
            for aspect in filtered_aspects:
                unique_aspects.add(aspect)
                if len(unique_aspects) >= 5:
                    return str(list(unique_aspects)[:5])    
        
    # Convert set to list and return the first 5 (or fewer if not enough found)
def get_aspect_and_score(placeId_list, aspect):
    location_to_review = {}
    placeId_list = json.loads(placeId_list)
    placeId_list = placeId_list["data"]
    for placeId in placeId_list:
        reviews = []
        print("placeId", placeId)
        url = f'https://maps.googleapis.com/maps/api/place/details/json?place_id={placeId}&key={os.getenv("GOOGLE_MAPS_API_KEY")}'
        response = requests.get(url)
        data = json.loads(response.text)
        print("data", data)
        if "reviews" in data["result"]: 
            for review in data["result"]["reviews"]:
                reviews.append(review['text'])
        else:
            print(f"No reviews found for this place. Place data: {data.get('result', {}).get('name', 'Unknown place')}")
        location_to_review[placeId] = reviews
    location_score = []
    location = []
    nlp = spacy.load("en_core_web_sm")
    model_name = "yangheng/deberta-v3-base-absa-v1.1"
    tokenizer = AutoTokenizer.from_pretrained(model_name, use_fast=False)
    model = AutoModelForSequenceClassification.from_pretrained(model_name)
    keys = list(location_to_review.keys())
    total_score = 0
    for key in keys:
        texts = location_to_review[key]
        # Analyze sentiment for each aspect
        for text in texts:
            # Process the text with spaCy
            doc = nlp(text)
            # Extract noun phrases as aspect candidates
            inputs = tokenizer(text, aspect, return_tensors="pt")
            outputs = model(**inputs)
            scores = F.softmax(outputs.logits, dim=1)
            sentiment = torch.argmax(scores).item()
            sentiment_label = model.config.id2label[sentiment]
            total_score += sentiment
        total_score = int((total_score / len(keys)) * 100)
        location_score.append((key, total_score))
        total_score = 0
        # Now sort in descending order by the score
    location_score.sort(key=lambda x: x[1], reverse=True)
    
    # location_scores is now a list of tuples like [("efgh", 1.4), ("abcd", 0.5), ... ] in descending order
    for place_id, score in location_score:
        location.append(place_id)
    return location
    
