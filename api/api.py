import time
import urllib.request
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from bs4 import BeautifulSoup
from flask import Flask

nltk.download('punkt')
nltk.download('stopwords')

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

    # Step 1: Data collection from Wikipedia using web scraping
    url = "https://www.cncf.io/blog/2023/04/12/stability-and-scalability-assessment-of-kubevela/"
    article_content = urllib.request.urlopen(url)

    article = article_content.read()

    article_parsed = BeautifulSoup(article, 'html.parser')
    title = article_parsed.find('title').text
    paragraphs = article_parsed.find_all('p')
    text = ''
    for p in paragraphs:
        text += p.text

    # Step 3: Data clean-up
    stop_words = set(stopwords.words("english"))
    words = word_tokenize(text)
    words = [word.lower() for word in words if word.isalpha() and word not in stop_words]

    # Step 4: Tokenization
    sentences = sent_tokenize(text)

    # Step 5: Calculate word frequency
    word_freq = nltk.FreqDist(words)

    # Step 6: Calculate weighted frequency for each sentence
    sent_scores = {}
    for sentence in sentences:
        for word in nltk.word_tokenize(sentence.lower()):
            if word in word_freq.keys():
                if len(sentence.split(" ")) < 30:
                    if sentence not in sent_scores.keys():
                        sent_scores[sentence] = word_freq[word]
                    else:
                        sent_scores[sentence] += word_freq[word]

    # Step 7: Creation of summary by choosing 10% of top weighted sentences
    total_sent = len(sentences)
    summary_size = round(total_sent * 0.1)
    summary = " ".join([sent[0] for sent in sorted(sent_scores.items(), key=lambda x: x[1], reverse=True)[:summary_size]])

    return {'title': title,
            'url': url,
            'gist': summary}