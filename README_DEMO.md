# 🎭 KUILINGA - Démo avec Données Mockées

## 🚀 Accès Rapide à la Démo

### En Ligne (Vercel)
Une fois déployé sur Vercel, l'application sera accessible 24/7 sans besoin de backend.

**URL de démo**: `https://kuilinga-demo.vercel.app` (à configurer)

### En Local
```bash
# 1. Activer le mode mock
echo "VITE_USE_MOCK_API=true" > .env

# 2. Installer les dépendances
pnpm install

# 3. Lancer le serveur
pnpm run dev

# 4. Ouvrir http://localhost:3000
```

## 🔐 Connexion à la Démo

Utilisez un de ces comptes de démonstration:

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| **Super Admin** | `superadmin@kuilinga.com` | `demo123` |
| **Admin Organisation** | `admin@kuilinga.com` | `demo123` |
| **RH** | `rh@kuilinga.com` | `demo123` |
| **Manager** | `manager@kuilinga.com` | `demo123` |
| **Employé** | `employee@kuilinga.com` | `demo123` |

💡 **Astuce**: En mode mock, vous pouvez aussi utiliser n'importe quel email/password, mais les comptes ci-dessus garantissent les bonnes permissions.

## 📊 Données Disponibles

La démo contient des données réalistes françaises:

### 🏢 Structure Organisationnelle
- **5 organisations**: TechCorp, InnovateLab, GlobalServices, DataTech, CloudNet
- **15 sites** à travers la France (Paris, Lyon, Marseille, Toulouse, Bordeaux, etc.)
- **33 départements** (IT, RH, Commercial, Marketing, Finance, etc.)

### 👥 Personnel
- **30 employés** avec noms français authentiques
- **10 utilisateurs** avec différents rôles et permissions
- Titres de postes variés et réalistes

### ⏰ Présences
- **1000+ enregistrements** de présence
- Données des **30 derniers jours**
- Heures d'entrée/sortie réalistes (8h-18h)

### 📱 Appareils
- **15 lecteurs biométriques** et badges
- Statuts: 20 en ligne, 3 hors ligne, 2 en maintenance
- Répartis sur tous les sites

### 🏖️ Congés
- **5 demandes de congé** avec différents statuts
- Types: Congés annuels, maladie, autres
- Statuts: En attente, approuvé, refusé

### 📈 Tableaux de Bord
Données complètes pour les 4 types de dashboards:
- Dashboard Admin (métriques multi-organisations)
- Dashboard Manager (présence d'équipe)
- Dashboard Employé (présences personnelles)
- Dashboard Intégrateur (statut des appareils)

## ✨ Fonctionnalités Démontrables

### Tout Fonctionne Sans Backend!

✅ **Authentification**
- Login avec tokens JWT mockés
- Refresh token automatique
- Déconnexion

✅ **CRUD Complet**
- Créer, Lire, Modifier, Supprimer
- Les changements persistent pendant la session
- Données réinitialisées au rechargement de page

✅ **Recherche & Filtrage**
- Recherche par nom, email, etc.
- Filtres par organisation, site, département
- Pagination (10/20/50 items par page)

✅ **Rapports**
- Prévisualisation de tous les types de rapports (R1-R20)
- Export simulé (PDF, Excel, CSV)

✅ **Tableaux de Bord**
- Métriques en temps réel mockées
- Graphiques et statistiques
- Données par rôle

✅ **Gestion des Congés**
- Soumettre des demandes
- Approuver/refuser
- Historique complet

## 🎯 Cas d'Usage de la Démo

### Pour les Présentations Clients
- ✅ Pas besoin de connexion Internet (après le premier chargement)
- ✅ Données cohérentes et prévisibles
- ✅ Réponses ultra-rapides (pas de latence réseau)
- ✅ Pas de risque d'erreurs backend pendant la démo

### Pour le Développement
- ✅ Travail frontend sans backend
- ✅ Tests avec données contrôlées
- ✅ Pas besoin de setup backend complexe

### Pour la Formation
- ✅ Environnement sûr pour l'apprentissage
- ✅ Données réinitialisables
- ✅ Pas de risque de corruption de données

## 🔧 Configuration

### Mode Mock (Démo)
```env
VITE_USE_MOCK_API=true
```

### Mode Production (Backend Réel)
```env
VITE_USE_MOCK_API=false
VITE_API_URL=https://api.votre-domaine.com
```

## 📝 Scénarios de Démo Suggérés

### Scénario 1: Admin Organisation
1. Se connecter avec `admin@kuilinga.com` / `demo123`
2. Voir le dashboard avec métriques multi-organisations
3. Gérer les employés, sites, départements
4. Approuver des demandes de congé
5. Générer des rapports de présence

### Scénario 2: Manager
1. Se connecter avec `manager@kuilinga.com` / `demo123`
2. Voir la présence de l'équipe en temps réel
3. Consulter les taux de présence
4. Gérer les congés de l'équipe
5. Exporter les données d'équipe

### Scénario 3: Employé
1. Se connecter avec `employee@kuilinga.com` / `demo123`
2. Voir ses propres présences
3. Consulter le solde de congés
4. Soumettre une demande de congé
5. Voir l'historique personnel

## 🌐 Déploiement sur Vercel

Suivez le guide détaillé: [VERCEL_DEPLOY.md](VERCEL_DEPLOY.md)

**Résumé rapide**:
1. Connecter le repo GitHub à Vercel
2. Sélectionner la branche `demo/mock-data`
3. Ajouter variable `VITE_USE_MOCK_API=true`
4. Déployer!

**Temps estimé**: 5-10 minutes ⚡

## 📚 Documentation Complète

- **[MOCK_SYSTEM.md](MOCK_SYSTEM.md)**: Documentation technique complète du système de mock
- **[VERCEL_DEPLOY.md](VERCEL_DEPLOY.md)**: Guide de déploiement sur Vercel
- **[CLAUDE.md](CLAUDE.md)**: Documentation du projet (inclut section mock)

## ⚡ Performances

La démo mock est **ultra-rapide**:
- Pas d'appels réseau réels
- Données en mémoire locale
- Latence simulée: 200-500ms (configurable)
- Idéal pour les démos fluides

## 🐛 Support

### Problèmes Courants

**La démo ne charge pas?**
- Vérifiez que `VITE_USE_MOCK_API=true` dans `.env`
- Redémarrez le serveur dev
- Videz le cache du navigateur (Ctrl+Shift+R)

**Pas de données?**
- Ouvrez la console (F12)
- Cherchez `[MOCK] Mock interceptor enabled`
- Si absent, le mode mock n'est pas activé

**Données incorrectes?**
- Les données sont en mémoire et se réinitialisent au refresh
- C'est normal et voulu pour une démo cohérente

### Obtenir de l'Aide

- Issues GitHub: https://github.com/kjlinux/kuilinga-front/issues
- Documentation: Voir fichiers `*.md` dans le projet

## 🎉 Avantages du Système Mock

### Pour le Client
✅ Voir l'interface fonctionnelle immédiatement
✅ Tester tous les flux sans configuration
✅ Démo stable et prévisible
✅ Accessible 24/7 en ligne

### Pour l'Équipe
✅ Développement frontend indépendant
✅ Tests automatisés simplifiés
✅ Démos sans dépendance infrastructure
✅ Formation utilisateur facilitée

## 🔄 Mise à Jour des Données Mock

Les données mockées peuvent être modifiées dans:
```
src/mocks/data/
├── employees.mock.ts     # Modifier les employés
├── organizations.mock.ts # Modifier les organisations
├── attendance.mock.ts    # Modifier les présences
└── ... (autres entités)
```

Après modification:
```bash
git add src/mocks/data/
git commit -m "Update mock data"
git push origin demo/mock-data
# Vercel redéploie automatiquement!
```

---

## 🚀 Démarrage Rapide - En 30 Secondes

```bash
# 1. Clone & Install
git clone https://github.com/kjlinux/kuilinga-front.git
cd kuilinga-front
git checkout demo/mock-data
pnpm install

# 2. Activer le mode mock
echo "VITE_USE_MOCK_API=true" > .env

# 3. Lancer
pnpm run dev

# 4. Ouvrir http://localhost:3000
# 5. Se connecter: admin@kuilinga.com / demo123
```

**C'est tout!** 🎉

---

**Version**: 1.0.0
**Branche**: `demo/mock-data`
**Dernière mise à jour**: Novembre 2024
