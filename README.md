# Application Web de Gestion des Absences des Étudiants

Application Full-Stack de gestion administrative académique développée avec **Laravel 12**, **React 19** et **MySQL**.

---

## Sprints développés

| Sprint | Module | Statut |
|--------|--------|--------|
| Sprint 1 | CRUD Département | ✅ Terminé |
| Sprint 2 | CRUD Filière | ✅ Terminé |

---

## Stack technique

| Côté | Technologie |
|------|-------------|
| Frontend | React 19 + Vite 8, Tailwind CSS 3, React Router DOM 6, Axios, Lucide React |
| Backend | Laravel 12, PHP, Laravel Sanctum (tokens API) |
| Base de données | MySQL |

---

## Prérequis

- PHP >= 8.2
- Composer
- Node.js >= 18 + npm
- MySQL >= 8.0
- Un serveur MySQL actif (XAMPP, WAMP, Laragon, etc.)

---

## Installation et lancement

### 1. Cloner ou décompresser le projet

```
gestion-absences/
├── backend/    ← Laravel
├── frontend/   ← React + Vite
└── postman_collection.json
```

---

### 2. Configuration de la base de données

Créez la base de données MySQL :

```sql
CREATE DATABASE gestion_absences CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### 3. Configuration du Backend (Laravel)

```bash
cd backend
```

**a) Installer les dépendances PHP :**
```bash
composer install
```

**b) Configurer l'environnement :**
```bash
copy .env.example .env
php artisan key:generate
```

**c) Modifier `.env` avec vos paramètres MySQL :**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gestion_absences
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe
```

**d) Exécuter les migrations :**
```bash
php artisan migrate
```

**e) Insérer les données de démonstration :**
```bash
php artisan db:seed
```

> Les seeders créent : 1 compte admin, 5 départements et 11 filières de démonstration.

**f) Démarrer le serveur Laravel :**
```bash
php artisan serve --host=127.0.0.1 --port=8000
```

> Le backend est accessible sur : **http://127.0.0.1:8000**

---

### 4. Configuration du Frontend (React)

```bash
cd frontend
```

**a) Installer les dépendances :**
```bash
npm install
```

**b) Démarrer le serveur de développement :**
```bash
npm run dev
```

> Le frontend est accessible sur : **http://localhost:5173**

---

## Identifiants de connexion

| Champ | Valeur |
|-------|--------|
| Email | `admin@gestion-absences.ma` |
| Mot de passe | `Admin@1234` |

---

## Structure du projet

### Backend (Laravel)
```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/
│   │   │   ├── AuthController.php
│   │   │   ├── DashboardController.php
│   │   │   ├── DepartementController.php
│   │   │   └── FiliereController.php
│   │   └── Requests/
│   │       ├── StoreDepartementRequest.php
│   │       ├── UpdateDepartementRequest.php
│   │       ├── StoreFiliereRequest.php
│   │       └── UpdateFiliereRequest.php
│   └── Models/
│       ├── Departement.php
│       ├── Filiere.php
│       └── User.php
├── database/
│   ├── migrations/
│   └── seeders/
│       ├── AdminSeeder.php
│       ├── DepartementSeeder.php
│       └── FiliereSeeder.php
└── routes/
    └── api.php
```

### Frontend (React)
```
frontend/src/
├── components/
│   ├── departements/
│   │   ├── DepartementForm.jsx
│   │   └── DepartementDetail.jsx
│   ├── filieres/
│   │   ├── FiliereForm.jsx
│   │   └── FiliereDetail.jsx
│   ├── layout/
│   │   ├── AppLayout.jsx
│   │   ├── Header.jsx
│   │   └── Sidebar.jsx
│   └── ui/
│       ├── ConfirmDialog.jsx
│       ├── EmptyState.jsx
│       ├── Modal.jsx
│       ├── NotificationContainer.jsx
│       ├── Pagination.jsx
│       └── Spinner.jsx
├── contexts/
│   ├── AuthContext.jsx
│   └── NotificationContext.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── DepartementsPage.jsx
│   └── FilieresPage.jsx
├── routes/
│   └── AppRouter.jsx
└── services/
    ├── api.js
    ├── authService.js
    ├── dashboardService.js
    ├── departementService.js
    └── filiereService.js
```

---

## Endpoints API

### Authentification
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/login` | Connexion |
| POST | `/api/logout` | Déconnexion |
| GET  | `/api/me` | Profil utilisateur |

### Dashboard
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/dashboard/stats` | Statistiques |

### Départements
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/departements` | Liste paginée (+ search) |
| POST | `/api/departements` | Créer |
| GET | `/api/departements/{id}` | Consulter |
| PUT | `/api/departements/{id}` | Modifier |
| DELETE | `/api/departements/{id}` | Supprimer |
| GET | `/api/departements-list` | Liste simple (pour sélect) |

### Filières
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/filieres` | Liste paginée (+ search + filtre dept) |
| POST | `/api/filieres` | Créer |
| GET | `/api/filieres/{id}` | Consulter |
| PUT | `/api/filieres/{id}` | Modifier |
| DELETE | `/api/filieres/{id}` | Supprimer |

---

## Tests Postman

Importez `postman_collection.json` dans Postman :

1. Ouvrir Postman → **Import**
2. Sélectionner `postman_collection.json`
3. Exécuter **Login** en premier pour obtenir le token (automatiquement stocké)
4. Tester les autres requêtes

---

## Fonctionnalités implémentées

### Sprint 1 — CRUD Département
- [x] Lister les départements avec pagination
- [x] Recherche dynamique
- [x] Créer un département (validation nom unique)
- [x] Modifier un département
- [x] Consulter les détails d'un département
- [x] Supprimer un département (bloqué si des filières y sont rattachées)
- [x] Compteur de filières par département

### Sprint 2 — CRUD Filière
- [x] Lister les filières avec pagination
- [x] Recherche dynamique
- [x] Filtre par département
- [x] Créer une filière (code unique, département obligatoire)
- [x] Modifier une filière (changement de département possible)
- [x] Consulter les détails d'une filière
- [x] Supprimer une filière
- [x] Affichage du nom du département dans le tableau

### Fonctionnalités transversales
- [x] Authentification sécurisée (Laravel Sanctum)
- [x] Protection de toutes les routes API
- [x] Tableau de bord avec statistiques réelles
- [x] Interface responsive (mobile/desktop)
- [x] Notifications de succès/erreur
- [x] Boîtes de confirmation avant suppression
- [x] Gestion des erreurs réseau

---

## Palette de couleurs

| Couleur | Hex | Usage |
|---------|-----|-------|
| Bleu principal | `#5FA8D3` | Boutons, icônes |
| Bleu clair | `#CAE9FF` | Fonds secondaires |
| Bleu marine | `#1B4965` | Sidebar, titres |
| Turquoise | `#62B6CB` | Accents, actifs |
| Turquoise pastel | `#BEE9E8` | Badges, indicateurs |

---

## Notes importantes

- Les données des seeders sont des **données de démonstration** — ne pas utiliser comme données réelles.
- Pour réinitialiser la BDD : `php artisan migrate:fresh --seed`
- Les mots de passe ne sont jamais exposés dans le frontend.
- La suppression d'un département est bloquée si des filières y sont rattachées.
