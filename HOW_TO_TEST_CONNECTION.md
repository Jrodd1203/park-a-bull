# How to Test Your Supabase Connection

## ✅ Setup Complete!

I've added the DevTest screen to your app. Here's how to use it:

## 🚀 Step 1: Start Your App

```bash
npm start
```

Then press:
- **i** for iOS simulator
- **a** for Android emulator
- **w** for web browser
- Or scan QR code with Expo Go app on your phone

## 🧪 Step 2: Navigate to Dev Tests

On your HomeScreen, scroll down and tap the purple button that says:

**🧪 Developer Tests**

## ✅ Step 3: Run Tests

In the Dev Test screen, tap these buttons in order:

### 1️⃣ Test Connection
- Tap **"Test Connection"**
- ✅ Should see: Alert "Test Passed"
- ❌ If fails: Check your .env.local file

### 2️⃣ Verify Tables
- Tap **"Verify Tables"**
- ✅ Should see:
  - buildings: 6
  - parking_lots: 10
  - profiles: 0
  - checkins: 0

### 3️⃣ Show Stats
- Tap **"Show Stats"**
- ✅ Should see parking statistics in console/alert

### 4️⃣ Test Check-in
- Tap **"Test Check-in"**
- ✅ Should see: "Test Passed - Quick Check-in Test"
- This creates a test user and checks them in

### 5️⃣ Test Full Flow
- Tap **"Test Full Flow"**
- ✅ Should see: Check-in then auto check-out after 3 seconds

## 🎉 Success Indicators

If all tests pass, you'll see:
- ✅ Green checkmarks next to each test
- Success alert messages
- Test results showing in the list
- Console logs with detailed info

## 📱 What It Looks Like

```
🔌 Connection Tests
  ✅ Test Connection
  ✅ Verify Tables
  ✅ Show Stats

👤 User Flow Tests
  ✅ Test Check-in
  ✅ Test Full Flow

📋 Test Results
  ✅ Test Database Connection - Success
  ✅ Verify Database Setup - Success
    buildings: 6, parking_lots: 10, profiles: 0, checkins: 0
```

## 🐛 Troubleshooting

### "Database connection failed"
**Fix:**
```bash
# Check your environment file
cat .env.local

# Should show valid SUPABASE_URL and ANON_KEY
```

### "No parking lots showing"
**Fix:**
Run in Supabase SQL Editor:
```sql
SELECT COUNT(*) FROM parking_lots;
-- Should return 10
```

### "Permission denied"
**Fix:**
Enable anonymous auth in Supabase:
- Dashboard → Authentication → Settings
- Toggle "Anonymous sign-ins" ON

## 📊 What the Tests Do

| Test | What It Does |
|------|--------------|
| Test Connection | Verifies Supabase client is configured |
| Verify Tables | Counts rows in each table |
| Show Stats | Displays all parking lot stats |
| Test Check-in | Creates anonymous user + check-in |
| Test Full Flow | Full check-in/check-out cycle |

## 🎯 Next Steps After Tests Pass

1. ✅ All tests green? → Integration works!
2. 🔧 Try the simulation tests:
   - Add 5 to Lot 1A
   - Remove 5 from Lot 1A
   - Bulk Check-ins
3. 🚀 Start integrating services into your screens
4. 📱 Test manual user flows

## 🧹 Clean Up Tests

Run these cleanup tests when needed:
- **Clear Test Results** - Clears the test log
- **Reset All Check-ins** - ⚠️ Deletes all check-ins (use carefully!)

## 📖 Alternative: Console Testing

If you prefer, you can also test from browser console (if running on web):

```javascript
// Open browser console (F12) and run:
import { TestHelpers } from './src/utils/testHelpers';

await TestHelpers.testDatabaseConnection();
await TestHelpers.verifyDatabaseSetup();
await TestHelpers.getParkingStats();
```

## ⚠️ Important!

**Before deploying to production:**
1. Remove the DevTest screen from AppNavigator
2. Remove the "Developer Tests" button from HomeScreen
3. Remove the DevTestScreen import

The button and screen are marked with comments:
```typescript
// DEV TEST BUTTON - Remove before production!
```

---

**Ready to test?** Just run `npm start` and tap the purple "Developer Tests" button! 🚀
