const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware sentinelle : verifie Authorization: Bearer <token>
async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Acces refuse : token JWT manquant.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        message: 'Acces refuse : utilisateur introuvable.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Acces refuse : token JWT invalide ou expire.'
    });
  }
}

module.exports = protect;
