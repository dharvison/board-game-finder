\echo 'Delete and recreate boardgames db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE boardgames;
CREATE DATABASE boardgames;
\connect boardgames

\i bgf-schema.sql
\i bgf-seed.sql


-- \echo 'Delete and recreate boardgames_test db?'
-- \prompt 'Return for yes or control-C to cancel > ' foo

-- DROP DATABASE boardgames_test;
-- CREATE DATABASE boardgames_test;
-- \connect boardgames_test

-- \i bgf-schema.sql
