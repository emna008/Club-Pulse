import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../api/axiosClient';
import { setArticles, setError, setLoading } from '../redux/articleSlice';
import ArticleCard from './ArticleCard';

const CATEGORIES = ['Tous', 'Evenement', 'Annonce', 'Idee', 'Temoignage'];

export default function ArticleList({ onToast }) {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.articles);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [search, setSearch] = useState('');

  const chargerArticles = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axiosClient.get('/articles');
      dispatch(setArticles(response.data));
    } catch (err) {
      dispatch(setError('Serveur Express injoignable sur http://localhost:5000/api.'));
    }
  };

  useEffect(() => {
    chargerArticles();
  }, []);

  const filteredItems = items.filter((article) => {
    const matchCat = selectedCategory === 'Tous' || article.category === selectedCategory;
    const keyword = search.toLowerCase();
    const matchSearch =
      article.title.toLowerCase().includes(keyword) ||
      article.content.toLowerCase().includes(keyword);
    return matchCat && matchSearch;
  });

  return (
    <section className="list-section">
      <div className="list-header">
        <div>
          <h3>Articles Synchronisés avec l’API Express</h3>
          <p className="list-subtitle">Données récupérées via Axios depuis /api/articles</p>
        </div>
        <div className="filter-box">
          <label>Filtrer par domaine :</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'Tous' ? 'Tous les domaines' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <input
        className="search-input"
        type="text"
        placeholder="Rechercher un titre..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && (
        <div className="error-banner">
          <div className="error-icon">!</div>
          <div>
            <strong>Erreur de Communication avec l’API Express :</strong>
            <p>{error}</p>
          </div>
          <button className="btn-retry" onClick={chargerArticles}>
            Réessayer
          </button>
        </div>
      )}

      {loading && (
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Chargement des articles depuis l’API Express...</p>
        </div>
      )}

      {!loading && filteredItems.length === 0 && !error && (
        <p className="empty-state">Aucun article ne correspond à votre filtre.</p>
      )}

      {!loading && filteredItems.length > 0 && (
        <div className="articles-grid">
          {filteredItems.map((article) => (
            <ArticleCard key={article._id} article={article} onToast={onToast} />
          ))}
        </div>
      )}
    </section>
  );
}
