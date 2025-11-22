# Complete Testing Setup - Park-a-Bull

Everything you need to test your parking app end-to-end! 🚗

## 📚 Documentation Overview

| Document | Purpose | Time |
|----------|---------|------|
| **QUICK_START_TESTING.md** | Get testing in 5 minutes | 5 min |
| **TESTING_GUIDE.md** | Comprehensive testing scenarios | 30 min |
| **SUPABASE_SETUP.md** | Database setup & API usage | 10 min |
| **INTEGRATION_EXAMPLE.md** | Code examples for screens | 15 min |

## 🚀 Fastest Path to Testing (5 Minutes)

### 1. Database Setup (2 min)
```bash
# In Supabase SQL Editor:
# 1. Run: supabase/schema.sql
# 2. Run: supabase/seed.sql
```

### 2. Enable Anonymous Auth (1 min)
```
Supabase → Authentication → Settings → Enable Anonymous sign-ins
```

### 3. Add Dev Test Screen (2 min)
```typescript
// AppNavigator.tsx
import DevTestScreen from '../screens/DevTestScreen';

// Add to type:
DevTest: undefined;

// Add screen:
<Stack.Screen name="DevTest" component={DevTestScreen} />
```

### 4. Test! (30 sec)
```
1. Launch app
2. Navigate to Dev Tests
3. Run "Test Connection"
4. Run "Test Check-in"
✅ Done!
```

## 🧪 What You Can Test

### Automated Tests (via DevTestScreen)
✅ Database connection
✅ Table verification
✅ Parking statistics
✅ Quick check-in flow
✅ Full check-in/check-out cycle
✅ Occupancy simulation
✅ Bulk data generation

### Manual User Flows
✅ Search for buildings
✅ Filter by permit type
✅ View parking availability
✅ Check in to parking lot
✅ View active parking status
✅ Check out from lot
✅ Weekly statistics tracking
✅ Real-time updates

### Advanced Testing
✅ Multi-device real-time sync
✅ Network error handling
✅ Edge cases (full lots, etc.)
✅ Performance benchmarks
✅ Load testing

## 📂 Files Created for You

### Database Files
- `supabase/schema.sql` - Database structure
- `supabase/seed.sql` - Initial test data

### Service Layer
- `src/services/authService.ts` - Authentication
- `src/services/parkingService.ts` - Parking lots + real-time
- `src/services/buildingService.ts` - Campus buildings
- `src/services/checkinService.ts` - Check-in/out system
- `src/services/profileService.ts` - User profiles
- `src/services/index.ts` - Export all services

### React Hooks
- `src/hooks/useAuth.ts` - Auth state management
- `src/hooks/useParkingLots.ts` - Parking data + subscriptions
- `src/hooks/useCheckin.ts` - Active check-in tracking

### Testing Utilities
- `src/utils/testHelpers.ts` - Test functions
- `src/screens/DevTestScreen.tsx` - Visual test panel
- `src/types/database.ts` - TypeScript types

### Documentation
- `QUICK_START_TESTING.md` - 5-minute quick start
- `TESTING_GUIDE.md` - Complete testing scenarios
- `SUPABASE_SETUP.md` - Database & API setup
- `INTEGRATION_EXAMPLE.md` - Code integration examples

## 🎯 Testing Checklist

### Before You Start
- [ ] Supabase project created
- [ ] Environment variables set
- [ ] schema.sql executed
- [ ] seed.sql executed
- [ ] Anonymous auth enabled

### Core Functionality
- [ ] App launches without errors
- [ ] Database connection works
- [ ] All tables verified
- [ ] Parking lots load
- [ ] Buildings load
- [ ] Search works
- [ ] Filters work
- [ ] Maps display correctly

### User Flows
- [ ] Anonymous sign-in
- [ ] Check-in to lot
- [ ] Active parking displays
- [ ] Check-out works
- [ ] Weekly stats update
- [ ] Real-time updates work

### Edge Cases
- [ ] Full lot handling
- [ ] No results handling
- [ ] Network errors
- [ ] Invalid data
- [ ] Rapid check-in/out

### Performance
- [ ] Load time < 2 seconds
- [ ] Search instant
- [ ] Check-in < 1 second
- [ ] Real-time < 2 seconds

## 🛠️ Common Commands

### Test from Console
```javascript
// Quick test
TestHelpers.quickTestCheckin()

// Full flow
TestHelpers.testFullParkingFlow()

// Get stats
TestHelpers.getParkingStats()

// Simulate busy parking
TestHelpers.createBulkTestCheckins('Garage A', 20)

// Reset everything
TestHelpers.resetAllCheckins()
```

### SQL Queries (Supabase)
```sql
-- Check data
SELECT COUNT(*) FROM parking_lots;  -- Should be 10
SELECT COUNT(*) FROM buildings;     -- Should be 6

-- View occupancy
SELECT name, current_occupancy, capacity,
       ROUND(current_occupancy::numeric / capacity * 100, 1) as pct
FROM parking_lots
ORDER BY pct DESC;

-- Active check-ins
SELECT * FROM checkins WHERE status = 'active';

-- Reset occupancy
UPDATE parking_lots SET current_occupancy = 0;
DELETE FROM checkins;
```

## 🎓 Test Scenarios

### Scenario 1: New Student
```
Goal: First-time user finds parking near Library

1. Launch app (auto sign-in)
2. Search "library"
3. Filter "Student"
4. Select available lot (green)
5. Check in
6. Verify "Currently Parked" shows
7. Check out
```

### Scenario 2: Faculty Member
```
Goal: Faculty needs parking near Business Building

1. Browse all lots
2. Filter "Faculty"
3. Find lot near BSN building
4. View on map
5. Get directions
6. Check in
```

### Scenario 3: Resident
```
Goal: Track parking over a week

Day 1-5: Check in different lots
Each day: Check out when leaving
Day 5: View stats → "parking pro"
```

### Scenario 4: Busy Campus
```
Goal: Find parking when most lots full

1. Browse all lots
2. Sort by availability
3. Look for green status
4. Avoid red (full) lots
5. Check in to available spot
```

## 📊 Expected Test Data

### Parking Lots (10 total)
- **Lots**: 1A, 2B, 3C, 4D, 5E, 6F, 7G, 8H
- **Garages**: A (5 floors), B (6 floors)
- **Total Capacity**: 2,580 spots
- **Current Occupancy**: ~1,275 (varies)

### Buildings (6 total)
- Library (LIB)
- Marshall Student Center (MSC)
- Recreation Center (REC)
- Business Building (BSN)
- Engineering Building (ENG)
- Science Center (ISA)

### Permit Types
- S - Student
- R - Resident
- E - Faculty/Staff
- Y - Commuter
- V - Visitor
- D - Disabled

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Connection failed | Check .env.local has correct keys |
| No data showing | Run seed.sql in Supabase |
| Check-in fails | Enable anonymous auth |
| Real-time broken | Check Realtime enabled in Supabase |
| Slow performance | Check network connection |

## ✅ Success Criteria

Your app is working if:
1. ✅ Connects to Supabase
2. ✅ Shows 10 parking lots
3. ✅ Search finds buildings
4. ✅ Filters work correctly
5. ✅ Check-in saves to database
6. ✅ Active parking displays
7. ✅ Check-out removes status
8. ✅ Real-time updates work
9. ✅ Stats are accurate
10. ✅ No console errors

## 🚨 Before Production

Remember to:
- [ ] Remove DevTestScreen from navigator
- [ ] Remove dev button from HomeScreen
- [ ] Remove test imports from production files
- [ ] Test on real devices
- [ ] Test with slow network
- [ ] Test with multiple users
- [ ] Add proper error handling
- [ ] Add loading states
- [ ] Add user feedback
- [ ] Test edge cases

## 📖 Next Steps

1. **Complete testing** using QUICK_START_TESTING.md
2. **Fix any issues** found during testing
3. **Integrate services** into screens (INTEGRATION_EXAMPLE.md)
4. **Add features** (notifications, favorites, etc.)
5. **Polish UI/UX** based on testing feedback
6. **Prepare for deployment**

## 🆘 Need Help?

- **Quick test not working?** → See QUICK_START_TESTING.md
- **Want detailed scenarios?** → See TESTING_GUIDE.md
- **Need setup help?** → See SUPABASE_SETUP.md
- **Integration questions?** → See INTEGRATION_EXAMPLE.md
- **Supabase issues?** → Check their [documentation](https://supabase.com/docs)

---

**You're all set!** 🎉

Start with QUICK_START_TESTING.md and you'll be testing in 5 minutes!
