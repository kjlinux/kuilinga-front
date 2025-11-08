# Guide de Test - Améliorations d'Authentification

## Tests Rapides à Effectuer

### 1. Test de Login/Logout ⏱️ 2 min

```bash
# Démarrer le serveur de développement
pnpm dev  # ou npm run dev
```

**Actions:**
1. Aller sur http://localhost:3000
2. Se connecter avec des credentials valides
3. ✅ Vérifier: Toast vert "Connexion réussie - Bienvenue {nom} !"
4. Cliquer sur bouton de déconnexion
5. ✅ Vérifier: Toast bleu "Déconnexion réussie - À bientôt !"
6. Essayer de se connecter avec un mauvais mot de passe
7. ✅ Vérifier: Toast rouge "Erreur de connexion"

---

### 2. Test de Refresh Token Automatique ⏱️ 3-5 min

**Prérequis:** Backend configuré avec `access_token` expirant rapidement (ex: 1-2 minutes)

**Actions:**
1. Se connecter
2. Attendre l'expiration du access_token (1-2 min)
3. Naviguer vers une page nécessitant des données API (ex: /employees)
4. ✅ Vérifier dans DevTools Network:
   - Requête initiale retourne 401
   - Appel automatique à `/api/v1/auth/refresh`
   - Requête initiale est rejouée et réussit
5. ✅ Vérifier: Toast bleu "Session actualisée"

---

### 3. Test de Session Expirée ⏱️ 1 min

**Actions:**
1. Se connecter
2. Ouvrir DevTools → Application → Local Storage
3. Supprimer manuellement `access_token` et `refresh_token`
4. Essayer de naviguer vers une page protégée
5. ✅ Vérifier: Toast orange "Session expirée - Veuillez vous reconnecter"
6. ✅ Vérifier: Redirection automatique vers /login

---

### 4. Test Multi-Onglets ⏱️ 2 min

**Actions:**
1. Ouvrir deux onglets sur http://localhost:3000
2. Se connecter dans les deux onglets
3. Dans l'onglet 1: Se déconnecter
4. ✅ Vérifier dans l'onglet 2:
   - Toast bleu "Déconnexion détectée - Vous avez été déconnecté dans un autre onglet"
   - Redirection automatique vers /login

---

### 5. Test Race Condition (Technique) ⏱️ 3 min

**Prérequis:** Token expiré

**Actions:**
1. Ouvrir DevTools → Network → Throttling → Slow 3G
2. Se connecter et attendre expiration du access_token
3. Ouvrir plusieurs pages rapidement (Employees, Organizations, Sites, etc.)
4. ✅ Vérifier dans Network tab:
   - Plusieurs requêtes retournent 401
   - **UN SEUL** appel à `/api/v1/auth/refresh` (pas de duplicatas)
   - Toutes les requêtes originales sont rejouées et réussissent
5. Désactiver le throttling

---

### 6. Test Backend Logout ⏱️ 2 min

**Prérequis:** Backend avec endpoint `/api/v1/auth/logout` implémenté

**Actions:**
1. Se connecter
2. Ouvrir DevTools → Network
3. Cliquer sur déconnexion
4. ✅ Vérifier dans Network:
   - Appel POST à `/api/v1/auth/logout`
   - Payload: `{ "refresh_token": "..." }`
5. ✅ Vérifier côté backend: Le refresh_token est bien invalidé

---

## Tests Automatisés (Optionnel)

### Configuration Jest/Vitest

```bash
# Installer les dépendances de test si nécessaire
pnpm add -D @testing-library/react @testing-library/jest-dom vitest
```

### Example de Test Unitaire

```typescript
// src/services/__tests__/api.service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiService } from '../api.service'
import axios from 'axios'

vi.mock('axios')

describe('ApiService - Token Refresh', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should use shared promise for concurrent refresh', async () => {
    // Setup: expired token scenario
    localStorage.setItem('refresh_token', 'valid_refresh_token')

    const mockRefreshResponse = { data: { access_token: 'new_access_token' } }
    vi.mocked(axios.post).mockResolvedValueOnce(mockRefreshResponse)

    // Simulate 3 concurrent 401 errors
    const promise1 = apiService.get('/endpoint1').catch(() => {})
    const promise2 = apiService.get('/endpoint2').catch(() => {})
    const promise3 = apiService.get('/endpoint3').catch(() => {})

    await Promise.all([promise1, promise2, promise3])

    // Verify: Only 1 refresh call was made
    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/auth/refresh'),
      expect.objectContaining({ refresh_token: 'valid_refresh_token' }),
      expect.any(Object)
    )
  })
})
```

### Example de Test d'Intégration

```typescript
// src/contexts/__tests__/AuthContext.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider } from '../AuthContext'
import { BrowserRouter } from 'react-router-dom'

describe('AuthContext - Multi-Tab Sync', () => {
  it('should logout when storage event is received', async () => {
    const { rerender } = render(
      <BrowserRouter>
        <AuthProvider>
          <div>Test Component</div>
        </AuthProvider>
      </BrowserRouter>
    )

    // Simulate login
    localStorage.setItem('access_token', 'test_token')

    // Simulate storage event from another tab
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'access_token',
        oldValue: 'test_token',
        newValue: null,
        storageArea: localStorage
      })
    )

    await waitFor(() => {
      expect(localStorage.getItem('access_token')).toBeNull()
    })

    // Should show toast notification (verify via DOM)
    expect(screen.queryByText(/déconnexion détectée/i)).toBeInTheDocument()
  })
})
```

---

## Checklist de Validation Finale

### Fonctionnalités
- [ ] Login affiche toast de succès avec nom utilisateur
- [ ] Login échoué affiche toast d'erreur
- [ ] Logout affiche toast et redirige
- [ ] Refresh automatique fonctionne et affiche toast
- [ ] Session expirée affiche toast et redirige
- [ ] Multi-tab logout synchronise correctement
- [ ] Backend logout endpoint est appelé

### Performance
- [ ] Un seul appel /refresh lors de requêtes concurrentes
- [ ] Pas de rechargement complet de page lors des redirections
- [ ] Toasts s'affichent et disparaissent correctement

### Sécurité
- [ ] Tokens sont bien supprimés du localStorage au logout
- [ ] Backend invalide le refresh_token au logout
- [ ] Pas de fuite de données sensibles dans les logs

### UX
- [ ] Messages de toast sont clairs et en français
- [ ] Transitions sont fluides
- [ ] Pas d'erreur dans la console

---

## Debugging

### Problèmes Courants

**Toast ne s'affiche pas:**
```bash
# Vérifier que les styles sont chargés
grep -A 5 "toast-container" src/index.css
```

**Refresh en boucle:**
```javascript
// Dans DevTools Console:
localStorage.getItem('access_token')  // Vérifier que le token est bien mis à jour
localStorage.getItem('refresh_token')  // Vérifier la présence du refresh token
```

**Multi-tab ne fonctionne pas:**
```javascript
// Tester manuellement dans Console:
window.dispatchEvent(new StorageEvent('storage', {
  key: 'access_token',
  newValue: null
}))
```

### Logs Utiles

```javascript
// Activer les logs détaillés (temporairement)
// Dans api.service.ts, ajouter:
console.log('[API] Token refresh started')
console.log('[API] New access token:', access_token)
console.log('[API] Callback triggered:', this.onTokenRefreshed ? 'yes' : 'no')
```

---

## Performance Monitoring

### Vérifier les Appels API

```javascript
// Dans DevTools Console, filtrer les requêtes:
performance.getEntriesByType('resource')
  .filter(r => r.name.includes('/api/v1/auth/refresh'))
  .forEach(r => console.log(`Refresh call at: ${r.startTime}ms`))
```

### Mesurer le Temps de Refresh

```javascript
// Ajouter temporairement dans api.service.ts:
const startTime = performance.now()
const access_token = await this.refreshPromise
console.log(`Token refresh took: ${performance.now() - startTime}ms`)
```

---

## Conclusion

Temps total estimé pour tous les tests: **15-20 minutes**

Si tous les tests passent, l'intégration API et le système d'authentification sont **entièrement fonctionnels** ! 🎉
