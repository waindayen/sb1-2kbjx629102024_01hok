# Guide détaillé - Application de Gestion de Passeports

## 1. Prérequis

```bash
npm create vite@latest passport-app -- --template react-ts
cd passport-app
npm install @supabase/supabase-js react-hot-toast lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 2. Configuration Supabase

1. Créer un compte sur Supabase
2. Créer un nouveau projet
3. Dans SQL Editor, exécuter:

```sql
-- Table des passeports
create table public.passports (
    id uuid default gen_random_uuid() primary key,
    first_name text not null,
    last_name text not null,
    date_of_birth date not null,
    nationality text not null,
    passport_number text not null unique,
    issue_date date not null,
    expiry_date date not null,
    photo text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Bucket pour les photos
insert into storage.buckets (id, name, public) 
values ('passport-photos', 'passport-photos', true);

-- Politique d'accès au stockage
create policy "Public Access" 
on storage.objects for all 
using (bucket_id = 'passport-photos');
```

## 3. Structure du projet

```
src/
├── components/
│   ├── PassportForm.tsx    # Formulaire d'enregistrement
│   ├── PassportList.tsx    # Liste des passeports
│   └── Navigation.tsx      # Navigation
├── lib/
│   └── supabase.ts        # Client Supabase
└── types/
    └── passport.ts        # Types TypeScript
```

## 4. Fonctionnalités principales

### Formulaire d'enregistrement
- Validation des champs obligatoires
- Upload de photo avec preview
- Vérification des numéros de passeport uniques
- Messages d'erreur et de succès
- Réinitialisation après soumission

### Liste des passeports
- Affichage en tableau avec pagination
- Recherche en temps réel
- Actions: voir, modifier, supprimer
- Modales de détails et modification
- Confirmation de suppression

### Navigation
- Basculement entre formulaire et liste
- Interface responsive
- Indicateur de vue active

## 5. Styles et UI

- Utilisation de Tailwind CSS
- Design moderne et professionnel
- Composants réactifs
- Animations de chargement
- Messages toast pour le feedback

## 6. Validation et sécurité

- Validation côté client
- Vérification des doublons
- Gestion sécurisée des fichiers
- Messages d'erreur explicites
- Protection contre les soumissions multiples

## 7. Bonnes pratiques

- Types TypeScript stricts
- Gestion d'état optimisée
- Composants modulaires
- Gestion des erreurs robuste
- Code commenté et maintenable

## 8. Déploiement

1. Configurer les variables d'environnement:
```env
VITE_SUPABASE_URL=votre_url
VITE_SUPABASE_ANON_KEY=votre_cle
```

2. Builder l'application:
```bash
npm run build
```

3. Déployer sur votre plateforme préférée

## 9. Maintenance

- Vérifier régulièrement les mises à jour des dépendances
- Surveiller l'espace de stockage Supabase
- Maintenir les politiques de sécurité
- Sauvegarder la base de données
- Monitorer les performances