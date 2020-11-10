create table accounts (
  id uuid,
  email text,
  first_name text,
  last_name text,
  password text,
  phone_number text,
  PRIMARY KEY (id, email)
);

create table apps ( 
  id text, 
  name text, 
  domain text, 
  removed boolean, 
  PRIMARY KEY (id)
  );