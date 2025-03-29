import spacy
import re
import os
from openai import OpenAI

# INSTALL REQUIRED PACKAGES LIKE SO: python -m pip install -U spacy openai
# INSTALL REQUIRED spaCy model: python -m spacy download en_core_web_lg

client = OpenAI(api_key=os.environ['OPENAI-API'])  # Replace with actual API key

# Load spaCy's NLP model
nlp = spacy.load("en_core_web_lg")

key_words = {
    # building keywords
    "install", "build", "set up", "assemble", "construct", "create", "put together",
    # fixing keywords
    "repair", "fix", "replace", "restore", "troubleshoot", "unclog", "patch up", "mend"
}

# Regular expressions for constraint extraction
BUDGET_PATTERN = r"\$\d+"
TIME_PATTERN = r"(in|for|within)\s\d+\s*(hours?|minutes?|days?)"

def call_llm(text):
    """Uses LLM to preprocess input into a structured format."""
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "Use the input JSON format to either find a detailed step-by-step solution to the user's DIY issue or recommend a builder to fix their issue."},
            {"role": "user", "content": text}
        ],
        temperature=0
    )
    return response.choices[0].message.content

def extract_constraints(text):
    """Extracts budget and time constraints using regex."""
    budget_match = re.search(BUDGET_PATTERN, text)
    time_match = re.search(TIME_PATTERN, text)

    budget = budget_match.group(0) if budget_match else None
    time_constraint = time_match.group(0) if time_match else None

    return {"budget": budget, "time": time_constraint}

def extract_object_and_description(text):
    """Uses spaCy to extract objects and their descriptions."""
    doc = nlp(text)

    # Extract noun phrases as possible objects
    print(*(doc.noun_chunks))
    objects = [chunk.text for chunk in doc if chunk.pos_ == 'NOUN']

    # Extract adjectives, verbs, and modifiers as descriptions
    descriptions = [token.text for token in doc if token.pos_ in {"ADJ", "VERB", "ADV"}]

    return objects, " ".join(descriptions)

def parse_user_input(text):
    """Parses user input to extract the object to create, description, and constraints."""
    objects, description = extract_object_and_description(text)
    constraints = extract_constraints(text)

    # Assume the first noun phrase is the main object
    main_object = objects[0] if objects else None

    return {
        "object": main_object,
        "description": description,
        "constraints": constraints,
        "raw_text" : text
    }

# call 'parse_user_input' to return the raw text in json format.
