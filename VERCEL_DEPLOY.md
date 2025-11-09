# Déploiement sur Vercel - Mode Demo avec Mock Data

Ce guide explique comment déployer la branche `demo/mock-data` sur Vercel pour créer une démo fonctionnelle sans backend.

## Pourquoi deux déploiements?

- **Branche `main`**: Application production connectée au vrai backend API
- **Branche `demo/mock-data`**: Application de démonstration utilisant des données mockées (pas besoin de backend)

## Étapes de Déploiement

### 1. Connecter le Repository à Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer sur "Add New Project"
3. Importer votre repository GitHub: `kjlinux/kuilinga-front`
4. Vercel détectera automatiquement qu'il s'agit d'un projet Vite

### 2. Configurer le Déploiement de la Branche Demo

#### Option A: Créer un Nouveau Projet (Recommandé)

1. Dans Vercel, cliquez sur "Add New Project"
2. Sélectionnez le repository `kjlinux/kuilinga-front`
3. Dans "Configure Project":
   - **Project Name**: `kuilinga-demo` (ou un nom de votre choix)
   - **Framework Preset**: Vite (détecté automatiquement)
   - **Root Directory**: `./` (laisser par défaut)
   - **Build Command**: `pnpm run build` (ou `npm run build`)
   - **Output Directory**: `dist` (détecté automatiquement)

4. Dans "Git Configuration":
   - **Production Branch**: Changer de `main` à `demo/mock-data`

5. Dans "Environment Variables", ajouter:
   ```
   VITE_USE_MOCK_API = true
   VITE_API_URL = http://localhost:8000
   VITE_APP_NAME = KUILINGA
   VITE_APP_VERSION = 2.0.0
   ```

6. Cliquer sur "Deploy"

#### Option B: Ajouter une Branche au Projet Existant

Si vous avez déjà déployé la branche `main`:

1. Aller dans les settings du projet existant
2. Aller dans "Git" → "Production Branch"
3. Créer un nouveau projet séparé pour la démo (retour à l'Option A)

**Note**: Il est recommandé de créer deux projets Vercel séparés:
- Un pour `main` (production avec vrai backend)
- Un pour `demo/mock-data` (démo avec mock data)

### 3. Configuration Automatique

Vercel configurera automatiquement:
- ✅ Build command: `vite build`
- ✅ Output directory: `dist`
- ✅ Install command: `pnpm install` (ou `npm install`)
- ✅ Node.js version: 18.x ou plus récent

### 4. Déploiement

Une fois la configuration terminée:

1. Vercel déploiera automatiquement la branche `demo/mock-data`
2. Le build prendra environ 1-2 minutes
3. Vous recevrez une URL de déploiement (ex: `kuilinga-demo.vercel.app`)

### 5. Vérification

1. Visitez l'URL fournie par Vercel
2. Vous devriez voir la page de login
3. Connectez-vous avec les credentials demo:
   - Email: `admin@kuilinga.com`
   - Password: `demo123`

4. Vérifiez que les données s'affichent correctement
5. Ouvrez la console du navigateur, vous devriez voir:
   ```
   [MOCK] Mock interceptor enabled - All API requests will use mock data
   ```

### 6. Déploiements Automatiques

Vercel redéploiera automatiquement à chaque push sur la branche `demo/mock-data`:

```bash
# Sur votre machine locale
git checkout demo/mock-data
# ... faire des modifications ...
git add .
git commit -m "Update mock data"
git push origin demo/mock-data
# Vercel redéploie automatiquement!
```

## Domaines Personnalisés

### Ajouter un Domaine

1. Dans le projet Vercel, aller dans "Settings" → "Domains"
2. Ajouter votre domaine (ex: `demo.kuilinga.com`)
3. Suivre les instructions pour configurer les DNS
4. Vercel gérera automatiquement le HTTPS avec Let's Encrypt

### Structure Recommandée

- Production (main): `app.kuilinga.com` ou `kuilinga.com`
- Demo (mock-data): `demo.kuilinga.com`

## Variables d'Environnement

### Variables Requises pour la Demo

```env
VITE_USE_MOCK_API=true
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=KUILINGA
VITE_APP_VERSION=2.0.0
```

### Variables pour Production (branche main)

```env
VITE_USE_MOCK_API=false
VITE_API_URL=https://api.votre-domaine.com
VITE_APP_NAME=KUILINGA
VITE_APP_VERSION=2.0.0
```

## Comptes Demo Disponibles

Une fois déployé, utilisez ces comptes pour la démo:

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Super Admin | `superadmin@kuilinga.com` | `demo123` |
| Admin Organisation | `admin@kuilinga.com` | `demo123` |
| RH | `rh@kuilinga.com` | `demo123` |
| Manager | `manager@kuilinga.com` | `demo123` |
| Employé | `employee@kuilinga.com` | `demo123` |

**Note**: En mode mock, n'importe quel email/password fonctionne, mais ces comptes garantissent les bonnes permissions.

## Données Disponibles dans la Demo

La démo contient:

### Organisations (5)
- TechCorp
- InnovateLab
- GlobalServices
- DataTech Solutions
- CloudNet Systems

### Sites (15)
Répartis dans toute la France (Paris, Lyon, Marseille, Toulouse, etc.)

### Employés (30)
Avec noms français réalistes, départements, et rôles variés

### Présences (1000+)
Enregistrements sur les 30 derniers jours

### Appareils (15)
Lecteurs biométriques et badges dans différents états

### Congés (5)
Demandes avec différents statuts (en attente, approuvé, refusé)

### Dashboards
Données complètes pour les 4 types de tableaux de bord

## Troubleshooting

### Le build échoue

1. Vérifier que `pnpm` est bien configuré dans Vercel
2. Vérifier les variables d'environnement
3. Consulter les logs de build dans Vercel

### Les données mock ne s'affichent pas

1. Vérifier que `VITE_USE_MOCK_API=true` est bien défini
2. Ouvrir la console du navigateur pour voir les logs `[MOCK]`
3. Vider le cache du navigateur (Ctrl+Shift+R)

### Erreur 404 sur les routes

Vercel doit être configuré pour servir `index.html` pour toutes les routes:

1. Créer `vercel.json` à la racine du projet:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

2. Commit et push:
```bash
git add vercel.json
git commit -m "Add vercel.json for SPA routing"
git push origin demo/mock-data
```

## Performance

La démo avec mock data est **extrêmement rapide** car:
- ✅ Pas d'appels API réseau
- ✅ Données en mémoire locale
- ✅ Réponses quasi-instantanées (200-500ms simulé)
- ✅ Pas de dépendance backend

## Maintenance

### Mettre à jour les données mock

1. Éditer les fichiers dans `src/mocks/data/`
2. Commit et push sur `demo/mock-data`
3. Vercel redéploie automatiquement

### Ajouter de nouveaux endpoints

1. Créer le handler dans `src/mocks/data/`
2. Ajouter dans `src/mocks/handlers/index.ts`
3. Tester localement avec `pnpm run dev`
4. Push vers `demo/mock-data`

## Coûts

- **Vercel Free Tier**: Largement suffisant pour une démo
  - Bande passante: 100GB/mois
  - Builds: Illimités
  - Domaines: Illimités
  - HTTPS: Gratuit

- **Vercel Pro** (si nécessaire): $20/mois
  - Meilleure performance
  - Plus de bande passante
  - Support prioritaire

## Support

Pour toute question:
- Documentation: [MOCK_SYSTEM.md](MOCK_SYSTEM.md)
- Vercel Docs: https://vercel.com/docs
- Issues GitHub: https://github.com/kjlinux/kuilinga-front/issues

---

**Résumé Rapide**:
1. Connecter le repo à Vercel
2. Créer nouveau projet `kuilinga-demo`
3. Sélectionner branche `demo/mock-data`
4. Ajouter `VITE_USE_MOCK_API=true`
5. Déployer!
6. Se connecter avec `admin@kuilinga.com` / `demo123`

**Temps estimé**: 5-10 minutes ⚡
