from bs4 import BeautifulSoup
import requests
import pandas as pd
import datetime

def scrape_hindustan_times():
    url = "https://www.hindustantimes.com/"
    response = requests.get(url)
    
    if response.status_code != 200:
        print("Failed to fetch news")
        return []
    
    soup = BeautifulSoup(response.content, "html.parser")
    articles = soup.find_all("div", class_="media-heading")  # Update this selector if needed
    news_list = []

    for article in articles:
        title = article.text.strip()
        link = article.a["href"]
        news_list.append({"title": title, "url": link, "date": datetime.date.today()})

    return news_list

# Save news to CSV
news_data = scrape_hindustan_times()
df = pd.DataFrame(news_data)
df.to_csv("daily_news.csv", mode="w", index=False)
print("Daily news updated.")
