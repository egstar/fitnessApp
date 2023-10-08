/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS user_levels(
    uid BIGINT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    lid BIGINT NOT NULL REFERENCES levels(id) ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO user_levels values((SELECT id FROM users WHERE uname='Support'),4);