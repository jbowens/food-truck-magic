-- Dummy trucks
INSERT INTO trucks (name, urlid, phone, open) VALUES('Papa Jim''s', 'papa-jims', '14015555555', false);

-- Dummy users
INSERT INTO users (name, pass, email) VALUES('papajim', 'bestkoreanfoodeva', 'papajim@papajims.com');

-- Dummy vendors
INSERT INTO vendors (userid, truckid) VALUES(1, 1);

-- Dummy follows
INSERT INTO follows (userid, truckid) VALUES(1, 1);
