create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'STUDENT' check (role in ('STUDENT','AUTHOR','ADMIN')),
  student_id text,
  department text,
  year text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
on public.profiles for select to authenticated
using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
declare requested_role text;
begin
  requested_role := upper(coalesce(new.raw_user_meta_data ->> 'role','STUDENT'));
  if requested_role not in ('STUDENT','AUTHOR') then requested_role := 'STUDENT'; end if;
  insert into public.profiles(id,full_name,role,student_id,department,year)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name',''),
    requested_role,
    new.raw_user_meta_data ->> 'student_id',
    new.raw_user_meta_data ->> 'department',
    new.raw_user_meta_data ->> 'year'
  ) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users for each row
execute procedure public.handle_new_user();

-- Create an administrator in Supabase Authentication first.
-- Then run:
-- update public.profiles set role='ADMIN' where id='AUTH_USER_UUID';
