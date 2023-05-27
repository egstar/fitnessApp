/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS user_plans(
    pid SERIAL PRIMARY KEY UNIQUE NOT NULL,
    uid BIGINT NOT NULL,
    pstart TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_DATE,
    pduration BIGINT NOT NULL
    pname VARCHAR(250) NOT NULL DEFAULT 'NEW'
);

create function createplans(userid INT, planname TEXT, planstart TIMESTAMP WITH TIME ZONE, planduration INT)
    RETURNS INT
    LANGUAGE plpgsql
    AS
    $FN$
        DECLARE v_ids INT;
        DECLARE v_dates INT;
        DECLARE planid BIGINT;
        DECLARE v_uid INT = userid;
        DECLARE v_pstart timestamp = planstart;
        DECLARE v_pduration INT = planduration;
        DECLARE v_pname VARCHAR(250) = planname;
        BEGIN
            INSERT INTO user_plans(uid,pstart,pduration,pname) VALUES ((SELECT v_uid), (SELECT v_pstart), (SELECT v_pduration), (SELECT v_pname)) RETURNING pid INTO planid;
            FOR x in 1..(SELECT COUNT(id) from tasks) LOOP
                v_ids := x;
                FOR i in 0..((SELECT pduration from user_plans where pid=planid) - 1) LOOP
                    v_dates := i;
                    EXECUTE $$ INSERT INTO user_plan_tasks VALUES($1,$2, $3, ($4 + ($5 * interval '1 day'))::timestamp, 0) RETURNING * $$ USING v_uid, planid,v_ids,v_pstart, v_dates;
                END LOOP;
            END LOOP;
            RETURN planid;
        END;
    $FN$;


CREATE OR REPLACE FUNCTION cpWithTasks(userid INT, planname TEXT, planstart TIMESTAMP WITH TIME ZONE, planduration INT, plantasks INT[])
    RETURNS INT
    LANGUAGE plpgsql
    AS
    $FN$
        DECLARE v_ids INT;
        DECLARE v_dates INT;
        DECLARE planid BIGINT;
        DECLARE v_uid INT = userid;
        DECLARE v_pstart timestamp = planstart;
        DECLARE v_pduration INT = planduration;
        DECLARE v_pname VARCHAR(250) = planname;
        DECLARE v_id INT[] = plantasks;
        
        BEGIN
            INSERT INTO user_plans(uid,pstart,pduration,pname) VALUES ((SELECT v_uid), (SELECT v_pstart), (SELECT v_pduration), (SELECT v_pname)) RETURNING pid INTO planid;
            FOREACH v_ids in ARRAY (SELECT v_id) LOOP
                FOR i in 0..((SELECT pduration from user_plans where pid=planid) - 1) LOOP
                    v_dates := i;
                    EXECUTE $$ INSERT INTO user_plan_tasks VALUES($1,$2, $3, ($4 + ($5 * interval '1 day'))::timestamp, 0) RETURNING * $$ USING v_uid, planid,v_ids,v_pstart, v_dates;
                END LOOP;
            END LOOP;
            RETURN planid;
        END;
    $FN$;