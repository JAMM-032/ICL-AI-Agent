# objective is to return the list of links from amazon
def get_tools_from_youtube(video_id):
    from youtube_transcript_api import YouTubeTranscriptApi
    import requests
    import json
    import requests
    url = 'https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails&id=' + video_id + '&key=AIzaSyCPic4JbRETzy3lnnflCOLMLwV1Nk06tWs'
    response = requests.get(url)
    # first get the description from the response
    description = response.json()['items'][0]['snippet']['description']
    #print(description)
    ytt_api = YouTubeTranscriptApi()
    fetched_transcript = ytt_api.fetch(video_id=video_id)
    # for snippet in fetched_transcript:
    #     print(snippet.text)
    print(len(fetched_transcript))
    # Specify the URL of the API endpoint
    url = "https://api.asi1.ai/v1/chat/completions"

    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer sk_ac30c25268c1452fa555f070e4e5e5b2aac78c99b9c24e23afe7ff154cd66e8c"
    }
    
    body ={
    "model": "asi1-mini",
    "messages": [
        {
        "role": "user",
        "content": "You are a helpful DIY assistant. You will be given 2 parts: 1. A description of the video 2. A transcript of the video. You will need to return a list of tools that are mentioned in the second text and play significant role in the video but not explicitly in the first text then answer as an array of strings containing tool names with detailed description. here is the first text: " + description + " and here is the second text: " + str(fetched_transcript)
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
    print(data)
