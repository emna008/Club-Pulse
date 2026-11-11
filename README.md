# Club Pulse

Club Pulse est une application MERN de gestion des annonces d'un club étudiant. Les visiteurs consultent, filtrent et recherchent les articles. Les membres créent un compte, se connectent avec JWT, publient des articles, ajoutent des commentaires et aiment ou retirent leur like. Le front-end React communique avec une API Express, qui stocke les utilisateurs, articles et commentaires dans MongoDB Atlas.

## Architecture

```text
client/  React 18 + Vite + Redux Toolkit + Axios
server/  Node.js + Express + Mongoose + JWT + bcrypt
Atlas    Base MongoDB hébergée
```

Le client est une SPA. `client/src/main.jsx` initialise React et Redux. `App.jsx` choisit le formulaire de connexion ou celui de publication selon l'état d'authentification. Les composants d'interface se trouvent dans `client/src/components/`; les états globaux sont dans `client/src/redux/`; `client/src/api/axiosClient.js` ajoute automatiquement le jeton JWT aux requêtes.

Le serveur démarre dans `server/server.js`, se connecte à Atlas, puis monte les routes d'authentification, d'articles et de commentaires. Les schémas Mongoose sont dans `server/models/`. Le middleware `server/middleware/protect.js` vérifie les routes réservées aux membres.

## Démarrage local

Prérequis : Node.js et un cluster MongoDB Atlas avec un utilisateur de base de données.

1. Copiez `.env.example` vers `server/.env` et remplacez les valeurs d'exemple. Ne publiez jamais `server/.env`.
2. Dans Atlas, autorisez l'adresse IP de la machine de développement et utilisez un utilisateur de base de données dédié.
3. Dans un terminal :

```powershell
cd server
npm install
npm start
```

4. Dans un second terminal :

```powershell
cd client
npm install
npm run dev
```

Le front-end est disponible à `http://localhost:5173` et l'API à `http://localhost:5000`. La route `GET /` de l'API confirme qu'elle est opérationnelle. Pour créer la version de production du client : `cd client; npm run build`.

## Variables d'environnement

| Variable | Service | Usage |
| --- | --- | --- |
| `MONGODB_URI` | serveur | URI de connexion Atlas, gardée secrète |
| `JWT_SECRET` | serveur | clé longue et aléatoire pour signer les jetons |
| `CLIENT_URL` | serveur | origine exacte du front-end autorisée par CORS |
| `PORT` | serveur | port HTTP ; Render fournit sa valeur en production |
| `VITE_API_URL` | client | URL publique de l'API suivie de `/api` |

Pour le développement, `VITE_API_URL` peut rester absent : le client utilise alors `http://localhost:5000/api`.

## Modèles et relations

- `User` contient le nom, l'adresse e-mail, le mot de passe haché avec bcrypt et le rôle.
- `Article` contient le titre, le contenu, la catégorie et la référence de son auteur.
- `Comment` contient le texte, les références de l'article et de l'auteur, ainsi que les identifiants des membres qui ont aimé le commentaire.

Les références MongoDB relient les documents. Les routes utilisent `populate()` pour afficher les noms des auteurs. Les trois schémas ajoutent `createdAt` et `updatedAt` grâce à l'option `timestamps`.

## Routes principales

| Méthode | Route | Accès | Fonction |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | public | crée un membre et renvoie un JWT |
| `POST` | `/api/auth/login` | public | vérifie le mot de passe et renvoie un JWT |
| `GET` | `/api/articles` | public | liste les articles avec leurs auteurs |
| `POST` | `/api/articles` | JWT | publie un article |
| `DELETE` | `/api/articles/:id` | JWT | supprime un article et ses commentaires |
| `GET` | `/api/comments/article/:articleId` | public | liste les commentaires d'un article |
| `POST` | `/api/comments/article/:articleId` | JWT | ajoute un commentaire |
| `POST` | `/api/comments/:id/like` | JWT | bascule le like du membre sur un commentaire |
| `DELETE` | `/api/comments/:id` | JWT | supprime un commentaire |

Les routes protégées attendent `Authorization: Bearer <token>`. Les visiteurs ont accès à la lecture seule.

## Déploiement

Déployer dans cet ordre : MongoDB Atlas, API Render, puis client Vercel.

### MongoDB Atlas

Créez un cluster et un utilisateur de base de données, récupérez l'URI de connexion et autorisez l'accès réseau du serveur Render. Remplacez le nom d'utilisateur, le mot de passe et le nom de base dans l'URI. Gardez les droits de l'utilisateur aussi limités que possible.

### API Render

Créez un Web Service relié au dépôt GitHub, avec `server` comme répertoire racine, `npm install` comme commande de build et `npm start` comme commande de démarrage. Ajoutez `MONGODB_URI`, `JWT_SECRET` et `CLIENT_URL` dans les variables du service. Utilisez la racine `/` comme vérification de santé. Après le déploiement, l'URL doit répondre avec le message `API Club Pulse operationnelle`.

### Front-end Vercel

Créez un projet Vercel relié au même dépôt et sélectionnez `client` comme répertoire racine. Vercel détecte Vite ; la commande de build est `npm run build` et le dossier de sortie est `dist`. Définissez `VITE_API_URL` avec l'URL Render terminée par `/api`, puis redéployez. Mettez ensuite à jour `CLIENT_URL` dans Render avec l'URL HTTPS exacte fournie par Vercel.

### GitHub et protection des secrets

Le fichier `.gitignore` exclut les fichiers `.env` et variantes locales tout en autorisant `.env.example`. Le dossier de travail n'a pas encore de dépôt Git initialisé. Depuis la racine du projet, créez un dépôt vide sur GitHub, puis exécutez :

```powershell
git init
git add .
git status
git commit -m "Initial Club Pulse project"
git branch -M main
git remote add origin https://github.com/VOTRE-COMPTE/VOTRE-DEPOT.git
git push -u origin main
```

Avant le commit, vérifiez que `server/.env` n'apparaît pas dans `git status`; seuls les exemples sans secrets doivent être suivis. Ne publiez jamais les vrais identifiants Atlas ou la clé JWT.

## Liens de remise

- Dépôt GitHub : à renseigner après publication du dépôt.
- Application Vercel : à renseigner après le premier déploiement.
- API Render : à renseigner après le premier déploiement.
- Rapport synthétique et captures en ligne : à remettre séparément après publication de l'application.

## Avant la soutenance

Les comptes de démonstration sont créés uniquement si la base ne contient aucun utilisateur. Le mot de passe de démonstration fourni dans le code est destiné au développement ; remplacez ou désactivez ces comptes avant tout usage réel. Vérifiez également que les droits de suppression correspondent au niveau de contrôle souhaité.
