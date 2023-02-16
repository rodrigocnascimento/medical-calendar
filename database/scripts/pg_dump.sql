	CREATE USER docker;
    CREATE DATABASE pebmed_medapp;
    GRANT ALL PRIVILEGES ON DATABASE pebmed_medapp TO docker;

    CREATE TYPE public.genre AS enum ('M', 'F');

    CREATE TABLE public.pacient (
        id int NULL,
        "name" varchar(255) NULL,
        phone varchar(15) NULL,
        dob date NULL,
        email varchar(64) NULL,
        height decimal(9, 2) NULL,
        weight decimal(9, 2) NULL,
        genre public.genre,
        created_at timestamp null,
        CONSTRAINT pacient_pk PRIMARY KEY (id)
    );

    CREATE TABLE public.medical_appointments (
        id int NOT NULL,
        pacient_id int NULL,
        doctor_id int NOT NULL,
        "date" timestamp NOT NULL,
        created_at timestamp NOT null,
        CONSTRAINT medical_appointments_pk PRIMARY KEY (id),
        CONSTRAINT medical_appointments_fk FOREIGN KEY (pacient_id) REFERENCES public.pacient(id) ON DELETE SET NULL
    );

    CREATE TABLE public.medical_registry (
        id int NOT NULL,
        appointment_id int NOT NULL,
        observation text NOT NULL,
        create_at timestamp NULL,
        CONSTRAINT medical_registry_pk PRIMARY KEY (id),
        CONSTRAINT medical_registry_fk FOREIGN KEY (id) REFERENCES public.medical_appointments(id)
    );