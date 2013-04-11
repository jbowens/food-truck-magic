CREATE TABLE IF NOT EXISTS uploads (
    id SERIAL PRIMARY KEY,
    filesize INT NOT NULL,
    mime VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    dateUploaded timestamp without time zone
);

CREATE TABLE IF NOT EXISTS trucks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    urlid VARCHAR(255) NOT NULL UNIQUE,
    twitterName VARCHAR(255),
    twitterid BIGINT,
    phone VARCHAR(20),
    website VARCHAR(255),
    lastSeen timestamp without time zone,
    open boolean NOT NULL,
    geoPoint GEOGRAPHY(Point),
    textLoc VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    pass CHAR(256) NOT NULL,
    email VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS vendors (
    userid INTEGER NOT NULL REFERENCES users(id),
    truckid INTEGER NOT NULL REFERENCES trucks(id)
);

CREATE TABLE IF NOT EXISTS follows (
    userid INTEGER NOT NULL REFERENCES users(id),
    truckid INTEGER NOT NULL REFERENCES trucks(id)
);
