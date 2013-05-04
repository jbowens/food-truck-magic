CREATE TABLE IF NOT EXISTS uploads (
    id SERIAL PRIMARY KEY,
    filesize INT NOT NULL,
    mime VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    ext VARCHAR(255) NOT NULL,
    dateUploaded timestamp with time zone,
    uploaderUserid INTEGER
);

CREATE TABLE IF NOT EXISTS trucks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    urlid VARCHAR(255) NOT NULL UNIQUE,
    twitterName VARCHAR(255),
    twitterid VARCHAR(255),
    phone VARCHAR(20),
    website VARCHAR(255),
    lastSeen timestamp with time zone,
    open boolean NOT NULL,
    geoPoint GEOGRAPHY(Point),
    textLoc VARCHAR(255),
    description VARCHAR(255),
    photoUploadid INTEGER REFERENCES uploads(id),
    menuUploadid INTEGER REFERENCES uploads(id),
    dateClose timestamp with time zone
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    pass CHAR(256) NOT NULL,
    email VARCHAR(255) NOT NULL,
    admin boolean DEFAULT false
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

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    urlid VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS classified_as (
    catid INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    truckid INTEGER NOT NULL REFERENCES trucks(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tweets (
	truckid INTEGER NOT NULL REFERENCES trucks(id) ON DELETE CASCADE,
	createdat BIGINT,
	data TEXT
);
