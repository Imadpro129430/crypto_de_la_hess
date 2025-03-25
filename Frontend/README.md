# Crypto de la Hess - Frontend

## Vue d'ensemble

Crypto de la Hess est une application de suivi et de trading de cryptomonnaies construite avec React. Cette interface permet aux utilisateurs de consulter les cours des cryptomonnaies, de créer des listes de favoris, de gérer un panier d'achat et de finaliser des transactions. Elle comprend également une interface administrateur pour la gestion des cryptomonnaies et des utilisateurs.

## Fonctionnalités

- **Authentification utilisateur** : Inscription, connexion et gestion des comptes utilisateurs
- **Authentification administrateur** : Système de connexion séparé pour les administrateurs
- **Liste des cryptomonnaies** : Affichage de toutes les cryptomonnaies disponibles avec leurs cours
- **Fonctionnalité de recherche** : Recherche de cryptomonnaies spécifiques par nom ou symbole
- **Vues détaillées** : Consultation d'informations détaillées sur chaque cryptomonnaie
- **Gestion des favoris** : Ajout de cryptomonnaies aux favoris pour un accès rapide
- **Panier d'achat** : Ajout de cryptomonnaies au panier avec quantités ajustables
- **Tableau de bord utilisateur** : Consultation des informations de profil, des favoris et du panier
- **Tableau de bord administrateur** : Gestion des cryptomonnaies et des utilisateurs
- **Design responsive** : Fonctionne sur ordinateur et appareils mobiles

## Stack technique

- **React** (v18.2.0) : Bibliothèque UI
- **React Router** (v6.30.0) : Navigation et routage
- **Axios** (v1.8.4) : Client HTTP pour les requêtes API
- **Tailwind CSS** (v3.3.2) : Framework CSS utilitaire
- **Jest & React Testing Library** : Framework de test

## Structure du projet

```
Frontend/
├── public/                 # Ressources statiques
├── src/
│   ├── components/         # Composants UI réutilisables
│   │   ├── admin/          # Composants spécifiques à l'administration
│   │   ├── auth/           # Composants d'authentification
│   │   ├── cart/           # Composants du panier d'achat
│   │   ├── crypto/         # Composants liés aux cryptomonnaies
│   │   ├── favorites/      # Composants de gestion des favoris
│   │   └── layout/         # Composants de mise en page (Navbar, Footer)
│   ├── context/            # Contexte React pour la gestion d'état
│   ├── pages/              # Composants de pages
│   ├── services/           # Services API
│   ├── styles/             # Styles CSS
│   ├── utils/              # Fonctions utilitaires
│   ├── App.js              # Composant principal de l'application
│   └── index.js            # Point d'entrée
├── package.json            # Dépendances et scripts
└── README.md               # Ce fichier
```

## Installation

1. Cloner le dépôt :

   ```
   git clone https://github.com/Imadpro129430/crypto_de_la_hess.git
   cd Frontend
   ```

2. Installer les dépendances :

   ```
   npm install

   Dépendances Principales:

   npm install @testing-library/jest-dom@5.16.5
   npm install @testing-library/react@14.0.0
   npm install @testing-library/user-event@14.4.3
   npm install axios@1.8.4
   npm install react@18.2.0
   npm install react-dom@18.2.0
   npm install react-router-dom@6.30.0
   npm install react-scripts@5.0.1
   npm install web-vitals@3.3.1
   ```

   Dépendances de Développement:

   npm install --save-dev autoprefixer@10.4.14
   npm install --save-dev postcss@8.4.23
   npm install --save-dev tailwindcss@3.3.2

```


3. Créer un fichier `.env` dans le répertoire racine avec les variables suivantes :

```

REACT_APP_API_URL=http://localhost:5000

```

4. Démarrer le serveur de développement :
```

npm start

```

## Scripts disponibles

- `npm start` : Lance l'application en mode développement
- `npm test` : Démarre l'exécuteur de tests
- `npm run build` : Construit l'application pour la production
- `npm run eject` : Éjecte de la configuration Create React App

## Intégration API

Le frontend communique avec une API backend pour toutes les opérations de données. L'URL de base de l'API est configurée via la variable d'environnement `REACT_APP_API_URL`. Les principaux points d'accès API incluent :

- Authentification : `/api/auth/login`, `/api/auth/register`, `/api/admin/login`
- Cryptomonnaies : `/api/cryptos`, `/api/cryptos/:id`, `/api/cryptos/search`
- Favoris : `/api/favorites`
- Panier : `/api/cart`
- Admin : `/api/admin/users`, `/api/admin/crypto`

## Rôles utilisateurs

### Utilisateurs réguliers

- Peuvent consulter les cryptomonnaies
- Peuvent créer une liste de favoris
- Peuvent ajouter des articles au panier et passer à la caisse
- Peuvent consulter leurs informations de profil

### Administrateurs

- Peuvent gérer (ajouter, modifier, supprimer) les cryptomonnaies
- Peuvent gérer les utilisateurs
- Peuvent accéder au tableau de bord administrateur

## Flux d'authentification

L'application utilise une authentification basée sur des tokens. Lorsqu'un utilisateur se connecte, le serveur renvoie un token JWT qui est stocké dans le localStorage et inclus dans les requêtes API suivantes via l'en-tête Authorization.

## Déploiement

Pour construire l'application pour la production :

1. Exécuter le script de build :

```

npm run build

```

2. L'application construite se trouvera dans le répertoire `build`, prête à être déployée sur un service d'hébergement statique.

## Contribution

1. Forker le dépôt
2. Créer une branche de fonctionnalité : `git checkout -b nom-de-la-fonctionnalité`
3. Commit de vos modifications : `git commit -m 'Ajouter une fonctionnalité'`
4. Push vers la branche : `git push origin nom-de-la-fonctionnalité`
5. Soumettre une pull request

## Licence

Ce projet est sous licence MIT.

```
