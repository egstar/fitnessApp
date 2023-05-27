/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS levels(
    id SERIAL PRIMARY KEY UNIQE NOT NULL,
    level VARCHAR(250) UNIQUE NOT NULL
);

INSERT INTO levels (level) VALUES
('Trainee'),
('Trainer'),
('Admin'),
('CEO');