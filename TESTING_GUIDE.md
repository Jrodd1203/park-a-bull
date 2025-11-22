# Park-a-Bull Testing Guide

This guide walks you through testing the complete app with realistic user flows.

## Prerequisites

Before testing, make sure you've:
1. ✅ Run `supabase/schema.sql` in Supabase SQL Editor
2. ✅ Run `supabase/seed.sql` to populate test data
3. ✅ Environment variables are set in `.env.local`
4. ✅ App is running with `npm start`

## Quick Test Setup (30 seconds)

### Enable Anonymous Sign-In (Recommended for Testing)

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Settings**
3. Scroll to **Anonymous sign-ins**
4. Toggle **Enable anonymous sign-ins** to ON
5. Click **Save**

This allows instant testing without creating email accounts.

## Complete User Flow Tests

### Flow 1: First-Time User - Find Parking Near Building

**Scenario**: Student arrives on campus, needs parking near the Library

1. **Launch App**
   - Expected: App opens to HomeScreen
   - If no auth: Automatically signs in anonymously

2. **Search for Building**
   - Tap search bar
   - Type "library" or "lib"
   - Press enter/search
   - Expected: Navigate to ResultsScreen showing lots near Library

3. **Filter by Permit Type**
   - Tap "Student" filter chip
   - Expected: List updates to show only lots accepting Student permits
   - Check: Each lot should show "S - Student" in permits

4. **View Lot Details**
   - Tap on "Lot 1A" card
   - Expected: Navigate to MapScreen showing lot location

5. **Navigate to Lot**
   - Tap "Directions" button
   - Expected: Opens native Maps app with route to lot

6. **Check In**
   - Go back to app
   - Tap "Check In" on the parking lot card
   - Expected: Navigate to CheckInScreen
   - For garages: Select a floor (e.g., Floor 2)
   - Optional: Enter spot number (e.g., "A4")
   - Tap "Confirm Check-In"
   - Expected:
     - Success message appears
     - Navigate back to HomeScreen
     - "Currently Parked" card appears at top

7. **Verify Active Parking**
   - On HomeScreen, check "Currently Parked" card shows:
     - Lot name: "Lot 1A"
     - Check-in time (e.g., "Since 2:30 PM")
     - Floor and spot if entered
     - "Active" status badge
   - Weekly check-in count increments by 1

8. **Check Out**
   - Tap "Check Out" button in "Currently Parked" card
   - Expected:
     - Confirmation dialog or immediate checkout
     - "Currently Parked" card disappears
     - Can check in to another lot

### Flow 2: Commuter - Quick Access to Favorite Location

**Scenario**: Faculty member regularly parks near the Student Center

1. **Launch App**
   - HomeScreen loads

2. **Use Quick Access**
   - Tap "Student Center" quick access card
   - Expected: Navigate to ResultsScreen with "Near Marshall Student Center" title

3. **Filter by Faculty Permit**
   - Tap "Faculty" filter chip
   - Expected: Shows lots accepting "E - Faculty/Staff" permits

4. **Sort by Availability**
   - Check lots are sorted (most available first)
   - Look for lots with green "Available" status

5. **Browse All Locations**
   - Go back to HomeScreen
   - Tap "Browse All Parking Lots"
   - Expected: Shows all 10 parking lots regardless of location

### Flow 3: Multi-Day Parking Tracking

**Scenario**: Resident student tracks parking over a week

1. **Day 1 - Monday**
   - Check in to "Garage B"
   - Select Floor 3
   - Check weekly stats: 1 check-in

2. **Day 1 - Evening**
   - Check out when leaving campus

3. **Day 2 - Tuesday**
   - Check in to "Lot 4D"
   - Check weekly stats: 2 check-ins

4. **Day 5 - Friday**
   - Check in again
   - Check weekly stats: Should show 5 check-ins
   - Expected message: "You're a parking pro! 🎉"

5. **View History**
   - Navigate to Profile screen (if implemented)
   - Check parking history shows all previous check-ins

### Flow 4: Real-Time Updates (Multi-Device Test)

**Scenario**: Testing real-time occupancy updates

**Setup**: Need 2 devices/simulators or use Supabase dashboard

**Device 1 (Primary)**:
1. Open app to ResultsScreen
2. Note "Lot 1A" has 45/150 occupancy (105 available)

**Device 2 (Secondary)** or **Supabase Dashboard**:
1. Check in to "Lot 1A"
   - OR update via SQL:
   ```sql
   UPDATE parking_lots
   SET current_occupancy = current_occupancy + 1
   WHERE name = 'Lot 1A';
   ```

**Device 1 (Primary)**:
1. Expected: Within 1-2 seconds, "Lot 1A" updates to 46/150 (104 available)
2. Availability percentage updates
3. Status color may change if threshold crossed

### Flow 5: Edge Cases & Error Handling

**Test 1: Full Lot**
1. Find a lot showing "Full" status (85%+ occupancy)
2. Expected: Red status indicator, limited availability message

**Test 2: No Permit Match**
1. Filter by "Visitor" permit
2. Expected: Shows only "Garage A" and "Lot 7G"
3. Other lots should be hidden

**Test 3: Search with No Results**
1. Search for "NonexistentBuilding123"
2. Expected: Shows no results or empty state message

**Test 4: Network Error**
1. Turn on Airplane Mode
2. Try to load parking lots
3. Expected: Error message with retry option

**Test 5: Already Checked In**
1. Check in to a lot
2. Try to check in to another lot without checking out
3. Expected: Warning message or auto-checkout from previous lot

## Test Data Reference

### Available Buildings
- Library (LIB)
- Marshall Student Center (MSC)
- Recreation Center (REC)
- Business Building (BSN)
- Engineering Building (ENG)
- Science Center (ISA)

### Parking Lots by Permit Type

**Student Permits (S)**:
- Lot 1A (30% full - GREEN)
- Lot 2B (87% full - RED)
- Lot 4D (40% full - GREEN)
- Lot 6F (33% full - GREEN)
- Garage A (90% full - RED)
- Garage B (53% full - GREEN)
- Lot 8H (88% full - RED)

**Resident Permits (R)**:
- Lot 4D (40% full)
- Lot 5E (92% full - RED)
- Garage B (53% full)

**Faculty/Staff Permits (E)**:
- Lot 1A (30% full)
- Lot 3C (85% full - YELLOW/RED)
- Lot 6F (33% full)
- Garage A (90% full)
- Garage B (53% full)
- Lot 7G (18% full - GREEN)

**Visitor Permits**:
- Garage A (90% full)
- Lot 7G (18% full - BEST OPTION)

### Parking Garages (Multi-Floor)
- **Garage A**: 5 floors, 500 capacity
- **Garage B**: 6 floors, 600 capacity

## Performance Benchmarks

What to expect:
- **Initial Load**: < 2 seconds
- **Search Results**: < 1 second
- **Check-in Save**: < 1 second
- **Real-time Update**: 1-2 seconds after change
- **Map Rendering**: < 3 seconds

## Testing Checklist

### Core Features
- [ ] App launches successfully
- [ ] Anonymous sign-in works
- [ ] HomeScreen displays correctly
- [ ] Search functionality works
- [ ] Quick access buttons navigate correctly
- [ ] Browse all shows all lots
- [ ] Filter by permit type works
- [ ] Parking lot cards show correct data
- [ ] Map view displays location
- [ ] Check-in flow completes
- [ ] Active parking status appears
- [ ] Check-out works
- [ ] Weekly stats update
- [ ] Real-time updates work

### UI/UX
- [ ] Loading states show
- [ ] Error messages are clear
- [ ] Animations are smooth
- [ ] Touch targets are easy to tap
- [ ] Text is readable
- [ ] Dark mode looks good
- [ ] Safe areas respected (notches, etc.)

### Data Integrity
- [ ] Occupancy percentages are accurate
- [ ] Status colors match occupancy:
  - Green: < 60%
  - Yellow: 60-85%
  - Red: > 85%
- [ ] Available spots = capacity - occupancy
- [ ] Check-in increments occupancy
- [ ] Check-out decrements occupancy
- [ ] Weekly count is accurate

### Edge Cases
- [ ] Handles no internet connection
- [ ] Handles empty search results
- [ ] Handles full parking lots
- [ ] Handles rapid check-in/check-out
- [ ] Handles invalid data gracefully

## Troubleshooting Test Issues

### "No parking lots showing"
```sql
-- Verify data in Supabase SQL Editor:
SELECT COUNT(*) FROM parking_lots;
-- Should return: 10
```

### "Check-in not saving"
- Check: User is signed in (anonymous or email)
- Check: RLS policies are enabled
- Check: Profile exists for user

### "Real-time not working"
- Check: Supabase Realtime is enabled
- Check: Network connection is stable
- Try: Refresh the screen

### "Occupancy not updating"
```sql
-- Manually verify triggers:
SELECT * FROM checkins WHERE status = 'active' LIMIT 5;
SELECT * FROM parking_lots ORDER BY current_occupancy DESC LIMIT 5;
```

## Advanced Testing

### Load Testing
```sql
-- Create 100 test check-ins to simulate busy parking:
INSERT INTO checkins (user_id, lot_id, permit_type, status)
SELECT
  (SELECT id FROM profiles LIMIT 1),
  (SELECT id FROM parking_lots WHERE name = 'Garage A'),
  'S - Student',
  'active'
FROM generate_series(1, 100);
```

### Reset Test Data
```sql
-- Clear all check-ins and reset occupancy:
DELETE FROM checkins;
UPDATE parking_lots SET current_occupancy = 0;

-- Then re-run seed.sql to restore initial occupancy
```

## Next Steps After Testing

Once you've tested everything:
1. ✅ Fix any bugs you found
2. ✅ Adjust UI based on user experience
3. ✅ Add analytics to track real usage
4. ✅ Consider adding features like:
   - Push notifications for check-out reminders
   - Parking history with maps
   - Favorite parking spots
   - Share your spot with friends
   - Report if lot is full/wrong data

Happy Testing! 🧪
