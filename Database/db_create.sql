<<<<<<< HEAD
CREATE TABLE user_info(
  id NUMBER PRIMARY KEY,
	userName VARCHAR2(50) UNIQUE,
	password VARCHAR2(200) NOT NULL,
=======
CREATE TABLE USER_INFO(
  id NUMBER PRIMARY KEY,
	userName VARCHAR2(50) UNIQUE,
	password VARCHAR2(200) NOT NULL,
	name VARCHAR2(20),
>>>>>>> refs/heads/backend-user
	email VARCHAR2(100),
	role VARCHAR2(20) NOT NULL,
  profile VARCHAR2(300),
  regdate DATE,
  provider VARCHAR2(20) NOT NULL,
  providerid VARCHAR2(50)
);

CREATE SEQUENCE user_info_seq
START WITH 1
INCREMENT BY 1;

-- SET LINESIZE 200;
-- COLUMN userName FORMAT A30;
-- COLUMN password FORMAT A40;
<<<<<<< HEAD
-- COLUMN email FORMAT A20;
-- COLUMN role FORMAT A10;
-- COLUMN profile FORMAT A20;
-- COLUMN regdate FORMAT A10;
-- COLUMN provider FORMAT A10;
-- COLUMN providerid FORMAT A10;

CREATE TABLE MEMBERINFO (
  member_num NUMBER PRIMARY KEY,
  trainer_num NUMBER,
  member_height NUMBER(5,2),
  member_weight NUMBER(5,2),
  member_gender VARCHAR2(100),
=======
-- COLUMN name FORMAT A10;
-- COLUMN email FORMAT A20;
-- COLUMN role FORMAT A10;
-- COLUMN profile FORMAT A20;
-- COLUMN regdate FORMAT A10;
-- COLUMN provider FORMAT A10;
-- COLUMN providerid FORMAT A10;

CREATE TABLE MEMBER_INFO (
  member_num NUMBER PRIMARY KEY,
  trainer_num NUMBER,
  member_height NUMBER(5,2),
  member_weight NUMBER(5,2),
  member_gender VARCHAR2(10),
>>>>>>> refs/heads/backend-user
  plan VARCHAR2(500),
  weeklyplan VARCHAR2(500)
);

<<<<<<< HEAD
CREATE TABLE TRAINERINFO (
=======
-- SET LINESIZE 200;
-- COLUMN member_gender FORMAT A10;
-- COLUMN plan FORMAT A50;
-- COLUMN weeklyplan FORMAT A50;

CREATE TABLE TRAINER_INFO (
>>>>>>> refs/heads/backend-user
  trainer_num NUMBER PRIMARY KEY,
  trainer_insta VARCHAR2(500),
  trainer_intro VARCHAR2(500),
  gym_name VARCHAR2(100),
  gym_link VARCHAR2(500)
);

-- SET LINESIZE 200;
-- COLUMN trainer_insta FORMAT A50;
-- COLUMN trainer_intro FORMAT A50;
-- COLUMN gym_name FORMAT A10;
-- COLUMN gym_link FORMAT A50;

CREATE TABLE MEMBERCALENDAR (
  m_calendar_id NUMBER PRIMARY KEY,
  member_num NUMBER,
  date DATE NOT NULL,
  memo VARCHAR2(500)
);

CREATE TABLE DIETJOURNAL (
  d_journal_id NUMBER PRIMARY KEY,
  m_calendar_id NUMBER,
  diet_id NUMBER,
  diet_type VARCHAR2(100)
);

CREATE TABLE DIETLIST (
  diet_id NUMBER PRIMARY KEY,
  food VARCHAR2(100),
  calories NUMBER(10,3),
  carbs NUMBER(10,3),
  protein NUMBER(10,3),
  fat NUMBER(10,3)
);

CREATE TABLE EXERCISEJOURNAL (
  e_journal_id NUMBER PRIMARY KEY,
  m_calendar_id NUMBER,
  exercise_id NUMBER,
  exercise_order NUMBER,
  exercise_set NUMBER,
  exercise_count NUMBER,
  exercise_weight NUMBER(5,2),
  duration DATE
);

CREATE TABLE EXERCISELIST (
  exercise_id NUMBER PRIMARY KEY,
  exercise_name VARCHAR2(100),
  exercise_category VARCHAR2(100),
  exercise_info VARCHAR2(500),
  exercise_image VARCHAR2(500)
);

CREATE TABLE MESSAGE (
  message_id NUMBER PRIMARY KEY,
  member_num NUMBER,
  trainer_num NUMBER,
  content VARCHAR2(1000),
  send_type VARCHAR2(100) NOT NULL,
  timestamp TIMESTAMP
);

CREATE TABLE TRAINERCALENDAR (
  t_calendar_id NUMBER PRIMARY KEY,
  trainer_num NUMBER,
  member_num NUMBER,
  date DATE NOT NULL

COMMIT;

ALTER TABLE MEMBERCALENDAR ADD FOREIGN KEY (member_num) REFERENCES MEMBERINFO (member_num);

ALTER TABLE MESSAGE ADD FOREIGN KEY (member_num) REFERENCES MEMBERINFO (member_num);

ALTER TABLE EXERCISEJOURNAL ADD FOREIGN KEY (m_calendar_id) REFERENCES MEMBERCALENDAR (m_calendar_id);

ALTER TABLE DIETJOURNAL ADD FOREIGN KEY (m_calendar_id) REFERENCES MEMBERCALENDAR (m_calendar_id);

ALTER TABLE MESSAGE ADD FOREIGN KEY (trainer_num) REFERENCES TRAINERINFO (trainer_num);

ALTER TABLE TRAINERCALENDAR ADD FOREIGN KEY (trainer_num) REFERENCES TRAINERINFO (trainer_num);

ALTER TABLE EXERCISEJOURNAL ADD FOREIGN KEY (exercise_id) REFERENCES EXERCISELIST (exercise_id);

ALTER TABLE DIETLIST ADD FOREIGN KEY (diet_id) REFERENCES DIETJOURNAL (diet_id);

ALTER TABLE TRAINERINFO ADD FOREIGN KEY (trainer_num) REFERENCES USER (user_num);

ALTER TABLE MEMBERINFO ADD FOREIGN KEY (member_num) REFERENCES USER (user_num);

ALTER TABLE MEMBERINFO ADD FOREIGN KEY (trainer_num) REFERENCES TRAINERINFO (trainer_num);
