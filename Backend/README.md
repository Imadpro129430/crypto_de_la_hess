# Crypto de la Hess - Backend

Ce dépôt contient le backend de l'application "Crypto de la Hess", une plateforme permettant aux utilisateurs de suivre, gérer et acheter des cryptomonnaies.

## Table des matières

- [Technologies utilisées](#technologies-utilisées)
- [Architecture du projet](#architecture-du-projet)
- [Dépendances](#dépendances)
- [Installation](#installation)
- [Configuration](#configuration)
- [Tests](#tests)
- [API Endpoints](#api-endpoints)

## Technologies utilisées

- **Node.js** - Environnement d'exécution JavaScript
- **Express.js** - Framework web pour Node.js
- **Sequelize** - ORM (Object-Relational Mapping) pour MySQL
- **MySQL** - Système de gestion de base de données relationnelle
- **JWT** - JSON Web Tokens pour l'authentification
- **bcryptjs** - Hachage de mots de passe
- **Jest** - Framework de test

## Architecture du projet

```
Backend/
│
├── server/
│   ├── config/
│   │   └── db.js           # Configuration de la base de données
│   │
│   ├── controllers/
│   │   ├── adminController.js    # Contrôleur pour l'administration
│   │   ├── authController.js     # Contrôleur pour l'authentification
│   │   ├── cartController.js     # Contrôleur pour le panier
│   │   ├── cryptoController.js   # Contrôleur pour les cryptomonnaies
│   │   └── favoriteController.js # Contrôleur pour les favoris
│   │
│   ├── middleware/
│   │   ├── adminAuth.js    # Middleware d'authentification admin
│   │   └── auth.js         # Middleware d'authentification utilisateur
│   │
│   ├── models/
│   │   ├── Admin.js        # Modèle pour les administrateurs
│   │   ├── Cart.js         # Modèle pour le panier
│   │   ├── Crypto.js       # Modèle pour les cryptomonnaies
│   │   ├── Favorite.js     # Modèle pour les favoris
│   │   └── User.js         # Modèle pour les utilisateurs
│   │
│   └── routes/
│       ├── adminRoutes.js       # Routes d'administration
│       ├── authRoutes.js        # Routes d'authentification
│       ├── cartRoutes.js        # Routes de panier
│       ├── cryptoRoutes.js      # Routes de cryptomonnaies
│       └── favoriteRoutes.js    # Routes de favoris
│
├── tests/
│   └── controllers/
│       └── adminController.test.js  # Tests du contrôleur admin
│
├── .env                 # Variables d'environnement (non versionné)
├── jest.config.js       # Configuration de Jest
├── package.json         # Dépendances et scripts
└── server.js            # Point d'entrée de l'application
```

## Dépendances

### Dépendances principales

| Dépendance     | Version | Description                                                 |
| -------------- | ------- | ----------------------------------------------------------- |
| `express`      | ^4.18.2 | Framework web minimaliste pour Node.js                      |
| `sequelize`    | ^6.31.1 | ORM pour interagir avec la base de données                  |
| `mysql2`       | ^3.3.3  | Driver MySQL pour Node.js                                   |
| `jsonwebtoken` | ^9.0.2  | Implémentation de JSON Web Tokens                           |
| `bcryptjs`     | ^2.4.3  | Bibliothèque pour le hachage de mots de passe               |
| `cors`         | ^2.8.5  | Middleware Express pour activer CORS                        |
| `dotenv`       | ^16.4.7 | Charge les variables d'environnement depuis un fichier .env |

### Dépendances de développement

| Dépendance     | Version | Description                                                                      |
| -------------- | ------- | -------------------------------------------------------------------------------- |
| `jest`         | ^29.7.0 | Framework de test JavaScript                                                     |
| `mock-require` | ^3.0.3  | Utilitaire pour remplacer (mocker) des modules dans les tests                    |
| `nodemon`      | ^2.0.22 | Surveille les changements de fichiers et redémarre l'application automatiquement |

## Installation

1. Clonez le dépôt :

   ```bash
   git clone https://github.com/Imadpro129430/crypto_de_la_hess.git
   cd Backend
   ```

2. Installez les dépendances :

   ```bash
   npm install
   ```

   npm install express@4.18.2
   npm install sequelize@6.31.1
   npm install mysql2@3.3.3
   npm install jsonwebtoken@9.0.2
   npm install bcryptjs@2.4.3
   npm install cors@2.8.5
   npm install dotenv@16.4.7

   npm install --save-dev jest@29.7.0
   npm install --save-dev mock-require@3.0.3
   npm install --save-dev nodemon@2.0.22

3. Créez un fichier `.env` à la racine du projet avec les variables suivantes :

   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=crypto_app
   JWT_SECRET=votre_secret_jwt_très_long_et_complexe
   ```

4. Lancez le serveur de développement :
   ```bash
   npm start
   ```

## Configuration

### Base de données

Assurez-vous d'avoir créé une base de données MySQL correspondant au nom spécifié dans votre fichier `.env`. La configuration de la base de données se trouve dans `server/config/db.js`.

Par défaut, l'application se connectera à MySQL en utilisant les informations d'identification fournies dans le fichier `.env`.

### JWT

L'authentification repose sur JSON Web Tokens. Assurez-vous de définir une chaîne secrète forte pour `JWT_SECRET` dans votre fichier `.env`.

## Tests

Le projet utilise Jest comme framework de test. Les tests sont organisés par module et se trouvent dans le dossier `tests/`.

Pour exécuter tous les tests :

```bash
npm test
```

Pour exécuter un test spécifique :

```bash
npx jest tests/controllers/adminController.test.js
```

## API Endpoints

### Authentification

- `POST /api/auth/register` - Inscription d'un nouvel utilisateur
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/admin/login` - Connexion administrateur

### Cryptomonnaies

- `GET /api/cryptos` - Récupérer toutes les cryptomonnaies
- `GET /api/cryptos/:id` - Récupérer une cryptomonnaie par ID
- `GET /api/cryptos/search` - Rechercher des cryptomonnaies

### Favoris (authentification requise)

- `GET /api/favorites` - Récupérer les favoris de l'utilisateur
- `POST /api/favorites` - Ajouter une cryptomonnaie aux favoris
- `DELETE /api/favorites/:id` - Supprimer un favori

### Panier (authentification requise)

- `GET /api/cart` - Récupérer le panier de l'utilisateur
- `POST /api/cart` - Ajouter au panier
- `PUT /api/cart/:id` - Mettre à jour la quantité
- `DELETE /api/cart/:id` - Supprimer du panier

### Administration (authentification admin requise)

- `GET /api/admin/users` - Récupérer tous les utilisateurs
- `DELETE /api/admin/users/:id` - Supprimer un utilisateur
- `POST /api/admin/crypto` - Ajouter une cryptomonnaie
- `PUT /api/admin/crypto/:id` - Mettre à jour une cryptomonnaie
- `DELETE /api/admin/crypto/:id` - Supprimer une cryptomonnaie

## Contribution

Pour contribuer à ce projet :

1. Forker le dépôt
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/ma-fonctionnalite`)
3. Committer vos changements (`git commit -am 'Ajout de ma fonctionnalité'`)
4. Pousser sur la branche (`git push origin feature/ma-fonctionnalite`)
5. Créer une Pull Request

## Licence

Ce projet est sous licence MIT.
