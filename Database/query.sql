CREATE DATABASE userLogin;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    isVerified BOOLEAN DEFAULT false,
    hashedpassword VARCHAR(120) NOT NULL,
    salt VARCHAR(20) NOT NULL,
    appRole VARCHAR(10) DEFAULT 'worker',
    resetPasswordLink TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE projects (
    pid SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    useremail VARCHAR(50) REFERENCES users(email),
    adminemail VARCHAR(50) REFERENCES users(email),
    date VARCHAR(90)
);

CREATE TABLE tasks (
    tid SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    description TEXT,
    assignto VARCHAR(50) REFERENCES users(email),
    date VARCHAR(50),
    priority VARCHAR(20),
    projectname TEXT,
    status VARCHAR(20)
);