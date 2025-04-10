👷DIY AI AGENT: offering seamless experience on your DIY journey

🚨The problem:

The problem is that people find it really hard to build or repair interror due to the lack of familiality at the start. And the book about DIY does not provide sufficient information on what you need to buy. This is because the product is deprecated, the product is so far away from the home country etc.

⭐️The Solution:

We have built an AI agent that will help DIY starter and those who want to repair their interior by...

Giving chatting interface to user and teach how to build something like a chair from scratch.

Analyzing Youtube video from Youtube link and will show the list of tools you need to have before user build it.

Giving Personalised recommendation system by analysing and extract aspects that user may care the most from reviews from Google Map.

👀Key Feature:

Built a uAgent that will retrieve the Amazon links from a single Youtube link if the Youtube video relates to the DIY project. Using storage on uAgent improved the performance as previous query will be stored on a dictionary. https://agentverse.ai/agents/details/agent1qdaarjf9fent8y0fmnd47lk66w9nuyx7j6042mlpyk6zsehq7caz2h8cwu3/stats
Implemented an NLP system that will identify whether the user request relates to the DIY project.
Used ASI-1 mini model to extract the location that user has mentioned and sent the request to uAgent that has limitless access on closest reparing shops from the Google map. https://agentverse.ai/agents/details/agent1qwjxllsh6k6f9q4t7qllw85ad82qunzac9yncu33ynr9tmll5d9cgs6e7xq/profile
Used ABSA(Aspect Based Sentimental Analysis) to calculate the sentimental score on each google location. And compare these values, then generated the recommendation system. (Only on Backend and not on video😭)
Used an external uAgent from Fetch.ai to query the coordinate of the location and passed that to the Agent I explained on 3rd point. https://agentverse.ai/agents/details/agent1qgtaj7emyccjrhce8xh0dmxltu6akurkddhttr58krafq55vpf9vjwtcdqn/profile
