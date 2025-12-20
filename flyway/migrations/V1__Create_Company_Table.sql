CREATE TABLE IF NOT EXISTS company (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    company_ref INTEGER NOT NULL UNIQUE,
    login TEXT NOT NULL,
    password TEXT NOT NULL,
    callback_url TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
    );

CREATE INDEX IF NOT EXISTS idx_company_company_ref ON company(company_ref);
CREATE INDEX IF NOT EXISTS idx_company_login ON company(login);