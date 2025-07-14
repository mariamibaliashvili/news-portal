import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams
} from 'react-router-dom';
import useLocalStorage from './useLocalStorage';
import Favorites from './Favorites';
import About from './About';
import './App.scss';

function Home({ t, setArticles, addToFavorites, favorites }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get('https://news-portal-gih8.onrender.com/api/news');
        setData(res.data.articles);
        setArticles(res.data.articles);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [setArticles]);

  if (loading) return <p>{t.loading}</p>;
  if (error) return <p>{t.error || `შეცდომა: ${error}`}</p>;

  return (
    <div className="container">
      <h1>{t.newsTitle}</h1>
      <div className="grid">
        {data.map((post, index) => {
          const isSaved = favorites.some(a => a.title === post.title);
          return (
            <div key={index} className="card">
              <img src={post.urlToImage || 'https://via.placeholder.com/400x200'} alt="news" />
              <div className="card-body">
                <h3>{post.title}</h3>
                <p>{post.description?.substring(0, 100)}...</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link to={`/article/${index}`}>
                    <button>{t.readMore}</button>
                  </Link>
                  {!isSaved && (
                    <button onClick={() => addToFavorites(post)}>{t.save}</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Article({ t, articles }) {
  const { id } = useParams();
  const article = articles[parseInt(id)];

  if (!article) return <p>{t.loading}</p>;

  return (
    <div className="container">
      <h2>{article.title}</h2>
      <img
        src={article.urlToImage || 'https://via.placeholder.com/800x400'}
        alt="article"
        style={{ width: '100%', borderRadius: '12px' }}
      />
      <p>{article.content || article.description}</p>
      <a href={article.url} target="_blank" rel="noopener noreferrer">
        <button>{t.openSource}</button>
      </a>
      <Link to="/">
        <button style={{ marginLeft: '10px' }}>{t.back}</button>
      </Link>
    </div>
  );
}

function App() {
  const [language, setLanguage] = useState('ka');
  const [articles, setArticles] = useState([]);
  const [favorites, setFavorites] = useLocalStorage('favorites', []);
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const translations = {
    ka: {
      newsTitle: 'სიახლეები',
      readMore: 'დაწვრილებით',
      loading: 'იტვირთება...',
      back: '← დაბრუნება',
      openSource: 'სტატიის ნახვა',
      favoritesTitle: 'ფავორიტები',
      save: 'შენახვა',
      noFavorites: 'ფავორიტები ჯერ არ გაქვთ შენახული.',
      aboutTitle: 'ჩვენს შესახებ',
      aboutText: 'ეს არის ნიუს პორტალი სადაც გაეცნობით უახლეს ამბებს.'
    },
    en: {
      newsTitle: 'News',
      readMore: 'Read more',
      loading: 'Loading...',
      back: '← Back',
      openSource: 'View full article',
      favoritesTitle: 'Favorites',
      save: 'Save',
      noFavorites: 'No favorites saved yet.',
      aboutTitle: 'About Us',
      aboutText: 'This is a news portal built with React.'
    }
  };

  const t = translations[language];

  const addToFavorites = (article) => {
    if (!favorites.some(a => a.title === article.title)) {
      setFavorites([...favorites, article]);
    }
  };

  return (
    <div className={`app ${theme}`}>
      <Router>
        <header className="app-header">
          <h1>News Portal</h1>
          <div className="nav-buttons">
            <Link to="/">Home</Link>
            <Link to="/favorites">{t.favoritesTitle}</Link>
            <Link to="/about">About</Link>

            <button
              onClick={() => setLanguage('ka')}
              className={language === 'ka' ? 'lang-btn active' : 'lang-btn'}
            >
              ქარ
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={language === 'en' ? 'lang-btn active' : 'lang-btn'}
            >
              Eng
            </button>

            <button onClick={toggleTheme} className="theme-toggle">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </header>


        <Routes>
          <Route
            path="/"
            element={
              <Home
                t={t}
                setArticles={setArticles}
                addToFavorites={addToFavorites}
                favorites={favorites}
              />
            }
          />
          <Route path="/article/:id" element={<Article t={t} articles={articles} />} />
          <Route path="/favorites" element={<Favorites favorites={favorites} t={t} />} />
          <Route path="/about" element={<About t={t} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
