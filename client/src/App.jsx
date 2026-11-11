import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import AuthCard from './components/AuthCard';
import ArticleForm from './components/ArticleForm';
import ArticleList from './components/ArticleList';
import Toast from './components/Toast';

export default function App() {
  const { user } = useSelector((state) => state.auth);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    document.title = 'Club Pulse';
  }, []);

  return (
    <div className="app-shell">
      <Navbar />
      <header className="page-hero">
        <h1>Authentification Full-Stack JWT & Protection des Actions</h1>
      </header>
      <main className="container main-content">
        <div className="app-grid-layout">
          <div className="column-form">{user ? <ArticleForm onToast={setToastMessage} /> : <AuthCard />}</div>
          <div className="column-list">
            <ArticleList onToast={setToastMessage} />
          </div>
        </div>
      </main>
      <footer className="app-footer">
        École Polytechnique de Sousse — MERN Stack Groupe Décalé 2026-2027 — Dr. Abdelweheb GUEDDES
      </footer>
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
}
