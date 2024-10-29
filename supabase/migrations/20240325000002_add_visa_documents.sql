-- Add documents column to visas table
alter table public.visas
add column documents jsonb default '[]'::jsonb;

-- Create a new storage bucket for visa documents
insert into storage.buckets (id, name, public)
values ('visa-documents', 'visa-documents', true);

-- Create policy for visa documents
create policy "Public Access"
on storage.objects for all
using (bucket_id = 'visa-documents');