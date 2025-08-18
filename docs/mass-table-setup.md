# Mass Table Setup and Admin Settings

## Overview
The admin panel now includes a Settings tab that allows administrators to manage church information including church name, contact email, mass time, and church address. This data is stored in a `mass` table in the database.

## Database Setup

### 1. Create the Mass Table
Run the SQL script located at `scripts/create-mass-table.sql` in your Supabase database:

```sql
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
```

### 2. Table Structure
The `mass` table contains the following fields:

- `id`: Primary key (auto-increment)
- `church_name`: Name of the church
- `email`: Contact email address
- `mass_time`: Sunday mass time
- `address`: Church address
- `created_at`: Timestamp when record was created
- `updated_at`: Timestamp when record was last updated

## Admin Panel Usage

### Accessing Settings
1. Navigate to `/admin` in your application
2. Click on the "Settings" tab
3. You'll see two cards:
   - **General Settings**: Church name and contact email
   - **Mass Schedule**: Sunday mass time and church address

### Saving Settings
1. Modify any of the fields in either card
2. Click the "Save Changes" or "Update Schedule" button
3. A success message will appear confirming the settings were saved
4. The data is automatically saved to the `mass` table

### Features
- **Real-time Updates**: Changes are immediately reflected in the form
- **Data Persistence**: Settings are saved to the database and persist between sessions
- **Error Handling**: Failed saves show an alert message
- **Loading States**: Buttons show "Saving..." while processing
- **Success Feedback**: Green success message appears after successful saves

## API Integration

### Mass Service
The functionality is implemented through the `MassService` class located at `lib/api/mass.ts`:

```typescript
// Get current settings
const settings = await massService.getSettings()

// Save new settings
const savedSettings = await massService.saveSettings({
  church_name: "New Church Name",
  email: "new@email.com",
  mass_time: "10:00 AM",
  address: "New Address"
})
```

### Service Methods
- `getSettings()`: Retrieves the most recent mass settings
- `saveSettings(settings)`: Creates or updates mass settings

## Data Flow
1. **Load**: Settings are loaded when the admin panel initializes
2. **Edit**: Users can modify values in the form inputs
3. **Save**: Clicking save triggers the `handleSaveMassSettings` function
4. **Database**: Data is saved to the `mass` table via Supabase
5. **Feedback**: Success/error messages are shown to the user

## Security
- Settings can only be modified by authenticated admin users
- The admin panel is protected by the `AdminAuthGuard` component
- Database operations use Supabase's built-in security features

## Troubleshooting

### Common Issues
1. **Settings not loading**: Check if the `mass` table exists and has data
2. **Save failures**: Verify database permissions and connection
3. **Form not updating**: Ensure the component is properly re-rendering

### Database Permissions
Make sure your Supabase RLS (Row Level Security) policies allow authenticated users to read and write to the `mass` table.

## Future Enhancements
- Add validation for email format and required fields
- Implement settings history/audit trail
- Add more church configuration options
- Export/import settings functionality
