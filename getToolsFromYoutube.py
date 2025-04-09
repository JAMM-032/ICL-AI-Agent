# objective is to return the list of links from amazon
from youtube_transcript_api import YouTubeTranscriptApi
import requests
import json
url = 'https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails&id=Ks-_Mh1QhMc&key=AIzaSyCPic4JbRETzy3lnnflCOLMLwV1Nk06tWs'
response = requests.get(url)
# first get the description from the response
description = response.json()['items'][0]['snippet']['description']
print(description)
ytt_api = YouTubeTranscriptApi()
fetched_transcript = ytt_api.fetch(video_id="2TL3DgIMY1g")
# for snippet in fetched_transcript:
#     print(snippet.text)
