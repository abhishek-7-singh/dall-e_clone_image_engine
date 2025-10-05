# import pickle
# import re
# import nltk
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from nltk.corpus import stopwords
# from curl_cffi import requests
# from bs4 import BeautifulSoup
# import sys

# app = Flask(__name__)
# import warnings
# warnings.filterwarnings("ignore")
# nltk.download('stopwords')

# with open('model.pkl', 'rb') as f:
#     model = pickle.load(f)

# def preprocessing(text):
#     text = text.replace("\n", " ").replace("\t", " ")
#     text = text.lower()
#     text = re.sub('@[^\s]+', '', text)
#     text = re.sub(r'\B#\S+', '', text)
#     text = re.sub(r"http\S+", "", text)
#     text = ' '.join(re.findall(r'\w+', text))
#     text = re.sub(r'\s+[b-zA-Z]\s+', ' ', text)
#     text = re.sub(r'\s+', ' ', text, flags=re.I)
#     return text

# with open('vectorizer.pkl', 'rb') as f:
#     vectorizer = pickle.load(f)
# def preprocessing(text):
#     text = text.replace("\n", " ").replace("\t", " ")
#     text = text.lower()
#     text = re.sub('@[^\s]+', '', text)
#     text = re.sub(r'\B#\S+', '', text)
#     text = re.sub(r"http\S+", "", text)
#     text = ' '.join(re.findall(r'\w+', text))
#     text = re.sub(r'\s+[b-zA-Z]\s+', ' ', text)
#     text = re.sub(r'\s+', ' ', text, flags=re.I)
#     print(text, file=sys.stderr)
#     return text

# def scraper_article(url) :
#     response = requests.get(url)
#     if response.status_code != 200 :
#         print("Failed to get request")
#         return
#     from bs4 import BeautifulSoup
#     soup = BeautifulSoup(response.content)
#     title = soup.find("h1",{"class":"hdg1"}).text
#     try:
#             body = soup.find("div",{"id":"dataHolder"}).text
#     except Exception as e:
#         return title,""
#     return title,body

# @app.route('/predict', methods=['POST'])
# def predict():
#     data = request.get_json()
#     if 'title' not in data:
#         return jsonify({'error': 'Title not found in request body'}), 400

#     url = data['title']
#     if not url:
#         return jsonify({'error': 'URL cannot be empty'}), 400
#     if "https://www.hindustantimes.com" in url:
#         title, text = scraper_article(url)
#         processed_text = preprocessing(text)
#         text_vector = vectorizer.transform([processed_text])
#         prediction = model.predict(text_vector)
#         response = {'prediction': int(prediction[0]),'title':title}
#         return jsonify(response)
#     else:
#         text_vector = vectorizer.transform([url])
#         prediction = model.predict(text_vector)
#         response = {'prediction': int(prediction[0]),'title':url}
#         return jsonify(response)

# if __name__ == '__main__':
#     CORS(app)
#     app.run(debug=True)


# ///////////////////////////////////////////////////////


import pickle
import re
import nltk
from flask import Flask, request, jsonify
from flask_cors import CORS
from nltk.corpus import stopwords
from curl_cffi import requests
from bs4 import BeautifulSoup
import sys

app = Flask(__name__)
import warnings
warnings.filterwarnings("ignore")
nltk.download('stopwords')

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
    return text

with open('vectorizer.pkl', 'rb') as f:
    vectorizer = pickle.load(f)
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
    if 'title' not in data:
        return jsonify({'error': 'Title not found in request body'}), 400

    url = data['title']
    if not url:
        return jsonify({'error': 'URL cannot be empty'}), 400
    if "https://www.hindustantimes.com" in url:
        title, text = scraper_article(url)
        processed_text = preprocessing(text)
        text_vector = vectorizer.transform([processed_text])
        prediction = model.predict(text_vector)
        response = {'prediction': int(prediction[0]),'title':title}
        return jsonify(response)
    else:
        text_vector = vectorizer.transform([url])
        prediction = model.predict(text_vector)
        response = {'prediction': int(prediction[0]),'title':url}
        return jsonify(response)

if __name__ == '__main__':
    CORS(app)
    app.run(debug=True)
