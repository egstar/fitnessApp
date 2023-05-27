/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS menu(
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    opt VARCHAR(250) UNIQUE NOT NULL,
    url VARCHAR(250) UNIQUE NOT NULL,
    logo VARCHAR(250) NOT NULL DEFAULT 'BsIcons.BsFan',
    sub text[],
    level INT(2) NOT NULL DEFAULT 1
);

INSERT INTO menu (opt,url,logo, sub,level) VALUES 
('Dashboard', 'home', 'FaIcons.FaGripHorizontal', ARRAY[], 1),
('Today tasks', 'today', 'BsIcons.BsFan', ARRAY[], 1),
('My Scheduel', 'tasks', 'BsIcons.BsListStars', ARRAY[], 1),
('Settings', 'settings', 'BsIcons.BsFillGearFill', ARRAY[], 1),
('Support', 'support', 'FaIcons.FaEnvelope', ARRAY[], 1);
('Admin', 'admin', 'FaIcons.FaRegLifeRing', ARRAY['{sub: "Users",tree: "admin/users",level: 4}','{sub: "PLans",tree: "admin/plans",level: 3}','{sub: "Tasks",tree: "admin/tasks",level: 3}','{sub: "Menu",tree: "admin/Menu",level: 4}'], 3);