import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../api/axiosClient';
import { setArticles, setError, setLoading } from '../redux/articleSlice';
import { logout } from '../redux/authSlice';

export default function Navbar() {
  const { items, loading } = useSelector((state) => state.articles);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleRefresh = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axiosClient.get('/articles');
      dispatch(setArticles(response.data));
    } catch (err) {
      dispatch(setError('Serveur Express injoignable sur http://localhost:5000/api.'));
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="logo-mark">★</span>
        <div>
          <h2>Club Pulse Full-Stack</h2>
        </div>
      </div>

      <div className="nav-stats">
        {user ? (
          <div className="user-badge connected">
            <span>
              {user.name} · {user.role}
            </span>
            <button className="btn-logout" onClick={() => dispatch(logout())}>
              Déconnexion
            </button>
          </div>
        ) : (
          <div className="user-badge visitor">Mode Visiteur (Lecture seule)</div>
        )}
        <button className="btn-refresh" onClick={handleRefresh} disabled={loading}>
          {loading ? 'Chargement...' : 'Rafraîchir'}
        </button>
        <div className="stat-pill">
          <span className="stat-label">Articles :</span>
          <span className="stat-count">{items.length}</span>
        </div>
      </div>
    </nav>
  );
}
