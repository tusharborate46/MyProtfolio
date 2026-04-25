-- Run this in Supabase SQL editor
create table if not exists profile (
  id int primary key,
  name text not null,
  headline text,
  about text,
  created_at timestamptz default now()
);

create table if not exists skills (
  id bigint generated always as identity primary key,
  name text not null,
  created_at timestamptz default now()
);

create table if not exists projects (
  id bigint generated always as identity primary key,
  title text not null,
  tech_stack text,
  summary text,
  url text,
  created_at timestamptz default now()
);

create table if not exists contacts (
  id bigint generated always as identity primary key,
  label text not null,
  value text not null,
  created_at timestamptz default now()
);

insert into profile (id, name, headline, about)
values (1, 'Your Name', 'Full Stack Developer', 'Write your profile summary here.')
on conflict (id) do nothing;

insert into contacts (label, value)
values ('Email', 'you@example.com'), ('GitHub', 'github.com/your-username')
on conflict do nothing;
