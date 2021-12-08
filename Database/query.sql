CREATE DATABASE userLogin;

CREATE TABLE users(
    id INT NOT NULL AUTO_INCREMENT,
    fullname VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    isVerified BOOLEAN DEFAULT 0,
    hashedpassword VARCHAR(120) NOT NULL,
    salt VARCHAR(20) NOT NULL,
    appRole VARCHAR(10) DEFAULT 'worker',
    resetPassworLink LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);


CREATE TABLE projects(
    pid INT NOT NULL AUTO_INCREMENT,
    title TEXT(200) NOT NULL,
    description LONGTEXT,
    Useremail VARCHAR(50) REFERENCES users(email),
    Adminemail VARCHAR(50) REFERENCES users(email),
    date VARCHAR(90),
    PRIMARY KEY (pid)
)

CREATE TABLE tasks(
    tid INT NOT NULL AUTO_INCREMENT,
    title TEXT(50) NOT NULL,
    description LONGTEXT,
    assignto VARCHAR(50)REFERENCES users(email),
    date VARCHAR(50),
    priority VARCHAR(20),
    projectname LONGTEXT,
    status VARCHAR(20),
    PRIMARY KEY (tid)
)