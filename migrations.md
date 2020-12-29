USE projecta;

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
  account_id uuid, 
  PRIMARY KEY (id)
  );

CREATE TABLE statistics (
  id uuid,
  time timestamp,
  location text,
  scheme text,
  screen text,
  user_id text,
  tid text,
  timestamp int,
  title text,
  user_agent text,
  viewport text,
  PRIMARY KEY ((location), id)
);

CREATE TABLE count_by_device (
  domain text,
  day date,
  tid text,
  desktop_count counter,
  mobile_count counter,
  PRIMARY KEY (tid, day, domain)
);

CREATE TABLE unique_user_by_domain (
  domain text,
  tid text,
  user_id text,
  PRIMARY KEY (tid, domain, user_id)
);

CREATE TABLE unique_user_by_day (
  domain text,
  tid text,
  day date,
  user_id text,
  PRIMARY KEY (tid, day, domain, user_id)
);

CREATE TABLE count_by_referrer (
  domain text,
  day date,
  tid text,
  referrer text,
  count counter,
  PRIMARY KEY (tid, day, referrer, domain)
);

CREATE TABLE request_count_by_day (
  domain text,
  day date,
  tid text,
  count counter,
  PRIMARY KEY (tid, day, domain)
);

CREATE TABLE unique_user_by_hour (
  domain text,
  day date,
  hour int,
  tid text,
  user_id text,
  PRIMARY KEY (tid, day, domain, hour, user_id)
);

CREATE TABLE request_count_by_hour (
  domain text,
  day date,
  hour int,
  tid text,
  count counter,
  PRIMARY KEY (tid, day, hour, domain)
);

CREATE TABLE count_referrer_by_hour (
  domain text,
  day date,
  hour int,
  tid text,
  referrer text,
  count counter,
  PRIMARY KEY (tid, day, hour, referrer, domain)
);

CREATE TABLE count_device_by_hour (
  domain text,
  day date,
  hour int,
  tid text,
  desktop_count counter,
  mobile_count counter,
  PRIMARY KEY (tid, day, hour, domain)
);

CREATE TABLE unique_user_online (
  tid text,
  domain text,
  timestamp timestamp,
  date date,
  user_id text,
  PRIMARY KEY((date), tid, domain, user_id)
);
 ALTER TABLE count_device_by_hour ADD tablet_count counter;

 ALTER TABLE count_by_device ADD tablet_count counter;

CREATE TABLE count_page_by_hour (
  domain text,
  day date,
  hour int,
  path text,
  tid text,
  count counter,
  PRIMARY KEY (tid, day, domain, path, hour)
);

CREATE TABLE count_by_pages (
  domain text,
  day date,
  path text,
  tid text,
  count counter,
  PRIMARY KEY (tid, day, domain, path)
); 