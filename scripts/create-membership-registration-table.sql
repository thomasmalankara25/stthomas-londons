-- Create membership_registrations table
CREATE TABLE IF NOT EXISTS membership_registrations (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  primary_member_name VARCHAR(255) NOT NULL,
  contact_number VARCHAR(50) NOT NULL,
  home_address TEXT NOT NULL,
  date_of_birth DATE,
  date_of_baptism DATE,
  date_of_confirmation DATE,
  date_of_marriage DATE,
  spouse_name VARCHAR(255),
  spouse_email VARCHAR(255),
  spouse_contact_number VARCHAR(50),
  spouse_date_of_birth DATE,
  spouse_date_of_baptism DATE,
  spouse_date_of_confirmation DATE,
  additional_members JSONB DEFAULT '[]'::jsonb,
  registration_status VARCHAR(20) DEFAULT 'pending' CHECK (registration_status IN ('pending', 'approved', 'rejected')),
  processed_by INTEGER REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_membership_registrations_email ON membership_registrations(email);
CREATE INDEX IF NOT EXISTS idx_membership_registrations_status ON membership_registrations(registration_status);
CREATE INDEX IF NOT EXISTS idx_membership_registrations_created_at ON membership_registrations(created_at);
CREATE INDEX IF NOT EXISTS idx_membership_registrations_primary_member ON membership_registrations(primary_member_name);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_membership_registrations_updated_at 
    BEFORE UPDATE ON membership_registrations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE membership_registrations IS 'Stores church membership registration applications';
COMMENT ON COLUMN membership_registrations.additional_members IS 'JSONB array storing additional family member information';
COMMENT ON COLUMN membership_registrations.registration_status IS 'Status of the registration: pending, approved, or rejected';
COMMENT ON COLUMN membership_registrations.processed_by IS 'ID of the admin user who processed this registration';
