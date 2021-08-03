CREATE DATABASE movielist;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

INSERT INTO users (email, password) VALUES ('bob@gmail.com','bob'), ('tom@gmail.com','tom');


CREATE TABLE movie_saves(
  id BIGSERIAL PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id),
  imdb_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  year VARCHAR(255) NOT NULL,
  poster VARCHAR(255) NOT NULL,
  plot VARCHAR(255) NOT NULL,
  genre VARCHAR(255) NOT NULL
);

insert into movie_saves (user_id, imdb_id, title, year, poster) values ('a2d4e1d8-b5d2-4864-8c24-42440d0fda2a', '123', 'inception', '2020', 'www.abc.com');