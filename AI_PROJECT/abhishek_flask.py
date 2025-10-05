import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import nltk
from nltk.corpus import stopwords
from curl_cffi import requests
import sys
# Download the stopwords corpus if it's not already downloaded
nltk.download('stopwords')

# Load the trained model
with open('model.pkl', 'rb') as f:
    model = pickle.load(f)
def preprocessing(text):
    text = text.replace("\n", " ").replace("\t", " ")
    text = text.lower()
    text = re.sub('@[^\s]+', '', text)
    text = re.sub(r'\B#\S+', '', text)
    text = re.sub(r"http\S+", "", text)
    text = ' '.join(re.findall(r'\w+', text))
    text = re.sub(r'\s+[b-zA-Z]\s+', ' ', text)
    text = re.sub(r'\s+', ' ', text, flags=re.I)
    print(text, file=sys.stderr)
    return text
# Load the vectorizer used for text preprocessing
with open('vectorizer.pkl', 'rb') as f:
    vectorizer = pickle.load(f)

app = Flask(__name__)

# General transformation in the text
def preprocessing(text):
    text = text.replace("\n", " ").replace("\t", " ")
    text = text.lower()
    text = re.sub('@[^\s]+', '', text)
    text = re.sub(r'\B#\S+', '', text)
    text = re.sub(r"http\S+", "", text)
    text = ' '.join(re.findall(r'\w+', text))
    text = re.sub(r'\s+[b-zA-Z]\s+', ' ', text)
    text = re.sub(r'\s+', ' ', text, flags=re.I)
    print(text, file=sys.stderr)
    return text

def scraper_article(url) :
    response = requests.get(url)
    if response.status_code != 200 :
        print("Failed to get request")
        return
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(response.content)
    title = soup.find("h1",{"class":"hdg1"}).text
    try:
            body = soup.find("div",{"id":"dataHolder"}).text
    except Exception as e:
        return title,""
    return title,body

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    url = data['url']

    title, text = scraper_article(url)
    print(f"The title of the article is: {title}")
    # Preprocess the input text
    processed_text = preprocessing(text)

    # Convert the text to a vector using the vectorizer
    text_vector = vectorizer.transform([processed_text])

    # Make the prediction
    prediction = model.predict(text_vector)

    # Return the prediction as a JSON response
    response = {'prediction': int(prediction[0])}
    return jsonify(response)

if __name__ == '__main__':
    CORS(app)
    app.run(debug=True)
