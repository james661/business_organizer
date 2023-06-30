USE business_db;

INSERT INTO department (name)
VALUES
  ('Marketing'),
  ('Accounting'),
  ('Production'),
  ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES ('Salesperson', 50000, 1),
        ('Sales Manager', 100000, 1),
        ('Accountant', 60000, 2),
        ('Account Manager', 120000, 2),
        ('Engineer', 80000, 3),
        ('Engineering Manager', 160000, 3),
        ('Lawyer', 90000, 4),
        ('Legal Manager', 180000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Remy', 'Oswalt', 1, null),
        ('Alfredo', 'Linguini', 2, 1),
        ('Anton', 'Ego', 3, null),
        ('Horst', 'Arnett', 4, 3),
        ('Mustafa', 'Ratzen', 5, null),
        ('Lalo', 'Callahan', 6, 5),
        ('Collette', 'Garofalo', 7, null),
        ('Emile', 'Sohn', 8, 7);