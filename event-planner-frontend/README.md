# Event Planner - Frontend Angular 16

## Installation

### 1. Créer un projet Angular (si pas déjà fait)
```bash
ng new event-planner-frontend --routing --style=css
cd event-planner-frontend
```

### 2. Copier les fichiers du ZIP dans le projet
Remplacez les fichiers générés par ng new avec ceux du ZIP.

### 3. Installer les dépendances
```bash
npm install @angular/material@^16.2.14 @angular/cdk@^16.2.14 @angular/animations@^16.1.0 @angular/fire@^7.6.1 firebase@^9.0.0 ng2-charts@^4.0.1 chart.js --legacy-peer-deps
```

### 4. Lancer le projet
```bash
ng serve
```
L'application sera disponible sur `http://localhost:4200`

## Configuration
Le backend doit tourner sur `http://localhost:8000`
Fichier de config: `src/app/environment.ts`

## Comptes de test
- Admin: `admin@eventplanner.com` / `password`
- User:  `user@eventplanner.com` / `password`

## Structure
```
src/
├── Models/              Interfaces TypeScript
├── Services/            Services HTTP
└── app/
    ├── guards/          AuthGuard, AdminGuard
    ├── interceptors/    TokenInterceptor (Bearer)
    ├── login/           Page login (glass morphism)
    ├── register/        Page inscription
    ├── template/        Layout sidenav
    ├── dashboard/       Stats + Charts (ng2-charts)
    ├── event/           Liste événements + CRUD
    ├── event-create/    Modal créer/modifier
    ├── event-details/   Modal détails + inscription
    ├── category/        Admin - Gestion catégories
    ├── category-form/   Modal catégorie
    ├── my-registrations/ Mes inscriptions (user)
    └── confirm/         Dialog confirmation suppression
```
