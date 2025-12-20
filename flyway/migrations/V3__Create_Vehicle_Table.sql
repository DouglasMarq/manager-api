CREATE TABLE IF NOT EXISTS vehicle (
       id SERIAL PRIMARY KEY,
       company_ref INTEGER NOT NULL REFERENCES company(company_ref),
       license VARCHAR(255),
       vin VARCHAR(255) NOT NULL UNIQUE,
       lat DOUBLE PRECISION,
       long DOUBLE PRECISION,
       fuel_level INTEGER NOT NULL DEFAULT 0,
       active BOOLEAN DEFAULT TRUE,
       created_at TIMESTAMP NOT NULL DEFAULT NOW(),
       updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vehicle_company_ref ON vehicle(company_ref);
CREATE INDEX IF NOT EXISTS idx_vehicle_vin ON vehicle(vin);