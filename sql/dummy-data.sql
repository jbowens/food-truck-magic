-- Dummy trucks
INSERT INTO trucks (name, urlid, phone, website, open) VALUES('Papa Jim''s', 'papa-jims', '14015555555', 'http://papajims.com', false);

-- Dummy users
INSERT INTO users (name, pass, email) VALUES('papajim', '86f7e437faa5a7fce15d1ddcb9eaeaea377667b8', 'papajim@papajims.com');

-- Dummy vendors
INSERT INTO vendors (userid, truckid) VALUES(1, 1);

-- Dummy follows
INSERT INTO follows (userid, truckid) VALUES(1, 1);
