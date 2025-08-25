/*
  # Insert demo users for testing

  1. Demo Users
    - Faculty user: faculty@skit.org.in
    - HOD user: hod@skit.org.in
    
  Note: These users need to be created through Supabase Auth first,
  then their profiles will be automatically created via the trigger.
*/

-- This migration file serves as documentation for the demo users.
-- The actual users should be created through the application's registration
-- or through Supabase Auth dashboard with the following details:

-- Faculty User:
-- Email: faculty@skit.org.in
-- Password: password123
-- Metadata: {"full_name": "Dr. John Smith", "role": "faculty", "department": "Computer Science"}

-- HOD User:
-- Email: hod@skit.org.in  
-- Password: password123
-- Metadata: {"full_name": "Dr. Jane Doe", "role": "hod", "department": "Computer Science"}

-- These can be created via SQL if needed:
-- Note: Replace 'your-actual-user-id' with the actual UUID from auth.users

-- Example (don't run unless you have the actual user IDs):
-- INSERT INTO profiles (id, email, full_name, role, department) VALUES
-- ('faculty-user-id-here', 'faculty@skit.org.in', 'Dr. John Smith', 'faculty', 'Computer Science'),
-- ('hod-user-id-here', 'hod@skit.org.in', 'Dr. Jane Doe', 'hod', 'Computer Science');