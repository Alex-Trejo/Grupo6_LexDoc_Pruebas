-- Tabla Account
CREATE TABLE Account (
    account_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'abogada', 'lector'))
);

-- Tabla Profile
CREATE TABLE Profile (
    profile_id SERIAL PRIMARY KEY,
    content TEXT,
    account_id INTEGER UNIQUE NOT NULL,
    CONSTRAINT fk_profile_account FOREIGN KEY(account_id) REFERENCES Account(account_id) ON DELETE CASCADE
);

-- Tabla Process
CREATE TABLE Process (
    process_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    type VARCHAR(100),
    offense VARCHAR(255),
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    denounced VARCHAR(150),
    denouncer VARCHAR(150),
    province VARCHAR(100),
    carton VARCHAR(100),
    account_id INTEGER NOT NULL,
    CONSTRAINT fk_process_account FOREIGN KEY(account_id) REFERENCES Account(account_id) ON DELETE CASCADE
);

-- Tabla Timeline
CREATE TABLE Timeline (
    timeline_id SERIAL PRIMARY KEY,
    number_events INTEGER DEFAULT 0,
    process_id INTEGER NOT NULL,
    CONSTRAINT fk_timeline_process FOREIGN KEY(process_id) REFERENCES Process(process_id) ON DELETE CASCADE
);

-- Tabla Event
CREATE TABLE Event (
    event_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    date TIMESTAMP NOT NULL,
    "order" INTEGER,
    timeline_id INTEGER NOT NULL,
    CONSTRAINT fk_event_timeline FOREIGN KEY(timeline_id) REFERENCES Timeline(timeline_id) ON DELETE CASCADE
);

-- Tabla Observation
CREATE TABLE Observation (
    observation_id SERIAL PRIMARY KEY,
    title VARCHAR(150),
    content TEXT,
    process_id INTEGER NOT NULL,
    CONSTRAINT fk_observation_process FOREIGN KEY(process_id) REFERENCES Process(process_id) ON DELETE CASCADE
);