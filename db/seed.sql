USE business_db;
-- Names of each department.
INSERT INTO department (name)
VALUES
  ('Marketing'),
  ('Accounting'),
  ('Production'),
  ('Quality Control');
-- Values of the parameters for each role.
INSERT INTO role (title, salary, department_id)
VALUES ('Marketer', 50000, 1),
        ('Marketing Manager', 100000, 1),
        ('Accountant', 60000, 2),
        ('Account Manager', 120000, 2),
        ('Developer', 80000, 3),
        ('Development Manager', 160000, 3),
        ('Quality Control Specialist', 90000, 4),
        ('Quality Control Manager', 180000, 4);
-- A starter employee list that contains their name, role ID, and manager ID if they are a manager.
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Remy', 'Oswalt', 1, null),
        ('Alfredo', 'Linguini', 2, 1),
        ('Anton', 'Ego', 3, null),
        ('Horst', 'Arnett', 4, 3),
        ('Mustafa', 'Ratzen', 5, null),
        ('Lalo', 'Callahan', 6, 5),
        ('Collette', 'Garofalo', 7, null),
        ('Emile', 'Sohn', 8, 7);