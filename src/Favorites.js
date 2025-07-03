import React from 'react';
import { Link } from 'react-router-dom';

function Favorites({ favorites, t }) {
  if (favorites.length === 0) return <p>{t.noFavorites}</p>;

  return (
    <div className="container">
      <h1>{t.favoritesTitle}</h1>
      <div className="grid">
        {favorites.map((article, index) => (
          <div key={index} className="card">
            <img src={article.urlToImage || 'https://via.placeholder.com/400x200'} alt="cover" />
            <div className="card-body">
              <h3>{article.title}</h3>
              <p>{article.description?.substring(0, 100)}...</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <button>{t.openSource}</button>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites;
