import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../api/axiosClient';
import { addArticle } from '../redux/articleSlice';

const CATEGORIES = ['Evenement', 'Annonce', 'Idee', 'Temoignage'];

export default function ArticleForm({ onToast }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.articles);
  const { user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.trim() === '' || content.trim() === '') {
      setErrorMessage('Le titre et le contenu sont obligatoires.');
      return;
    }

    try {
      const response = await axiosClient.post('/articles', {
        title,
        content,
        category
      });
      dispatch(addArticle(response.data));
      setTitle('');
      setContent('');
      setCategory(CATEGORIES[0]);
      setErrorMessage('');
      onToast('Article publié avec succès !');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Publication impossible.');
    }
  };

  return (
    <section className="form-card">
      <div className="form-header">
        <span className="lock-pill">Membre connecté</span>
        <h3>Publier un Nouvel Article</h3>
        <p>
          Auteur certifié : <strong>{user?.name}</strong> — lu depuis le Token JWT
        </p>
      </div>
      {errorMessage !== '' && <div className="feedback-alert error">{errorMessage}</div>}
      <form onSubmit={handleSubmit} className="article-form">
        <div className="form-group">
          <label>Titre de l’Article :</label>
          <input
            type="text"
            placeholder="Ex : Atelier déploiement Render + Vercel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Catégorie :</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Contenu :</label>
          <textarea
            rows="4"
            placeholder="Décrivez l’événement, l’idée ou le témoignage..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-submit" disabled={loading}>
          + Publier dans la Base Cloud
        </button>
      </form>
    </section>
  );
}
