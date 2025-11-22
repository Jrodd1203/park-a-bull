# Quick Start: Testing Your App

This guide gets you testing in 5 minutes!

## Step 1: Set Up Database (2 minutes)

1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to your project → **SQL Editor**
3. Click **New Query**
4. Copy/paste contents of `supabase/schema.sql` → **Run**
5. Create another query
6. Copy/paste contents of `supabase/seed.sql` → **Run**

✅ You now have 6 buildings and 10 parking lots!

## Step 2: Enable Anonymous Auth (1 minute)

1. In Supabase Dashboard → **Authentication** → **Settings**
2. Scroll to **Anonymous sign-ins**
3. Toggle **ON**
4. Click **Save**

✅ Users can now test without creating accounts!

## Step 3: Add Dev Test Screen (2 minutes)

### Option A: Add to Navigator (Recommended)

1. Open `src/navigation/AppNavigator.tsx`
2. Import the dev screen:
```typescript
import DevTestScreen from '../screens/DevTestScreen';
```

3. Add to the RootStackParamList type:
```typescript
export type RootStackParamList = {
  Home: undefined;
  Results: { buildingName?: string; permitType?: string };
  Map: { latitude?: number; longitude?: number };
  CheckIn: { parkingId: string; parkingName: string; parkingType: 'garage' | 'lot'; floors?: number };
  Profile: undefined;
  DevTest: undefined;  // ← Add this
};
```

4. Add screen to navigator:
```typescript
<Stack.Screen
  name="DevTest"
  component={DevTestScreen}
  options={{ title: 'Dev Tests', headerShown: true }}
/>
```

5. Add button to HomeScreen to access it:
```typescript
// In HomeScreen.tsx, add this button (temporary for testing):
<TouchableOpacity
  style={styles.devButton}
  onPress={() => navigation.navigate('DevTest')}
>
  <Ionicons name="flask" size={20} color={COLORS.primary} />
  <Text>Dev Tests</Text>
</TouchableOpacity>

// Add style:
devButton: {
  position: 'absolute',
  bottom: 20,
  right: 20,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  backgroundColor: COLORS.surface,
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 24,
  ...SHADOWS.medium,
},
```

### Option B: Test from Console (Quick)

Open your browser console (web) or React Native Debugger and run:

```javascript
import { TestHelpers } from './src/utils/testHelpers';

// Test connection
await TestHelpers.testDatabaseConnection();

// Verify setup
await TestHelpers.verifyDatabaseSetup();

// Quick check-in
await TestHelpers.quickTestCheckin();

// Get stats
await TestHelpers.getParkingStats();
```

## Step 4: Start Testing! 🚀

### Quick Test Flow (30 seconds)

1. Launch app
2. Tap **Dev Tests** button (or navigate to DevTest screen)
3. Run these tests in order:
   - ✅ Test Connection
   - ✅ Verify Tables
   - ✅ Test Check-in
   - ✅ Show Stats

If all pass → Everything works! 🎉

### Manual User Flow (2 minutes)

1. **Launch App** → Should auto sign-in anonymously
2. **Search** → Type "library" → Press enter
3. **Filter** → Tap "Student" chip
4. **Select Lot** → Tap "Lot 1A" card
5. **View Map** → Should show location
6. **Check In** → Tap "Check In" button
   - Select Floor 2 (if garage)
   - Enter spot "A4"
   - Confirm
7. **Verify** → Go to HomeScreen
   - Should see "Currently Parked" card
   - Check-in time should show
8. **Check Out** → Tap "Check Out"
   - Card should disappear

### Test Real-Time Updates (Advanced)

**Need 2 devices/simulators OR use Supabase dashboard**

**Device 1:**
1. Open app to ResultsScreen
2. Note Lot 1A occupancy

**Supabase Dashboard:**
1. Go to SQL Editor
2. Run:
```sql
UPDATE parking_lots
SET current_occupancy = current_occupancy + 5
WHERE name = 'Lot 1A';
```

**Device 1:**
- Should update within 1-2 seconds!

## Common Test Scenarios

### Scenario 1: Student Looking for Parking
```
1. Open app
2. Quick Access → "Library"
3. Filter → "Student"
4. Check availability → Select green lot
5. Check in → Floor 2, Spot A4
```

### Scenario 2: Check Multiple Lots
```
1. Browse All Parking Lots
2. Compare availability %
3. Look for green (< 60%)
4. Avoid red (> 85%)
```

### Scenario 3: Weekly Tracking
```
1. Check in Monday
2. Check out Monday
3. Check in Tuesday
4. Repeat 5 times
5. View weekly stats → Should show "parking pro"
```

## Test Utilities Quick Reference

### From Dev Test Screen:
- **Test Connection** - Verify Supabase works
- **Verify Tables** - Check all tables exist
- **Show Stats** - View all parking data
- **Test Check-in** - Auto check-in to available lot
- **Test Full Flow** - Check-in then auto check-out
- **Add 5 to Lot 1A** - Increase occupancy
- **Remove 5 from Lot 1A** - Decrease occupancy
- **Reset All Check-ins** - Clear everything ⚠️

### From Console:
```javascript
// Connection
TestHelpers.testDatabaseConnection()
TestHelpers.verifyDatabaseSetup()

// User Flow
TestHelpers.quickTestCheckin()
TestHelpers.testFullParkingFlow()

// Data Simulation
TestHelpers.simulateOccupancyChange('Lot 1A', 5)
TestHelpers.createBulkTestCheckins('Garage A', 10)

// Stats & Info
TestHelpers.getParkingStats()

// Cleanup
TestHelpers.resetAllCheckins()
```

## Troubleshooting

### "Database connection failed"
```bash
# Check your .env.local:
cat .env.local

# Should show:
EXPO_PUBLIC_SUPABASE_URL=https://ekwtyszfxrhsyomkwrbo.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### "No parking lots showing"
```sql
-- Run in Supabase SQL Editor:
SELECT COUNT(*) FROM parking_lots;
-- Should return: 10

-- If 0, run seed.sql again
```

### "Check-in not saving"
1. Check: Anonymous auth is enabled
2. Check: RLS policies exist (they're in schema.sql)
3. Try: Reset app and sign in again

### "Real-time not working"
1. Check: Realtime is enabled in Supabase
2. Try: Refresh the screen
3. Check: Network connection

## What to Look For

### ✅ Good Signs:
- App loads in < 2 seconds
- Search is instant
- Check-in saves immediately
- Real-time updates within 1-2 seconds
- Stats are accurate
- No error messages

### ⚠️ Warning Signs:
- Long loading times
- Error messages
- Data not updating
- Check-ins not saving
- Stats don't match reality

### 🔧 Debug Tips:
1. Check console logs (detailed output)
2. Use Dev Test Screen tests
3. Verify data in Supabase dashboard
4. Test on real device (not just simulator)
5. Check network in airplane mode

## Next Steps After Testing

1. ✅ All tests pass? → Start building features!
2. ⚠️ Some tests fail? → Check TESTING_GUIDE.md
3. 🐛 Found bugs? → Use test helpers to debug
4. 🚀 Ready for users? → Remove DevTestScreen

## Remember!

- **Remove DevTestScreen before production** 🚨
- **Remove test button from HomeScreen** 🚨
- **Test on real device** - Simulators hide some issues
- **Test with slow network** - Enable network throttling
- **Test with multiple users** - Borrow a friend's phone

Happy Testing! 🎉

---

**Need more detailed testing?** → See `TESTING_GUIDE.md`

**Need integration help?** → See `INTEGRATION_EXAMPLE.md`

**Need setup help?** → See `SUPABASE_SETUP.md`
