-- both test users have the password "password"
INSERT INTO users (username, password, name, bio, email, is_admin, country, state, city, cityname)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User',
        'joel1@joelburton.com',
        FALSE,
        'US',
        'TX',
        '111668',
        'Austin'),
       ('testadmin',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Admin!',
        'joel2@joelburton.com',
        TRUE,
        'US',
        'TX',
        '111668',
        'Austin');
