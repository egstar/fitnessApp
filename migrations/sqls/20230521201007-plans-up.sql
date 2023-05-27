/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS plans(
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    pname VARCHAR(250) NOT NULL UNIQUE,
    duration BIGINT NOT NULL
);


INSERT INTO plans(pname,duration) VALUES
('Week', 7),
('Month', 30),
('3 Months', 90),
('6 Months', 180),
('Year', 365);