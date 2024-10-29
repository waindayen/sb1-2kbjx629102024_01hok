-- Create PayPal settings table
create table public.paypal_settings (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    email text not null,
    connected boolean default false,
    merchant_id text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique (user_id)
);

-- Enable RLS
alter table public.paypal_settings enable row level security;

-- Create policy
create policy "Users can manage their own PayPal settings"
    on public.paypal_settings
    for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Create index
create index idx_paypal_settings_user_id on public.paypal_settings(user_id);