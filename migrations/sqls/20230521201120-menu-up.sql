/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS menu(
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    opt VARCHAR(250) UNIQUE NOT NULL,
    url VARCHAR(250) UNIQUE NOT NULL,
    logo VARCHAR(250) NOT NULL DEFAULT 'BsIcons.BsFan',
    sub jsonb,
    level INT NOT NULL DEFAULT 1
);

INSERT INTO menu (opt,url,logo, sub,level) VALUES 
('Dashboard', 'home', 'FaIcons.FaGripHorizontal', null, 1),
('Today tasks', 'today', 'BsIcons.BsFan', null, 1),
('My Scheduel', 'tasks', 'BsIcons.BsListStars', null, 1),
('Settings', 'settings', 'BsIcons.BsFillGearFill', null, 1),
('Support', 'support', 'FaIcons.FaEnvelope', null, 1),
('Admin', 'admin', 'FaIcons.FaRegLifeRing', '[{"id":1,"sub": "Users","tree": "admin#users","level": 4},{"id":2,"sub": "PLans","tree": "admin#plans","level": 3},{"id":3,"sub": "Tasks","tree": "admin#tasks","level": 3},{"id":4,"sub": "Menu","tree": "admin#Menu","level": 4},{"id":5,"sub": "Support Tickets","tree": "admin#support","level": 3}]', 3);