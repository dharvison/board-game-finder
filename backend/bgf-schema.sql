CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE
    CHECK (position('@' IN email) > 1),
  username VARCHAR(25) UNIQUE,
  password TEXT NOT NULL,
  name TEXT,
  bio TEXT,
  country TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  cityname TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    from_user INTEGER NOT NULL
      REFERENCES users(id),
    to_user INTEGER NOT NULL
      REFERENCES users(id),
    date TIMESTAMP NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL
);

-- Game Lists

CREATE TABLE games (
  bgg_id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  designer TEXT,
  cover_url TEXT,
  year INTEGER
);

CREATE TABLE gamelists (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL
    REFERENCES users(id),
  title TEXT NOT NULL,
  blurb TEXT
);

CREATE TABLE gamelist_games (
    gamelist_id INTEGER NOT NULL
      REFERENCES gamelists(id),
    game_id INTEGER NOT NULL
      REFERENCES games(bgg_id)
);

-- Game Notes

CREATE TABLE gamenotes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL
    REFERENCES users(id),
  game_id INTEGER NOT NULL
    REFERENCES games(bgg_id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  own BOOLEAN,
  want_to_play BOOLEAN
);

-- CREATE TABLE user_gamenotes (
--     user_id INTEGER NOT NULL
--       REFERENCES users(id),
--     gamenote_id INTEGER NOT NULL
--       REFERENCES gamenotes(id)
-- );
