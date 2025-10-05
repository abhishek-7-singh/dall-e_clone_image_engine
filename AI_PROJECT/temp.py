import pickle
import re
import nltk
from nltk.corpus import stopwords
from curl_cffi import requests
import sys
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

def predict(url):
    text_vector = vectorizer.transform([url])
    prediction = model.predict(text_vector)
    response = {'prediction': int(prediction[0])}
    print(response)


