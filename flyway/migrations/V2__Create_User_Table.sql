CREATE TABLE IF NOT EXISTS "user" (
      id SERIAL PRIMARY KEY,
      company_ref INTEGER REFERENCES company(company_ref),
      name VARCHAR(255) NOT NULL,
      login VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      active BOOLEAN DEFAULT TRUE,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_company_ref ON "user"(company_ref);
CREATE INDEX IF NOT EXISTS idx_user_login ON "user"(login);