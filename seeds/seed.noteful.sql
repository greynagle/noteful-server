INSERT INTO folders (name)
VALUES
  ('Important'),
  ('Super'),
  ('Spangley');

INSERT INTO notes (name, mod_date, content, folder_id)
VALUES
	('Dogs', NOW(), 'German shepherds are cute', 1),
	('Cats', NOW(), 'Cats are cute', 1),
	('Pigs', NOW(), 'Teacup pigs are cute', 1),
	('Birds', NOW(), 'Crows are cute', 2),
	('Bears', NOW(), 'Black Bears are cute', 3),
	('Horses', NOW(), 'Horses are cute', 1),
	('Tigers', NOW(), 'Dont keep these as pets', 2),
	('Wolves', NOW(), 'Dont keep these as pets', 2),
	('Elephants', NOW(), 'These are cute and smart', 3);