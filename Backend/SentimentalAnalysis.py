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


# get reviews from google maps
# storing the location id and the reviews as a key-pair
# in a dictionary
# storing the location id and the reviews as a key-pair
def get_Coordinates(request):
    url = f'https://maps.googleapis.com/maps/api/geocode/json?address={request}&key=key={os.getenv("GOOGLE_MAPS_API_KEY")}'
    response = requests.get(url)
    data = json.loads(response.text)
    location = data['results'][0]['geometry']['location']
    print("location", location)
    return location

# Load the spaCy model
def get_aspect_and_score(placeId_list):
    """
    Extract 5 unique aspects from the given texts.
    
    Args:
        placeId_list: JSON string containing place IDs
        
    Returns:
        List of unique aspects (features)
    """
    location_to_review = {}
    nlp = spacy.load("en_core_web_sm")  # Load spaCy here to avoid the module error
    
    try:
        placeId_list = json.loads(placeId_list)
        placeId_list = placeId_list.get("data", [])
        
        for placeId in placeId_list:
            reviews = []
            print("placeId", placeId)
            url = f'https://maps.googleapis.com/maps/api/place/details/json?place_id={placeId}&key={os.getenv("GOOGLE_MAPS_API_KEY")}'
            response = requests.get(url)
            data = json.loads(response.text)
            
            # Check if result exists and has reviews
            if "result" in data and "reviews" in data["result"]: 
                for review in data["result"]["reviews"]:
                    reviews.append(review['text'])
            else:
                print(f"No reviews found for place ID: {placeId}")
            
            location_to_review[placeId] = reviews
        
        unique_aspects = set()  # Use a set to ensure uniqueness
        keys = list(location_to_review.keys())
        
        for key in keys:
            texts = location_to_review[key]
            for text in texts:
                url = "https://api.asi1.ai/v1/chat/completions"
                headers = {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + os.getenv("ASI_API_KEY")
                }
                
                body ={
                "model": "asi1-mini",
                "messages": [
                    {
                    "role": "user",
                    "content": """You are a helpful assistant. You will determine the list aspect of the review can work as a factor of the score of the place. 
                        then only return the list of aspects as an array. here is the review: """ + text
                    }
                ],
                "temperature": 0.7,
                "stream": False,
                "max_tokens": 8000
                }

                # Send a GET request
                response = requests.post(url, headers=headers, json=body)

                # Raise an exception for HTTP errors (status codes 4xx or 5xx)
                response.raise_for_status()

                # Parse the JSON response into a Python dictionary
                data = response.json()
                list_aspects = data.get("choices")[0].get("message").get("content")
                list_aspects = json.loads(list_aspects)
                print("data", data.get("choices")[0].get("message").get("content"))
                filtered_aspects = []
                for aspect in list_aspects:
                    # Skip very common words that aren't useful features
                    if aspect not in ["i", "me", "my", "mine", "you", "your", "he", "she", "it", "they", "them", 
                                    "this", "that", "these", "those", "the", "a", "an"]:
                        filtered_aspects.append(aspect)
                
                # Add unique aspects to our set
                for aspect in filtered_aspects:
                    unique_aspects.add(aspect)
                    if len(unique_aspects) >= 5:
                        return str(list(unique_aspects)[:5])
        
        # If we didn't find 5 aspects, return what we have
        return str(list(unique_aspects))
    
    except Exception as e:
        print(f"Error in get_aspect_and_score: {e}")
        return str([])  # Return empty list on error

def get_score(placeId_list, aspect):
    location_to_review = {}
    nlp = spacy.load("en_core_web_sm")  # Load spaCy here
    model_name = "yangheng/deberta-v3-base-absa-v1.1"
    tokenizer = AutoTokenizer.from_pretrained(model_name, use_fast=False)
    model = AutoModelForSequenceClassification.from_pretrained(model_name)
    
    try:
        placeId_list = json.loads(placeId_list)
        placeId_list = placeId_list.get("data", [])
        
        for placeId in placeId_list:
            reviews = []
            print("placeId", placeId)
            url = f'https://maps.googleapis.com/maps/api/place/details/json?place_id={placeId}&key={os.getenv("GOOGLE_MAPS_API_KEY")}'
            response = requests.get(url)
            data = json.loads(response.text)
            
            # Check if result exists and has reviews
            if "result" in data and "reviews" in data["result"]: 
                for review in data["result"]["reviews"]:
                    reviews.append(review['text'])
            else:
                print(f"No reviews found for place ID: {placeId}")
            
            location_to_review[placeId] = reviews
            
        location_score = []
        location = []
        keys = list(location_to_review.keys())
        
        for key in keys:
            texts = location_to_review[key]
            total_score = 0
            review_count = 0
            
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
                review_count += 1
            
            if review_count > 0:
                avg_score = int((total_score / review_count) * 100)
                location_score.append((key, avg_score))
        
        # Now sort in descending order by the score
        location_score.sort(key=lambda x: x[1], reverse=True)
        
        # location_scores is now a list of tuples like [("efgh", 1.4), ("abcd", 0.5), ... ] in descending order
        for place_id, score in location_score:
            location.append(place_id)
        
        return location
    
    except Exception as e:
        print(f"Error in get_score: {e}")
        return []  # Return empty list on error
    
