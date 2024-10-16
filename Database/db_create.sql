CREATE TABLE "USER" (
  "user_num" NUMBER PRIMARY KEY,
  "user_id" VARCHAR2(100) UNIQUE,
  "oauth_id" VARCHAR2(500) UNIQUE,
  "name" VARCHAR2(100) NOT NULL,
  "email" VARCHAR2(100),
  "created_at" TIMESTAMP,
  "profile_image_url" VARCHAR2(500)
);

CREATE TABLE MEMBERINFO (
  "member_num" NUMBER PRIMARY KEY,
  "trainer_num" NUMBER,
  "member_height" NUMBER(5,2),
  "member_weight" NUMBER(5,2),
  "member_gender" VARCHAR2(100),
  "plan" VARCHAR2(500),
  "weeklyplan" VARCHAR2(500)
);

CREATE TABLE TRAINERINFO (
  "trainer_num" NUMBER PRIMARY KEY,
  "trainer_insta" VARCHAR2(500),
  "trainer_intro" VARCHAR2(500),
  "gym_name" VARCHAR2(100),
  "gym_link" VARCHAR2(500)
);

CREATE TABLE MEMBERCALENDAR (
  "m_calendar_id" NUMBER PRIMARY KEY,
  "member_num" NUMBER,
  "date" DATE NOT NULL,
  "memo" VARCHAR2(500)
);

CREATE TABLE DIETJOURNAL (
  "d_journal_id" NUMBER PRIMARY KEY,
  "m_calendar_id" NUMBER,
  "diet_id" NUMBER,
  "diet_type" VARCHAR2(100)
);

CREATE TABLE DIETLIST (
  "diet_id" NUMBER PRIMARY KEY,
  "food" VARCHAR2(100),
  "calories" NUMBER(10,3),
  "carbs" NUMBER(10,3),
  "protein" NUMBER(10,3),
  "fat" NUMBER(10,3)
);

CREATE TABLE EXERCISEJOURNAL (
  "e_journal_id" NUMBER PRIMARY KEY,
  "m_calendar_id" NUMBER,
  "exercise_id" NUMBER,
  "exercise_order" NUMBER,
  "exercise_set" NUMBER,
  "exercise_count" NUMBER,
  "exercise_weight" NUMBER(5,2),
  "duration" DATE
);

CREATE TABLE EXERCISELIST (
  "exercise_id" NUMBER PRIMARY KEY,
  "exercise_name" VARCHAR2(100),
  "exercise_category" VARCHAR2(100),
  "exercise_info" VARCHAR2(500),
  "exercise_image" VARCHAR2(500)
);

CREATE TABLE MESSAGE (
  "message_id" NUMBER PRIMARY KEY,
  "member_num" NUMBER,
  "trainer_num" NUMBER,
  "content" VARCHAR2(1000),
  "send_type" VARCHAR2(100) NOT NULL,
  "timestamp" TIMESTAMP
);

CREATE TABLE TRAINERCALENDAR (
  "t_calendar_id" NUMBER PRIMARY KEY,
  "trainer_num" NUMBER,
  "member_num" NUMBER,
  "date" DATE NOT NULL
);

COMMIT;

ALTER TABLE MEMBERCALENDAR ADD FOREIGN KEY ("member_num") REFERENCES MEMBERINFO ("member_num");

ALTER TABLE MESSAGE ADD FOREIGN KEY ("member_num") REFERENCES MEMBERINFO ("member_num");

ALTER TABLE EXERCISEJOURNAL ADD FOREIGN KEY ("m_calendar_id") REFERENCES MEMBERCALENDAR ("m_calendar_id");

ALTER TABLE DIETJOURNAL ADD FOREIGN KEY ("m_calendar_id") REFERENCES MEMBERCALENDAR ("m_calendar_id");

ALTER TABLE MESSAGE ADD FOREIGN KEY ("trainer_num") REFERENCES TRAINERINFO ("trainer_num");

ALTER TABLE TRAINERCALENDAR ADD FOREIGN KEY ("trainer_num") REFERENCES TRAINERINFO ("trainer_num");

ALTER TABLE EXERCISEJOURNAL ADD FOREIGN KEY ("exercise_id") REFERENCES EXERCISELIST ("exercise_id");

ALTER TABLE DIETLIST ADD FOREIGN KEY ("diet_id") REFERENCES DIETJOURNAL ("diet_id");

ALTER TABLE TRAINERINFO ADD FOREIGN KEY ("trainer_num") REFERENCES USER ("user_num");

ALTER TABLE MEMBERINFO ADD FOREIGN KEY ("member_num") REFERENCES USER ("user_num");

ALTER TABLE MEMBERINFO ADD FOREIGN KEY ("trainer_num") REFERENCES TRAINERINFO ("trainer_num");
