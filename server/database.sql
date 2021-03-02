DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS reset_codes;
DROP TABLE IF EXISTS userrelations;
DROP TABLE IF EXISTS chatmessages;
 
 CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     first VARCHAR(255) NOT NULL CHECK (first != ''),
     last VARCHAR(255) NOT NULL CHECK (last != ''),
     email VARCHAR(255) NOT NULL UNIQUE CHECK (email != ''),
     password VARCHAR(255) NOT NULL CHECK (password != ''),
     profile_pic_url VARCHAR,
     bio VARCHAR,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE reset_codes(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR NOT NULL,
    code VARCHAR NOT NULL,
    code_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE userrelations(
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id) NOT NULL,
    receiver_id INT REFERENCES users(id) NOT NULL,
    accepted BOOLEAN DEFAULT false,
    relation_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 

 CREATE TABLE chatmessages (
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id) NOT NULL,
    chatmessage VARCHAR,
    message_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );