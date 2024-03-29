CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

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
