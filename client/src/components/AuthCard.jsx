import { useState } from 'react';
import { useDispatch } from 'react-redux';
import axiosClient from '../api/axiosClient';
import { loginSuccess } from '../redux/authSlice';

export default function AuthCard() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      setLoading(true);
      const url = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister ? { name, email, password } : { email, password };
      const response = await axiosClient.post(url, payload);
      dispatch(loginSuccess(response.data));
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Erreur de connexion au serveur Express.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setIsRegister(false);
    setEmail('gueddes@poly.tn');
    setPassword('123456');
    setErrorMsg('');
  };

  return (
    <section className="form-card auth-card">
      <div className="form-header">
        <span className="lock-pill">Espace Membre Sécurisé (JWT)</span>
        <h3>{isRegister ? 'Créer un compte' : 'Connexion Requise pour Publier'}</h3>
        <p>
          {isRegister
            ? 'Le mot de passe est haché avec bcrypt côté serveur.'
            : 'Connectez-vous pour obtenir votre Token JWT et débloquer l’ajout / suppression.'}
        </p>
      </div>

      {errorMsg && <div className="feedback-alert error">{errorMsg}</div>}

      <form onSubmit={handleSubmit} className="article-form">
        {isRegister && (
          <div className="form-group">
            <label htmlFor="name">Nom :</label>
            <input
              id="name"
              type="text"
              placeholder="Votre nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="email">Adresse Email :</label>
          <input
            id="email"
            type="email"
            placeholder="gueddes@poly.tn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de Passe :</label>
          <input
            id="password"
            type="password"
            placeholder="123456"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading
            ? 'Vérification...'
            : isRegister
              ? 'Créer mon compte'
              : 'Se Connecter (Obtenir Token JWT)'}
        </button>
        <button
          type="button"
          className="btn-switch"
          onClick={() => {
            setIsRegister(!isRegister);
            setErrorMsg('');
          }}
        >
          {isRegister ? 'Déjà membre ? Se connecter' : 'Pas de compte ? Créer un compte'}
        </button>
        {!isRegister && (
          <button type="button" className="btn-demo" onClick={fillDemoAccount}>
            Remplir Compte Demo (gueddes@poly.tn / 123456)
          </button>
        )}
      </form>
    </section>
  );
}
