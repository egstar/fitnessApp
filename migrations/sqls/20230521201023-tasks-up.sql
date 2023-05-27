/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS tasks(
    id SERIAL PRIMARY KEY NOT NULL UNIQUE,
    tname VARCHAR(250) UNIQUE NOT NULL,
    dsc TEXT NOT NULL
);

INSERT INTO tasks (tname,dsc) VALUES 
('Teeth Brush (AM)','Brush your teeth before 10AM'),
('Teeth brush (PM)','Brush your teeth in the evening'),
('Stretching','Do your daily stretching practice'),
('Nutrition','Watch your nutrition'),
('Face skin care','Treat your face skin with lotion'),
('Power drinks','Dont drink more than one RedBull'),
('Water drinks','Drink at least 1.5L of unsweetened drinks'),
('Muscles training','Train your muscles in the gym'),
('Body skin care','Treat your body with lipolotion'),
('Hands care','Treat your hands with hand lotion');