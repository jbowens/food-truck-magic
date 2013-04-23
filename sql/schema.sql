CREATE TABLE IF NOT EXISTS uploads (
    id SERIAL PRIMARY KEY,
    filesize INT NOT NULL,
    mime VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    ext VARCHAR(255) NOT NULL,
    dateUploaded timestamp without time zone,
    uploaderUserid INTEGER
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
    textLoc VARCHAR(255),
    description VARCHAR(255),
    photoUploadid INTEGER REFERENCES uploads(id),
    dateClose timestamp without time zone
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    pass CHAR(256) NOT NULL,
    email VARCHAR(255) NOT NULL
);

ALTER TABLE uploads ADD CONSTRAINT uploaderfk FOREIGN KEY (uploaderUserid) REFERENCES users(id) MATCH SIMPLE ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS vendors (
    userid INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    truckid INTEGER NOT NULL REFERENCES trucks(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS follows (
    userid INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    truckid INTEGER NOT NULL REFERENCES trucks(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS photos (
    truckid INTEGER NOT NULL REFERENCES trucks(id) ON DELETE CASCADE,
    uploadid INTEGER NOT NULL REFERENCES uploads(id) ON DELETE CASCADE,
    description TEXT
);
