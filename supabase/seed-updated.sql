-- Park-a-Bull Seed Data (Updated with correct permits)

-- First, delete existing data
DELETE FROM parking_lots;
DELETE FROM buildings;

-- Insert Buildings
INSERT INTO buildings (name, abbreviation, aliases, latitude, longitude) VALUES
  ('Library', 'LIB', ARRAY['library', 'lib', 'tampa library'], 28.0586, -82.4138),
  ('Marshall Student Center', 'MSC', ARRAY['msc', 'marshall', 'student center'], 28.0651, -82.4189),
  ('Recreation Center', 'REC', ARRAY['rec', 'rec center', 'gym', 'recreation'], 28.0643, -82.4203),
  ('Business Building', 'BSN', ARRAY['bsn', 'business', 'muma'], 28.0593, -82.4187),
  ('Engineering Building', 'ENG', ARRAY['eng', 'engineering', 'enc'], 28.0601, -82.4145),
  ('Science Center', 'ISA', ARRAY['isa', 'science', 'science center'], 28.0596, -82.4131);

-- Insert Parking Lots (ONLY S, R, E, V permits)
INSERT INTO parking_lots (name, short_name, type, permits, capacity, current_occupancy, floors, latitude, longitude) VALUES
  ('Lot 1A', 'Lot 1A', 'lot', ARRAY['S - Student', 'E - Faculty/Staff'], 150, 45, NULL, 28.0580, -82.4125),
  ('Lot 2B', 'Lot 2B', 'lot', ARRAY['S - Student'], 200, 175, NULL, 28.0595, -82.4150),
  ('Lot 3C', 'Lot 3C', 'lot', ARRAY['E - Faculty/Staff'], 100, 85, NULL, 28.0610, -82.4170),
  ('Lot 4D', 'Lot 4D', 'lot', ARRAY['S - Student', 'R - Resident'], 300, 120, NULL, 28.0640, -82.4200),
  ('Lot 5E', 'Lot 5E', 'lot', ARRAY['R - Resident'], 250, 230, NULL, 28.0660, -82.4210),
  ('Lot 6F', 'Lot 6F', 'lot', ARRAY['S - Student', 'E - Faculty/Staff'], 180, 60, NULL, 28.0575, -82.4135),
  ('Garage A', 'Garage A', 'garage', ARRAY['S - Student', 'E - Faculty/Staff', 'V - Visitor'], 500, 450, 5, 28.0655, -82.4195),
  ('Garage B', 'Garage B', 'garage', ARRAY['S - Student', 'E - Faculty/Staff', 'R - Resident'], 600, 320, 6, 28.0620, -82.4180),
  ('Lot 7G', 'Lot 7G', 'lot', ARRAY['V - Visitor', 'E - Faculty/Staff'], 80, 15, NULL, 28.0590, -82.4140),
  ('Lot 8H', 'Lot 8H', 'lot', ARRAY['S - Student'], 220, 195, NULL, 28.0635, -82.4215);
