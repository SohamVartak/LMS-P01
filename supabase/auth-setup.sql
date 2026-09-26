create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'STUDENT' check (role in ('STUDENT','AUTHOR','ADMIN')),
  student_id text,
  department text,
  year text,
  email text not null default '',
  approval_status text not null default 'APPROVED' check (approval_status in ('PENDING','APPROVED','REJECTED')),
  approval_note text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.profiles add column if not exists email text not null default '';
alter table public.profiles add column if not exists approval_status text not null default 'APPROVED';
alter table public.profiles add column if not exists approval_note text;
update public.profiles set email = coalesce(email, '') where email is null;
update public.profiles set approval_status = 'APPROVED' where approval_status is null;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
on public.profiles for select to authenticated
using (auth.uid() = id);

drop policy if exists "Admins can update profiles" on public.profiles;
create policy "Admins can update profiles"
on public.profiles for update to authenticated
using (public.current_app_role() = 'ADMIN')
with check (public.current_app_role() = 'ADMIN');

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
declare requested_role text;
begin
  requested_role := upper(coalesce(new.raw_user_meta_data ->> 'role','STUDENT'));
  if requested_role not in ('STUDENT','AUTHOR') then requested_role := 'STUDENT'; end if;
  insert into public.profiles(id,full_name,role,student_id,department,year,email,approval_status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name',''),
    requested_role,
    new.raw_user_meta_data ->> 'student_id',
    new.raw_user_meta_data ->> 'department',
    new.raw_user_meta_data ->> 'year',
    coalesce(new.email,''),
    case when requested_role = 'STUDENT' then 'PENDING' else 'APPROVED' end
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
