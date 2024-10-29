-- Create visas table
create table public.visas (
    id uuid default gen_random_uuid() primary key,
    passport_id uuid references public.passports(id) on delete cascade,
    visa_number text not null unique,
    country text not null,
    visa_type text not null,
    issue_date date not null,
    expiry_date date not null,
    status text not null default 'active',
    notes text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Enable RLS
alter table public.visas enable row level security;

-- Create indexes
create index idx_visas_passport_id on public.visas(passport_id);
create index idx_visas_visa_number on public.visas(visa_number);
create index idx_visas_status on public.visas(status);

-- Create trigger for updated_at
create trigger handle_visa_updated_at
    before update on public.visas
    for each row
    execute function public.handle_updated_at();

-- Create policy
create policy "Enable all operations for visas"
    on public.visas
    for all
    using (true)
    with check (true);