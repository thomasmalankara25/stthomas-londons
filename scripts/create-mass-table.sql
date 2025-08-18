-- Create mass table for storing church settings
CREATE TABLE IF NOT EXISTS mass (
    id SERIAL PRIMARY KEY,
    church_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mass_time VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default values
INSERT INTO mass (church_name, email, mass_time, address) 
VALUES (
    'St. Thomas Malankara Catholic Church',
    'jobin.thomas@MCCNA.org',
    '04:00 PM EST',
    '1669 Richmond St, Dorchester, ON N0L 1G4'
) ON CONFLICT DO NOTHING;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_mass_created_at ON mass(created_at);
