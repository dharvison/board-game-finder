-- both test users have the password "password"
INSERT INTO users (username, password, name, bio, email, is_admin, country, city)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User',
        'joel1@joelburton.com',
        FALSE,
        'USA',
        'HOUSTON'),
       ('testadmin',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Admin!',
        'joel2@joelburton.com',
        TRUE,
        'USA',
        'HOUSTON');
