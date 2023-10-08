/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS ticket_messages(
    id SERIAL PRIMARY KEY UNIQUE,
    ticket_id BIGINT NOT NULL REFERENCES support(id) ON UPDATE CASCADE ON DELETE CASCADE,
    message TEXT NOT NULL,
    sender VARCHAR(250) NOT NULL,
    tdate TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    readstatus BOOLEAN DEFAULT false,
    adminread BOOLEAN DEFAULT false
);