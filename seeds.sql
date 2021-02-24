
USE employeetracker;

INSERT INTO department (dept_name)
VALUES ("Marketing"); 
INSERT INTO department (dept_name)
VALUES ("Web Development"); 
INSERT INTO department (dept_name)
VALUES ("Human Resources"); 
INSERT INTO department (dept_name)
VALUES ("Warehouse"); 



INSERT INTO roles (title, salary, dept_id)
VALUES ("Manager", 90000, 1); ("Assistant Manager", 60000, 1); ("Human Resource Specialist", 45000, 3); ("Senior Progammer", 85000, 2); ("Junior Programmer", 50000, 2); ("Warehouse Manager", 50000, 4); ("Packer", 25000, 4); ("Marketing Associate", 45000, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Adams', 1, null); ('Abigail', 'Adams', 2, 1); ('George', 'Washington', 3, 1); ('Martha', 'Washington', 4, 1); ('Barrack', 'Obama', 4, 1); ('Michelle', 'Obama', 5, 4); ('John',  'Kennedy', 5, 5); ('Jackie', 'Kennedy', 8, 2); ('Bill', 'Clinton', 8, 2); ('Hilary', 'Clinton', 8, 1); ('George W.', 'Bush', 6, null); ('Jimmy', 'Carter', 7, 11); ('Gerald', 'Ford', 7, 11);
