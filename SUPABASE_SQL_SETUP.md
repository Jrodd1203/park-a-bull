# How to Run SQL in Supabase - Step by Step

## The Error You're Getting

```
ERROR: 42601: syntax error at or near "`"
LINE 1: `supabase/schema.sql`
```

**This means:** You're trying to run the file path as SQL code. You need to run the **contents** of the file instead!

## ✅ Correct Way to Run SQL

### Step 1: Open Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project: `ekwtyszfxrhsyomkwrbo`
3. Click **SQL Editor** in the left sidebar

### Step 2: Open the Schema File

**On your computer:**
1. Navigate to: `park-a-bull/supabase/schema.sql`
2. Open it with any text editor (VS Code, TextEdit, Notepad, etc.)
3. **Select ALL the text** (Cmd+A on Mac, Ctrl+A on Windows)
4. **Copy it** (Cmd+C on Mac, Ctrl+C on Windows)

### Step 3: Paste and Run in Supabase

**In Supabase SQL Editor:**
1. Click **"+ New query"** button
2. **Paste** the SQL code you copied (Cmd+V on Mac, Ctrl+V on Windows)
3. Click **"Run"** button (or press Cmd+Enter / Ctrl+Enter)
4. Wait for success message ✅

### Step 4: Repeat for Seed Data

1. Open `park-a-bull/supabase/seed.sql` on your computer
2. Copy ALL the text
3. Create **new query** in Supabase
4. Paste and Run

## 🎬 Visual Guide

```
❌ WRONG:
Supabase SQL Editor
┌─────────────────────────┐
│ supabase/schema.sql     │  ← Don't type the file path!
└─────────────────────────┘
```

```
✅ CORRECT:
Supabase SQL Editor
┌─────────────────────────────────────────┐
│ -- Park-a-Bull Database Schema          │
│ -- Run this in your Supabase SQL Editor │
│                                          │
│ CREATE EXTENSION IF NOT EXISTS...       │  ← Paste the actual SQL code!
│ CREATE TABLE IF NOT EXISTS buildings... │
│ ...                                      │
└─────────────────────────────────────────┘
```

## 📋 Quick Checklist

- [ ] Opened supabase/schema.sql file on my computer
- [ ] Copied ALL the text from the file (Cmd+A, Cmd+C)
- [ ] Opened Supabase SQL Editor
- [ ] Created new query
- [ ] Pasted the SQL code (Cmd+V)
- [ ] Clicked Run
- [ ] Saw success message
- [ ] Repeated for seed.sql

## 🆘 Still Having Issues?

### "permission denied for schema auth"
**Solution:** Run this first:
```sql
-- Grant permissions (run this before schema.sql)
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
```

### "extension uuid-ossp already exists"
**Solution:** This is fine! It means it's already installed. Keep running the rest.

### "relation already exists"
**Solution:** Tables already exist. Either:
1. Drop them first: Run the cleanup SQL below
2. Or skip to seed.sql

### Want to start fresh?
```sql
-- WARNING: This deletes everything!
DROP TABLE IF EXISTS checkins CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS parking_lots CASCADE;
DROP TABLE IF EXISTS buildings CASCADE;
```

## 📝 What You Should See

**After running schema.sql:**
```
Success. No rows returned
```
or
```
CREATE EXTENSION
CREATE TABLE
CREATE TABLE
...
(multiple success messages)
```

**After running seed.sql:**
```
INSERT 0 6
INSERT 0 10
```

This means:
- 6 buildings inserted ✅
- 10 parking lots inserted ✅

## ✅ Verify It Worked

Run this query to check:
```sql
SELECT
  'buildings' as table_name,
  COUNT(*) as count
FROM buildings
UNION ALL
SELECT 'parking_lots', COUNT(*) FROM parking_lots;
```

**Expected result:**
```
buildings    | 6
parking_lots | 10
```

If you see this → Success! 🎉
