-- Create Stripe configuration table
create table public.stripe_config (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    publishable_key text,
    secret_key text,
    webhook_secret text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique (user_id)
);

-- Enable RLS
alter table public.stripe_config enable row level security;

-- Create policy
create policy "Users can manage their own Stripe config"
    on public.stripe_config
    for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Create index
create index idx_stripe_config_user_id on public.stripe_config(user_id);