import time
import requests
from bs4 import BeautifulSoup
from flask import Flask

app = Flask(__name__)

@app.route('/time')
def get_current_time():
    # Get the current time as a floating-point value
    timestamp = time.time()

    # Convert the timestamp to a time tuple
    time_tuple = time.localtime(timestamp)

    # Format the time tuple as a string
    time_string = time.strftime("%Y-%m-%d %H:%M:%S", time_tuple)

    return {'time': time_string}

@app.route('/summary')
def get_summary():

    # Assign URL
    url = "https://saumyagupta.hashnode.dev/apis-for-beginners-understanding-what-they-are-how-they-work"

    # Fetch raw HTML content
    html_content = requests.get(url).text

    # Now that the content is ready, iterate
    # through the content using BeautifulSoup:
    soup = BeautifulSoup(html_content, "html.parser")

    # Find the title tag in the HTML content and get the text of the title
    title_tag = soup.find("title")
    title = title_tag.text

    # get all the occurrences of a p tag
    texts = soup.find_all('p')
    extracted_text = ""
    for text in texts:
        extracted_text += text.get_text() + " "
        if (len(extracted_text) > 3000):
            break

    return {'title': title,
            'url': url}