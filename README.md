# Guide d'intégration Supabase

## 1. Configuration initiale

```bash
# Installation des dépendances
npm install @supabase/supabase-js
```

## 2. Configuration Supabase

1. Créer un compte sur [Supabase](https://supabase.com)
2. Créer un nouveau projet
3. Copier les clés d'API depuis Project Settings > API

## 3. Variables d'environnement (.env)
```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_anon
```

## 4. Migration SQL

```sql
-- Create the passports table
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
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.passports enable row level security;

-- Create storage bucket
insert into storage.buckets (id, name, public) 
values ('passport-photos', 'passport-photos', true);

-- Storage policy
create policy "Public Access" on storage.objects for all using (
    bucket_id = 'passport-photos'
);

-- Auto-update timestamp
create function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger handle_updated_at
    before update on public.passports
    for each row
    execute function public.handle_updated_at();

-- Indexes
create index idx_passports_passport_number on public.passports(passport_number);
create index idx_passports_last_name on public.passports(last_name);
create index idx_passports_created_at on public.passports(created_at);
```

## 5. Structure des fichiers

```
src/
├── lib/
│   └── supabase.ts       # Client Supabase
├── components/
│   ├── PassportForm.tsx  # Formulaire
│   └── PassportList.tsx  # Liste
└── types/
    └── passport.ts       # Types
```

## 6. Implémentation

Suivez les fichiers fournis pour l'implémentation complète.

## 7. Fonctionnalités principales

- Création de passeports avec validation
- Liste avec recherche
- Visualisation détaillée
- Modification
- Suppression
- Gestion des photos
- Validation des numéros uniques
- Gestion des erreurs

## 8. Bonnes pratiques

- Validation côté client et serveur
- Gestion optimisée des images
- Indexes pour les performances
- Sécurité avec RLS
- Timestamps automatiques