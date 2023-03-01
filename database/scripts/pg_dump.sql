CREATE USER medapp;
CREATE DATABASE medapp;

GRANT ALL PRIVILEGES ON DATABASE medapp TO medapp;


CREATE USER medapp_e2e_test;
CREATE DATABASE medapp_e2e_test;

GRANT ALL PRIVILEGES ON DATABASE medapp_e2e_test TO medapp_e2e_test;