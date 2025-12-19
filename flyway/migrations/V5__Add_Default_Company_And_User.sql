INSERT INTO company (id, name, address, phone, active, company_ref, login, password, callback_url, created_at)
VALUES (1, 'Default Company', 'Default Address', '0000000000', TRUE, 1, 'default_company', 'default_password', 'http://localhost:3000/tracking/webhook', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "user" (company_ref, name, login, password, active, created_at)
VALUES (1, 'User', 'user', '$2b$10$E8N4zTasZQ.lDuXSfQTsBOaOHOIPpiGuNclHs/CYzy5sUjzT/5ZuO', TRUE, NOW())
ON CONFLICT (login) DO NOTHING;

SELECT setval(pg_get_serial_sequence('company', 'id'),
              (SELECT MAX(id) FROM company),
              true);