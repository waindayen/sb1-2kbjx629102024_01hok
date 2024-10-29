-- Create prices table
create table public.prices (
    id text primary key,
    product text not null,
    unit_amount integer not null,
    currency text not null,
    type text not null,
    interval text,
    interval_count integer,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create subscriptions table
create table public.subscriptions (
    id text primary key,
    user_id uuid references auth.users not null,
    status text not null,
    price_id text references public.prices not null,
    current_period_start timestamp with time zone not null,
    current_period_end timestamp with time zone not null,
    cancel_at_period_end boolean not null default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create payment_methods table
create table public.payment_methods (
    id text primary key,
    user_id uuid references auth.users not null,
    brand text not null,
    last4 text not null,
    exp_month integer not null,
    exp_year integer not null,
    is_default boolean not null default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create payments table
create table public.payments (
    id text primary key,
    user_id uuid references auth.users not null,
    amount integer not null,
    currency text not null,
    status text not null,
    payment_method_id text references public.payment_methods,
    subscription_id text references public.subscriptions,
    invoice_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.prices enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payment_methods enable row level security;
alter table public.payments enable row level security;

-- Create policies
create policy "Enable read access for authenticated users" on public.prices
    for select
    using (auth.role() = 'authenticated');

create policy "Enable read access for own subscriptions" on public.subscriptions
    for select
    using (auth.uid() = user_id);

create policy "Enable read access for own payment methods" on public.payment_methods
    for select
    using (auth.uid() = user_id);

create policy "Enable read access for own payments" on public.payments
    for select
    using (auth.uid() = user_id);

-- Create indexes
create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_subscriptions_status on public.subscriptions(status);
create index idx_payment_methods_user_id on public.payment_methods(user_id);
create index idx_payments_user_id on public.payments(user_id);
create index idx_payments_subscription_id on public.payments(subscription_id);