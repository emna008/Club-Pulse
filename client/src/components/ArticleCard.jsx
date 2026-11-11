import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../api/axiosClient';
import { removeArticle } from '../redux/articleSlice';

export default function ArticleCard({ article, onToast }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const pendingCommentLikes = useRef(new Set());
  const [pendingCommentLikeIds, setPendingCommentLikeIds] = useState([]);

  const authorName = article.author?.name || 'Auteur inconnu';

  useEffect(() => {
    if (!showComments) {
      return;
    }

    axiosClient
      .get('/comments/article/' + article._id)
      .then((response) => setComments(response.data))
      .catch(() => setComments([]));
  }, [showComments, article._id]);

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
      setLiked(false);
    } else {
      setLikes(likes + 1);
      setLiked(true);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Supprimer l’article "' + article.title + '" ?')) {
      return;
    }

    try {
      await axiosClient.delete('/articles/' + article._id);
      dispatch(removeArticle(article._id));
      onToast('Article supprimé avec succès !');
    } catch (err) {
      onToast(err.response?.data?.message || 'Suppression impossible.');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      return;
    }

    try {
      const response = await axiosClient.post('/comments/article/' + article._id, {
        text: commentText
      });
      setComments([response.data, ...comments]);
      setCommentText('');
      onToast('Commentaire ajouté.');
    } catch (err) {
      onToast(err.response?.data?.message || 'Commentaire impossible.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axiosClient.delete('/comments/' + commentId);
      setComments(comments.filter((item) => item._id !== commentId));
    } catch (err) {
      onToast(err.response?.data?.message || 'Suppression du commentaire impossible.');
    }
  };

  const currentUserId = user?.id || user?._id;

  const hasLikedComment = (comment) => {
    if (!currentUserId) {
      return false;
    }
    return (comment.likedBy || []).some((id) => String(id) === String(currentUserId));
  };

  const handleToggleCommentLike = async (comment) => {
    if (!currentUserId) {
      onToast('Connectez-vous pour liker un commentaire.');
      return;
    }

    if (pendingCommentLikes.current.has(comment._id)) {
      return;
    }

    pendingCommentLikes.current.add(comment._id);
    setPendingCommentLikeIds((current) => [...current, comment._id]);

    try {
      const response = await axiosClient.post('/comments/' + comment._id + '/like');
      setComments((current) =>
        current.map((item) => (item._id === comment._id ? response.data : item))
      );
    } catch (err) {
      onToast(err.response?.data?.message || 'Like impossible.');
    } finally {
      pendingCommentLikes.current.delete(comment._id);
      setPendingCommentLikeIds((current) => current.filter((id) => id !== comment._id));
    }
  };

  return (
    <article className="article-card">
      <div className="card-top">
        <span className="badge-category">{article.category}</span>
        {user ? (
          <button className="btn-delete" onClick={handleDelete}>
            Supprimer
          </button>
        ) : (
          <span className="locked-tag">Lecture seule</span>
        )}
      </div>
      <h3 className="article-title">{article.title}</h3>
      <p className="card-content">{article.content}</p>
      <div className="card-footer">
        <span className="author-info">
          Auteur : <strong>{authorName}</strong>
        </span>
        <button className={liked ? 'btn-like active' : 'btn-like'} onClick={handleLike}>
          {liked ? '♥ Unlike' : '♡ Like'} · {likes}
        </button>
      </div>
      <button className="btn-comments" onClick={() => setShowComments(!showComments)}>
        {showComments ? 'Masquer les commentaires' : 'Voir les commentaires'}
      </button>
      {showComments && (
        <div className="comments-box">
          {user && (
            <form onSubmit={handleAddComment} className="comment-form">
              <input
                type="text"
                placeholder="Votre commentaire..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button type="submit">Envoyer</button>
            </form>
          )}
          {comments.length === 0 && <p className="empty-comments">Aucun commentaire pour le moment.</p>}
          {comments.map((comment) => {
            const commentLiked = hasLikedComment(comment);
            const likeCount = (comment.likedBy || []).length;
            return (
              <div key={comment._id} className="comment-item">
                <p>{comment.text}</p>
                <div className="comment-meta">
                  <small>
                    {comment.author?.name} —{' '}
                    {new Date(comment.createdAt).toLocaleString('fr-FR', {
                      dateStyle: 'short',
                      timeStyle: 'short'
                    })}
                  </small>
                  <button
                    type="button"
                    className={commentLiked ? 'btn-comment-like active' : 'btn-comment-like'}
                    onClick={() => handleToggleCommentLike(comment)}
                    disabled={pendingCommentLikeIds.includes(comment._id)}
                  >
                    {commentLiked ? '♥ Unlike' : '♡ Like'} · {likeCount}
                  </button>
                  {user && (
                    <button
                      type="button"
                      className="btn-comment-delete"
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}
