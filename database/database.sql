
create case_md3;
use case_md3;
CREATE TABLE home(
                     id INT AUTO_INCREMENT PRIMARY KEY,
                     name VARCHAR(40) not null,
                     address VARCHAR(255) not null ,
                     description VARCHAR(255) not null ,
                     category VARCHAR(255) not null ,
                     image text,
                     idPoint int not null
);

CREATE TABLE house_time(
                         idS INT AUTO_INCREMENT PRIMARY KEY,
                         startTime date,
                         EndTime date ,
                         idHome int not null
);