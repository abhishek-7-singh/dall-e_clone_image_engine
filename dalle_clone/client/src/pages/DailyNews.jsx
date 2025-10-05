import React, { useEffect, useState } from "react";

const DailyNews = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/daily_news")
            .then(response => response.json())
            .then(data => setNews(data))
            .catch(error => console.error("Error fetching news:", error));
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Daily News Classification</h1>
            {news.length === 0 ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {news.map((item, index) => (
                        <li key={index} className={`p-2 mb-2 border rounded ${item.prediction === "FAKE" ? "bg-red-200" : "bg-green-200"}`}>
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-semibold">{item.title}</a>
                            <span className="ml-2 px-2 py-1 text-xs font-bold rounded bg-white">{item.prediction}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DailyNews;
