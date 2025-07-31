-- Insert sample news data
INSERT INTO news (title, description, content, category, author, status, published_at) VALUES
('New Parish Hall Construction Begins', 
 'We are excited to announce the groundbreaking ceremony for our new parish hall...', 
 'We are excited to announce the groundbreaking ceremony for our new parish hall, which will serve as a community center for various church activities and events. After months of planning and fundraising, we are thrilled to begin construction on our new parish hall.',
 'Church Development', 
 'Rev. Fr. Jobin Thomas', 
 'published', 
 NOW()),

('Annual Retreat Registration Now Open', 
 'Join us for our annual spiritual retreat featuring renowned speakers...', 
 'Join us for our annual spiritual retreat featuring renowned speakers, worship sessions, and fellowship opportunities for spiritual growth and renewal. Our annual retreat will be held from March 15-17, 2025, at the beautiful St. Mary''s Retreat Center.',
 'Events', 
 'MCYM Committee', 
 'published', 
 NOW()),

('Youth Ministry Launches New Program', 
 'Our MCYM group is launching an innovative mentorship program...', 
 'Our MCYM group is launching an innovative mentorship program connecting young adults with experienced community members for spiritual and personal growth. The new mentorship program aims to bridge generational gaps within our community.',
 'Youth Ministry', 
 'MCYM Leadership Team', 
 'draft', 
 NULL);

-- Insert sample events data
INSERT INTO events (title, description, date, time, location, category, attendees, status, registration_form) VALUES
('Christmas Celebration', 
 'Join us for a joyous Christmas celebration with special liturgy, carol singing, and fellowship dinner. Experience the true spirit of Christmas with our church family.',
 '2024-12-25', 
 '6:00 PM – 9:00 PM', 
 'Main Church Hall', 
 'Celebration', 
 'All Welcome', 
 'upcoming',
 '{"enabled": true, "fields": [
   {"id": "name", "type": "text", "label": "Full Name", "required": true, "placeholder": "Enter your full name"},
   {"id": "phone", "type": "tel", "label": "Phone Number", "required": true, "placeholder": "Enter your phone number"},
   {"id": "email", "type": "email", "label": "Email Address", "required": false, "placeholder": "Enter your email (optional)"},
   {"id": "age", "type": "number", "label": "Age", "required": true, "placeholder": "Enter your age"}
 ]}'),

('Easter Vigil Service', 
 'Celebrate the Resurrection of our Lord Jesus Christ at the Easter Vigil. The liturgy includes the lighting of the Paschal candle and renewal of baptismal vows.',
 '2025-03-30', 
 '8:00 PM – 11:00 PM', 
 'Main Sanctuary', 
 'Liturgical', 
 'All Welcome', 
 'upcoming',
 '{"enabled": false, "fields": []}'),

('Youth Spiritual Retreat', 
 'A transformative weekend retreat for young adults focusing on prayer, fellowship, and outdoor activities that encourage spiritual growth.',
 '2025-02-15', 
 'Fri 6:00 PM – Sun 4:00 PM', 
 'Retreat Center', 
 'Retreat', 
 'Ages 16-30', 
 'draft',
 '{"enabled": true, "fields": [
   {"id": "name", "type": "text", "label": "Full Name", "required": true, "placeholder": "Enter your full name"},
   {"id": "phone", "type": "tel", "label": "Phone Number", "required": true, "placeholder": "Enter your phone number"},
   {"id": "email", "type": "email", "label": "Email Address", "required": true, "placeholder": "Enter your email"},
   {"id": "age", "type": "number", "label": "Age", "required": true, "placeholder": "Enter your age"},
   {"id": "emergency_contact", "type": "text", "label": "Emergency Contact", "required": true, "placeholder": "Emergency contact name and phone"}
 ]}');
