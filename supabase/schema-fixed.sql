-- Park-a-Bull Database Schema (Fixed)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Buildings table
CREATE TABLE IF NOT EXISTS buildings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  abbreviation TEXT NOT NULL,
  aliases TEXT[] DEFAULT '{}',
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Parking lots table
CREATE TABLE IF NOT EXISTS parking_lots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('garage', 'lot')),
  permits TEXT[] NOT NULL DEFAULT '{}',
  capacity INTEGER NOT NULL,
  current_occupancy INTEGER NOT NULL DEFAULT 0,
  floors INTEGER,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_occupancy CHECK (current_occupancy >= 0 AND current_occupancy <= capacity)
);

-- User profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  permit_type TEXT NOT NULL DEFAULT 'S',
  current_lot_id UUID REFERENCES parking_lots(id) ON DELETE SET NULL,
  checkin_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Check-ins table
CREATE TABLE IF NOT EXISTS checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lot_id UUID NOT NULL REFERENCES parking_lots(id) ON DELETE CASCADE,
  permit_type TEXT NOT NULL,
  floor INTEGER,
  spot_number TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'departed')) DEFAULT 'active',
  checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  checked_out_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_parking_lots_permits ON parking_lots USING GIN(permits);
CREATE INDEX IF NOT EXISTS idx_parking_lots_type ON parking_lots(type);
CREATE INDEX IF NOT EXISTS idx_checkins_user_id ON checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_checkins_lot_id ON checkins(lot_id);
CREATE INDEX IF NOT EXISTS idx_checkins_status ON checkins(status);
CREATE INDEX IF NOT EXISTS idx_buildings_aliases ON buildings USING GIN(aliases);

-- Row Level Security (RLS) Policies
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Buildings are viewable by everyone" ON buildings;
DROP POLICY IF EXISTS "Parking lots are viewable by everyone" ON parking_lots;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own check-ins" ON checkins;
DROP POLICY IF EXISTS "Users can create their own check-ins" ON checkins;
DROP POLICY IF EXISTS "Users can update their own check-ins" ON checkins;

-- Buildings: Public read access
CREATE POLICY "Buildings are viewable by everyone"
  ON buildings FOR SELECT
  USING (true);

-- Parking lots: Public read access
CREATE POLICY "Parking lots are viewable by everyone"
  ON parking_lots FOR SELECT
  USING (true);

-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Check-ins: Users can only access their own check-ins
CREATE POLICY "Users can view their own check-ins"
  ON checkins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own check-ins"
  ON checkins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own check-ins"
  ON checkins FOR UPDATE
  USING (auth.uid() = user_id);

-- Drop existing functions and triggers if they exist
DROP TRIGGER IF EXISTS update_buildings_updated_at ON buildings;
DROP TRIGGER IF EXISTS update_parking_lots_updated_at ON parking_lots;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_checkins_updated_at ON checkins;
DROP TRIGGER IF EXISTS update_occupancy_on_checkin ON checkins;
DROP TRIGGER IF EXISTS update_profile_on_checkin ON checkins;

DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS update_lot_occupancy();
DROP FUNCTION IF EXISTS increment_checkin_count();

-- Function to update updated_at timestamp
CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_buildings_updated_at BEFORE UPDATE ON buildings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parking_lots_updated_at BEFORE UPDATE ON parking_lots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_checkins_updated_at BEFORE UPDATE ON checkins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update parking lot occupancy
CREATE FUNCTION update_lot_occupancy()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- When a new check-in is created with active status
  IF (TG_OP = 'INSERT' AND NEW.status = 'active') THEN
    UPDATE parking_lots
    SET current_occupancy = current_occupancy + 1
    WHERE id = NEW.lot_id;

  -- When a check-in status changes from active to departed
  ELSIF (TG_OP = 'UPDATE' AND OLD.status = 'active' AND NEW.status = 'departed') THEN
    UPDATE parking_lots
    SET current_occupancy = GREATEST(current_occupancy - 1, 0)
    WHERE id = NEW.lot_id;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger to update occupancy on check-in/check-out
CREATE TRIGGER update_occupancy_on_checkin
  AFTER INSERT OR UPDATE ON checkins
  FOR EACH ROW
  EXECUTE FUNCTION update_lot_occupancy();

-- Function to increment user check-in count
CREATE FUNCTION increment_checkin_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- When a new check-in is created with active status
  IF (TG_OP = 'INSERT' AND NEW.status = 'active') THEN
    UPDATE profiles
    SET checkin_count = checkin_count + 1,
        current_lot_id = NEW.lot_id
    WHERE id = NEW.user_id;

  -- When a check-in status changes from active to departed
  ELSIF (TG_OP = 'UPDATE' AND OLD.status = 'active' AND NEW.status = 'departed') THEN
    UPDATE profiles
    SET current_lot_id = NULL
    WHERE id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger to update profile on check-in
CREATE TRIGGER update_profile_on_checkin
  AFTER INSERT OR UPDATE ON checkins
  FOR EACH ROW
  EXECUTE FUNCTION increment_checkin_count();
