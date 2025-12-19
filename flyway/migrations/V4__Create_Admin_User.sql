INSERT INTO "user" (name, login, password, active, role, created_at)
VALUES ('Administrator', 'admin', '$2b$10$8xPdfuxyP/5.gT2ah9JksO1hqjY0QDYeyRVeAN8jtAul0KDeG4u5O', TRUE, 'admin', NOW())
ON CONFLICT (login) DO NOTHING;

SELECT setval('company_id_seq', (SELECT MAX(id) FROM company));