-- Tells SQL to delete the database if one already exists, otherwise creates one.
DROP DATABASE IF EXISTS business_db;
CREATE DATABASE business_db;

USE business_db;
-- Creates a table for all the departments
CREATE TABLE department (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);
-- Creates a table for all the roles along with the salary tied to each.
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id) 
  ON DELETE CASCADE
);
-- Creates a table for the employee's names, along with their role and manager id if they are a manager.
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT DEFAULT NULL,
  FOREIGN KEY (role_id) REFERENCES role(id)
  ON DELETE CASCADE
);