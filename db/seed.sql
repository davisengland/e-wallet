DROP TABLE IF EXISTS profile, worth, income, expenses, budget, bills;

CREATE TABLE profile(
  sub_id VARCHAR(255) PRIMARY KEY
);

CREATE TABLE worth(
  worth_id SERIAL
  sub_id VARCHAR(255) UNIQUE REFERENCES profile(sub_id),
  amount INT,
  date DATE,
  time TIME
);

CREATE TABLE income(
  inc_id SERIAL
  sub_id VARCHAR(255) REFERENCES profile(sub_id),
  amount INT,
  date DATE,
  time TIME
);

CREATE TABLE expenses(
  exp_id SERIAL
  sub_id VARCHAR(255) REFERENCES profile(sub_id),
  amount INT,
  month Int,
  category VARCHAR(255)
  date VARCHAR(255)
);

CREATE TABLE budget(
  sub_id VARCHAR(255) REFERENCES profile(sub_id),
  amount INT,
  category VARCHAR(255)
);

CREATE TABLE bills(
  sub_id VARCHAR(255) REFERENCES profile(sub_id),
  amount INT,
  date DATE,
  category VARCHAR(255),
  description VARCHAR(255)
);

