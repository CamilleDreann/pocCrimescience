# OSINT Desktop — Proof of Concept Crimescience

Application web de recherche OSINT (Open Source Intelligence) présentée sous la forme d'un environnement de bureau inspiré de Linux. Ce projet est un **Proof of Concept** développé dans le cadre du BUT3, permettant de rechercher l'empreinte numérique d'une personne à partir de son adresse email.

## Fonctionnalités

### Recherche OSINT
- Recherche de profils sur les réseaux sociaux (Instagram, LinkedIn, Twitter, Facebook, GitHub, Discord, TikTok, Snapchat) à partir d'une adresse email
- Affichage des résultats sous forme de cartes par plateforme avec nom d'utilisateur, bio et lien vers le profil
- Suggestions d'emails de démonstration pour tester rapidement

### Interface OS
- **Bureau** avec icônes, panneau supérieur et menu contextuel (clic droit)
- **Fenêtres** déplaçables et redimensionnables avec minimisation/maximisation
- **Lanceur d'applications** avec recherche intégrée
- **Barre système** avec horloge, indicateurs Wi-Fi, Bluetooth, volume et luminosité
- **Notifications** type toast avec historique

### Applications intégrées
| Application | Description |
|---|---|
| **OSINT Search** | Recherche d'empreinte numérique par email |
| **Terminal** | Émulateur de terminal bash avec commandes simulées (`ls`, `cat`, `neofetch`…) |
| **Gestionnaire de fichiers** | Explorateur de fichiers virtuel avec navigation par dossiers |
| **Éditeur de texte** | Éditeur multi-onglets avec numérotation des lignes |
| **Paramètres** | Réseau, son, affichage, Bluetooth, informations système |

## Stack technique

- **Frontend** : React 19, CSS Modules, Vite
- **Backend** : Fastify (Node.js)
- **État** : Context API avec pattern reducer
- **Données** : Fichier JSON de démonstration (`api/data/users.json`)

## Installation

```bash
# Installer les dépendances
yarn install

# Lancer le serveur API (port 3001)
node api/server.js

# Lancer le frontend (port 5173)
yarn dev
```

## Architecture

```
src/
├── apps/               # Applications du bureau (OSINT, Terminal, FileManager…)
├── components/
│   ├── os/             # Composants système (Desktop, Window, TopPanel…)
│   └── ui/             # Composants réutilisables (Button, Input, Toggle…)
├── context/            # État global (OSContext, useOS)
├── data/               # Registre des applications, système de fichiers virtuel
├── hooks/              # Hooks personnalisés (useDrag, useResize)
└── styles/             # Tokens CSS, reset, animations
api/
├── server.js           # Serveur Fastify
└── data/users.json     # Données de démonstration
```
