-- LMS core database schema
-- Run this once in Supabase SQL Editor after auth-setup.sql.

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  isbn text unique,
  title text not null,
  author_name text not null,
  author_id uuid references auth.users(id) on delete set null,
  category text,
  description text default '',
  publication_year integer,
  publisher text,
  total_copies integer not null default 1 check (total_copies >= 0),
  available_copies integer not null default 1 check (available_copies >= 0 and available_copies <= total_copies),
  shelf_location text,
  shelf_id text,
  condition text not null default 'Good',
  condition_notes text,
  approval_status text not null default 'APPROVED'
    check (approval_status in ('PENDING','APPROVED','REJECTED')),
  rejection_reason text,
  pdf_path text,
  ai_summary text,
  ai_status text not null default 'PENDING'
    check (ai_status in ('PENDING','PROCESSING','COMPLETED','FAILED')),
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.borrow_records (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete restrict,
  student_id uuid not null references auth.users(id) on delete cascade,
  issue_date date not null default current_date,
  due_date date,
  return_date date,
  status text not null default 'BORROWED'
    check (status in ('BORROWED','RETURNED','RESERVED','OVERDUE')),
  created_at timestamptz not null default now()
);

-- Migration-safe additions for an existing LMS database.
-- CREATE TABLE IF NOT EXISTS does not add new columns to an already-created books table.
alter table public.books add column if not exists approval_status text not null default 'APPROVED';
alter table public.books add column if not exists rejection_reason text;
alter table public.books add column if not exists pdf_path text;
alter table public.books add column if not exists ai_summary text;
alter table public.books add column if not exists ai_status text not null default 'PENDING';
alter table public.books add column if not exists submitted_at timestamptz not null default now();
alter table public.books add column if not exists cover_url text;
alter table public.books add column if not exists approval_status text not null default 'APPROVED' check (approval_status in ('PENDING','APPROVED','REJECTED'));
alter table public.books add column if not exists rejection_reason text;
alter table public.books add column if not exists ai_status text not null default 'PENDING';
alter table public.books add column if not exists submitted_at timestamptz not null default now();
alter table public.books add column if not exists pdf_path text;
alter table public.profiles add column if not exists approval_status text not null default 'APPROVED' check (approval_status in ('PENDING','APPROVED','REJECTED'));
alter table public.profiles add column if not exists approval_note text;

alter table public.books add column if not exists online_rating numeric(2,1);
alter table public.books add column if not exists online_rating_count integer not null default 0;
alter table public.books add column if not exists online_rating_source text;
alter table public.books add column if not exists condition_set_by uuid references auth.users(id) on delete set null;
alter table public.books add column if not exists condition_set_at timestamptz;

create table if not exists public.book_student_ratings (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  rating numeric(2,1) not null check (rating >= 1 and rating <= 5),
  review text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(book_id, student_id)
);

create index if not exists book_student_ratings_book_idx on public.book_student_ratings(book_id);
create index if not exists book_student_ratings_student_idx on public.book_student_ratings(student_id);

create or replace view public.book_rating_summary as
select
  book_id,
  round(avg(rating), 1) as student_rating,
  count(*)::integer as student_rating_count
from public.book_student_ratings
group by book_id;

alter table public.book_student_ratings enable row level security;

drop policy if exists "Students can view book ratings" on public.book_student_ratings;
create policy "Students can view book ratings"
on public.book_student_ratings for select to authenticated
using (true);

drop policy if exists "Students can rate books" on public.book_student_ratings;
create policy "Students can rate books"
on public.book_student_ratings for insert to authenticated
with check (
  public.current_app_role() = 'STUDENT'
  and student_id = auth.uid()
);

drop policy if exists "Students can update their ratings" on public.book_student_ratings;
create policy "Students can update their ratings"
on public.book_student_ratings for update to authenticated
using (student_id = auth.uid() and public.current_app_role() = 'STUDENT')
with check (student_id = auth.uid() and public.current_app_role() = 'STUDENT');

drop policy if exists "Students can delete their ratings" on public.book_student_ratings;
create policy "Students can delete their ratings"
on public.book_student_ratings for delete to authenticated
using (student_id = auth.uid() and public.current_app_role() = 'STUDENT');

create or replace function public.set_book_condition(
  p_book_id uuid,
  p_condition text,
  p_notes text default ''
)
returns public.books
language plpgsql
security definer
set search_path = public
as $
declare
  result public.books;
begin
  if public.current_app_role() <> 'AUTHOR' then
    raise exception 'Only an author can set book condition';
  end if;

  if not exists (
    select 1 from public.books
    where id = p_book_id and author_id = auth.uid()
  ) then
    raise exception 'You can only set condition for your own books';
  end if;

  if p_condition not in ('Excellent','Good','Needs Attention','Damaged') then
    raise exception 'Invalid book condition';
  end if;

  update public.books
  set condition = p_condition,
      condition_notes = coalesce(p_notes, ''),
      condition_set_by = auth.uid(),
      condition_set_at = now(),
      updated_at = now()
  where id = p_book_id
  returning * into result;

  return result;
end;
$;

revoke all on function public.set_book_condition(uuid,text,text) from public;
grant execute on function public.set_book_condition(uuid,text,text) to authenticated;


do $
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'books_approval_status_check'
      and conrelid = 'public.books'::regclass
  ) then
    alter table public.books
      add constraint books_approval_status_check
      check (approval_status in ('PENDING','APPROVED','REJECTED'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'books_ai_status_check'
      and conrelid = 'public.books'::regclass
  ) then
    alter table public.books
      add constraint books_ai_status_check
      check (ai_status in ('PENDING','PROCESSING','COMPLETED','FAILED'));
  end if;
end $;

-- Private PDF storage used for author submissions.
insert into storage.buckets (id, name, public)
values ('author-book-pdfs', 'author-book-pdfs', false)
on conflict (id) do update set public = false;

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'system',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists books_title_idx on public.books using gin (to_tsvector('english', title));
create index if not exists books_author_idx on public.books(author_name);
create index if not exists books_approval_idx on public.books(approval_status);
create index if not exists borrow_student_idx on public.borrow_records(student_id);
create index if not exists borrow_book_idx on public.borrow_records(book_id);
create index if not exists notifications_user_idx on public.notifications(user_id);

create table if not exists public.reading_list (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, book_id)
);

create index if not exists reading_list_book_idx on public.reading_list(book_id);
create index if not exists reading_list_user_idx on public.reading_list(user_id);

alter table public.books enable row level security;
alter table public.borrow_records enable row level security;
alter table public.notifications enable row level security;
alter table public.reading_list enable row level security;

-- Helper: authenticated user's application role.
create or replace function public.current_app_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ADMIN PROFILE VISIBILITY
drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
on public.profiles for select to authenticated
using (public.current_app_role() = 'ADMIN');

drop policy if exists "Students can cancel their reservations" on public.borrow_records;
create policy "Students can cancel their reservations"
on public.borrow_records for delete to authenticated
using (
  student_id = auth.uid()
  and status = 'RESERVED'
  and public.current_app_role() = 'STUDENT'
);

-- BOOKS
drop policy if exists "Authenticated users can view books" on public.books;
create policy "Authenticated users can view books"
on public.books for select to authenticated
using (
  approval_status = 'APPROVED'
  or public.current_app_role() = 'ADMIN'
  or (public.current_app_role() = 'AUTHOR' and author_id = auth.uid())
);

drop policy if exists "Admins can manage books" on public.books;
create policy "Admins can manage books"
on public.books for all to authenticated
using (public.current_app_role() = 'ADMIN')
with check (public.current_app_role() = 'ADMIN');

drop policy if exists "Authors can create books" on public.books;
create policy "Authors can create books"
on public.books for insert to authenticated
with check (
  public.current_app_role() = 'AUTHOR'
  and author_id = auth.uid()
  and approval_status = 'PENDING'
);

drop policy if exists "Authors can update their books" on public.books;
create policy "Authors can update their books"
on public.books for update to authenticated
using (
  public.current_app_role() = 'AUTHOR'
  and author_id = auth.uid()
)
with check (
  public.current_app_role() = 'AUTHOR'
  and author_id = auth.uid()
);

-- Only administrators can approve/reject submissions and change approval metadata.
drop policy if exists "Admins can review book submissions" on public.books;
create policy "Admins can review book submissions"
on public.books for update to authenticated
using (public.current_app_role() = 'ADMIN')
with check (public.current_app_role() = 'ADMIN');

-- Authors may update only their own pending submissions.
drop policy if exists "Authors can update their books" on public.books;
create policy "Authors can update their books"
on public.books for update to authenticated
using (public.current_app_role() = 'AUTHOR' and author_id = auth.uid() and approval_status = 'PENDING')
with check (public.current_app_role() = 'AUTHOR' and author_id = auth.uid() and approval_status = 'PENDING');

-- Admin deletion is separate so catalogue removal is explicitly protected.
drop policy if exists "Admins can delete books" on public.books;
create policy "Admins can delete books"
on public.books for delete to authenticated
using (public.current_app_role() = 'ADMIN');

-- BORROW RECORDS
drop policy if exists "Students can view their borrow records" on public.borrow_records;
create policy "Students can view their borrow records"
on public.borrow_records for select to authenticated
using (
  student_id = auth.uid()
  and public.current_app_role() = 'STUDENT'
);

drop policy if exists "Admins can manage borrow records" on public.borrow_records;
create policy "Admins can manage borrow records"
on public.borrow_records for all to authenticated
using (public.current_app_role() = 'ADMIN')
with check (public.current_app_role() = 'ADMIN');

-- Students can submit a reservation/request. Actual issue/return should be
-- performed by an administrator through the admin workflow.
drop policy if exists "Students can create borrow requests" on public.borrow_records;
create policy "Students can create borrow requests"
on public.borrow_records for insert to authenticated
with check (
  public.current_app_role() = 'STUDENT'
  and student_id = auth.uid()
  and status = 'RESERVED'
);

-- READING LIST

drop policy if exists "Users can view their reading list" on public.reading_list;
create policy "Users can view their reading list"
on public.reading_list for select to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can manage their reading list" on public.reading_list;
create policy "Users can manage their reading list"
on public.reading_list for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Authors can see aggregate rows for their own books so their dashboard can show reading-list counts.
drop policy if exists "Authors can view reading list counts" on public.reading_list;
create policy "Authors can view reading list counts"
on public.reading_list for select to authenticated
using (
  public.current_app_role() = 'AUTHOR'
  and exists (select 1 from public.books b where b.id = reading_list.book_id and b.author_id = auth.uid())
);

-- AUTHORS CAN VIEW CIRCULATION HISTORY FOR THEIR OWN BOOKS

drop policy if exists "Authors can view circulation for their books" on public.borrow_records;
create policy "Authors can view circulation for their books"
on public.borrow_records for select to authenticated
using (
  public.current_app_role() = 'AUTHOR'
  and exists (select 1 from public.books b where b.id = borrow_records.book_id and b.author_id = auth.uid())
);

-- PRIVATE AUTHOR PDF STORAGE
drop policy if exists "Authors can upload their PDFs" on storage.objects;
create policy "Authors can upload their PDFs"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'author-book-pdfs'
  and public.current_app_role() = 'AUTHOR'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Authors can view their PDFs" on storage.objects;
create policy "Authors can view their PDFs"
on storage.objects for select to authenticated
using (
  bucket_id = 'author-book-pdfs'
  and (
    public.current_app_role() = 'ADMIN'
    or ((storage.foldername(name))[1] = auth.uid()::text)
  )
);

drop policy if exists "Admins can manage author PDFs" on storage.objects;
create policy "Admins can manage author PDFs"
on storage.objects for all to authenticated
using (bucket_id = 'author-book-pdfs' and public.current_app_role() = 'ADMIN')
with check (bucket_id = 'author-book-pdfs' and public.current_app_role() = 'ADMIN');

-- NOTIFICATIONS
drop policy if exists "Users can view their notifications" on public.notifications;
create policy "Users can view their notifications"
on public.notifications for select to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can update their notifications" on public.notifications;
create policy "Users can update their notifications"
on public.notifications for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Admins can manage notifications" on public.notifications;
create policy "Admins can manage notifications"
on public.notifications for all to authenticated
using (public.current_app_role() = 'ADMIN')
with check (public.current_app_role() = 'ADMIN');

-- Keep updated_at current when an existing book changes.
create or replace function public.set_books_updated_at()
returns trigger language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists books_updated_at on public.books;
create trigger books_updated_at
before update on public.books
for each row execute procedure public.set_books_updated_at();


-- LIVE LIBRARY PRESENCE
create table if not exists public.library_presence (
  user_id uuid primary key references auth.users(id) on delete cascade,
  table_number text,
  activity text not null default 'Personal Work',
  status text not null default 'IN_LIBRARY' check (status in ('IN_LIBRARY','LEFT')),
  updated_at timestamptz not null default now()
);

alter table public.library_presence enable row level security;

drop policy if exists "Students can manage their presence" on public.library_presence;
create policy "Students can manage their presence"
on public.library_presence for all to authenticated
using (user_id = auth.uid() and public.current_app_role() = 'STUDENT')
with check (user_id = auth.uid() and public.current_app_role() = 'STUDENT');

drop policy if exists "Admins can view library presence" on public.library_presence;
create policy "Admins can view library presence"
on public.library_presence for select to authenticated
using (public.current_app_role() = 'ADMIN');

create index if not exists library_presence_status_idx on public.library_presence(status);
