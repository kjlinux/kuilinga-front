# KUILINGA - Système de Gestion de Présence

Application frontend moderne pour la gestion de présence développée avec React.js, TypeScript et Tailwind CSS.

## 🚀 Fonctionnalités

- ✅ Authentification sécurisée avec JWT
- 📊 Dashboard interactif avec statistiques en temps réel
- 👥 Gestion complète des utilisateurs
- ⏰ Suivi des présences en temps réel
- 📈 Rapports et analyses détaillés
- 🔔 Système de notifications
- 📱 Interface responsive (mobile, tablette, desktop)
- 🎨 Design moderne avec palette de couleurs personnalisée

## 🛠️ Technologies

- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **Recharts** - Bibliothèque de graphiques
- **React Router** - Routing
- **Axios** - Client HTTP
- **Framer Motion** - Animations
- **date-fns** - Manipulation de dates
- **Lucide React** - Icônes

## 📦 Installation

### Prérequis

- Node.js 18+ 
- pnpm (recommandé) ou npm

### Étapes d'installation

1. **Cloner le projet**
\`\`\`bash
git clone <url-du-repo>
cd kuilinga-frontend
\`\`\`

2. **Installer les dépendances**
\`\`\`bash
pnpm install
\`\`\`

3. **Configurer les variables d'environnement**
\`\`\`bash
cp .env.example .env
\`\`\`

Modifier le fichier `.env` avec vos configurations :
\`\`\`env
VITE_API_URL=http://localhost:8000
\`\`\`

4. **Lancer le serveur de développement**
\`\`\`bash
pnpm dev
\`\`\`

L'application sera accessible sur `http://localhost:3000`

## 🏗️ Structure du projet

\`\`\`
src/
├── components/          # Composants réutilisables
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── Layout.tsx
│   ├── StatCard.tsx
│   ├── LoadingSpinner.tsx
│   └── PrivateRoute.tsx
├── contexts/           # Contextes React
│   ├── AuthContext.tsx
│   └── NotificationContext.tsx
├── pages/             # Pages de l'application
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Attendance.tsx
│   ├── Reports.tsx
│   ├── Users.tsx
│   ├── Settings.tsx
│   └── NotFound.tsx
├── services/          # Services API
│   ├── api.service.ts
│   ├── auth.service.ts
│   ├── attendance.service.ts
│   ├── report.service.ts
│   ├── user.service.ts
│   └── notification.service.ts
├── types/            # Types TypeScript
│   └── index.ts
├── config/           # Configuration
│   └── api.ts
├── App.tsx           # Composant principal
├── main.tsx          # Point d'entrée
└── index.css         # Styles globaux
\`\`\`

## 🎨 Palette de couleurs

- **Primary**: #703D57 (Violet foncé)
- **Secondary**: #272635 (Gris très foncé)
- **Accent**: #A6A6A8 (Gris moyen)
- **Light**: #CECECE (Gris clair)
- **Background**: #E8E9F3 (Gris très clair)

## 📱 Breakpoints responsive

- **sm**: 576px
- **md**: 768px
- **lg**: 992px
- **xl**: 1200px
- **2xl**: 1920px

## 🔐 Authentification

L'application utilise JWT pour l'authentification :
- Access token stocké dans localStorage
- Refresh token pour renouveler automatiquement la session
- Redirection automatique vers /login si non authentifié

## 📡 API

L'application communique avec une API FastAPI. Tous les endpoints sont configurés dans `src/config/api.ts`.

### Configuration du proxy

Le proxy Vite redirige automatiquement les requêtes `/api/*` vers `http://localhost:8000` en développement.

## 🧪 Scripts disponibles

\`\`\`bash
# Développement
pnpm dev

# Build de production
pnpm build

# Preview du build
pnpm preview

# Linting
pnpm lint
\`\`\`

## 🚀 Déploiement

### Build de production

\`\`\`bash
pnpm build
\`\`\`

Les fichiers optimisés seront générés dans le dossier `dist/`.

### Variables d'environnement de production

Assurez-vous de configurer `VITE_API_URL` avec l'URL de votre API en production.

## 📝 Utilisation

### Connexion

1. Accédez à `/login`
2. Entrez vos identifiants
3. Vous serez redirigé vers le dashboard

### Navigation

- **Dashboard** : Vue d'ensemble avec statistiques et graphiques
- **Présences** : Suivi en temps réel des présences
- **Rapports** : Génération et export de rapports
- **Utilisateurs** : Gestion des employés
- **Paramètres** : Configuration du compte

## 🤝 Contribution

Ce projet a été développé par TANGA GROUP pour le système KUILINGA.

## 📄 Licence

© 2025 TANGA GROUP - Tous droits réservés

## 🆘 Support

Pour toute question ou problème, contactez l'équipe de développement.
