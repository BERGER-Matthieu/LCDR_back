# Changelog

## [1.2.0] - 2026-08-20
### Added
- Endpoint `/api/health` pour la supervision de disponibilité (vérification de la connexion MongoDB).
- Endpoint `/api/metrics` exposant les métriques Prometheus (nombre de requêtes, durée des requêtes par route).
- Déploiement d'une stack de supervision LGTM (Prometheus, Loki, Promtail, Grafana, cAdvisor, mongodb-exporter).
- Dashboard Grafana avec panels : requêtes/s, latence P95, erreurs 5xx, statut MongoDB, usage CPU/RAM.
- Règles d'alerte Grafana (disponibilité de l'API, taux d'erreurs 5xx, saturation des connexions MongoDB, charge CPU) avec notification Discord.
- Fichier `dependabot.yml` pour la veille automatisée des dépendances.
- Route `/api/debug` réactivée pour test contrôlé du processus de détection/traitement d'anomalie.
- Templates GitHub (issues, configuration du dépôt).

### Fixed
- Correction de la propagation des hooks de métriques Elysia (`.as("global")`) : les métriques ne remontaient que pour la route `/metrics` elle-même, pas pour les routes métier.
- Correction du ratio de saturation des connexions MongoDB dans les alertes Grafana (ordre de division inversé, `available/current` au lieu de `current/available`).
- Correction du comportement "No Data" de la règle d'alerte 5xx, interprété à tort comme "Firing" en l'absence d'erreurs.

### Changed
- Mise à jour de `mongoose` (9.8.0 → 9.9.3).
- Mise à jour de `@sentry/elysia` (10.67.0 → 10.70.0).
- Externalisation des identifiants sensibles (mot de passe Grafana) via variables d'environnement (`.env`).

## [1.1.0] - 2026-07-20
### Added
- Intégration de Sentry pour la capture des erreurs applicatives et logs structurés.
- Route de test `/api/debug` pour la validation de la remontée d'erreurs Sentry (désactivée par défaut après tests).
- Pipeline CI/CD via GitHub Actions : tests automatisés (collection Bruno) et déploiement sur serveur Ubuntu via runner local.
- Containerisation complète (Dockerfile, docker-compose).
- Documentation OpenAPI pour l'ensemble des routes (User, Community, Book, Post, Comment).

## [1.0.0] - 2026-06-30
### Added
- Endpoints CRUD complets pour les entités User, Community, Book, Post, Comment.
- Authentification JWT (inscription, connexion).
- Gestion d'erreurs harmonisée sur les routes utilisateur.
- Pagination sur la récupération des utilisateurs (limite max 50).
- Recherche de livre par nom.