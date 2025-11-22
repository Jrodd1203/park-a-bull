/**
 * Test Helper Functions
 * Use these in development to quickly test different scenarios
 */

import { supabase } from '../../supabase';
import { signInAnonymously } from '../services/authService';
import { createCheckin, checkOut, getActiveCheckin } from '../services/checkinService';
import { getAllParkingLots } from '../services/parkingService';
import { getOrCreateProfile } from '../services/profileService';

/**
 * Quick test: Sign in and check in to a random lot
 */
export async function quickTestCheckin() {
  try {
    console.log('🧪 Starting quick test check-in...');

    // 1. Sign in anonymously
    const { user, error: authError } = await signInAnonymously();
    if (authError || !user) {
      console.error('❌ Auth failed:', authError);
      return;
    }
    console.log('✅ Signed in as:', user.id.slice(0, 8));

    // 2. Get or create profile
    const profile = await getOrCreateProfile(user.id, 'S - Student');
    console.log('✅ Profile ready:', profile.permit_type);

    // 3. Get parking lots
    const lots = await getAllParkingLots();
    console.log('✅ Found', lots.length, 'parking lots');

    // 4. Find a lot with availability
    const availableLot = lots.find(lot => lot.availableSpots > 10);
    if (!availableLot) {
      console.log('⚠️  No lots with availability');
      return;
    }
    console.log('✅ Selected:', availableLot.name);

    // 5. Check in
    const checkin = await createCheckin(
      user.id,
      availableLot.id,
      profile.permit_type,
      availableLot.type === 'garage' ? 2 : undefined,
      'A4'
    );
    console.log('✅ Checked in:', checkin.id.slice(0, 8));
    console.log('📍 Location:', availableLot.name, availableLot.type === 'garage' ? 'Floor 2, Spot A4' : 'Spot A4');

    // 6. Verify active check-in
    const active = await getActiveCheckin(user.id);
    if (active) {
      console.log('✅ Active check-in confirmed');
      console.log('📊 Status:', active.status);
      console.log('⏰ Checked in at:', new Date(active.checked_in_at).toLocaleTimeString());
    }

    console.log('🎉 Quick test completed successfully!');
    return { user, profile, checkin, lot: availableLot };
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

/**
 * Test: Complete check-in/check-out flow
 */
export async function testFullParkingFlow() {
  try {
    console.log('🧪 Testing full parking flow...');

    // Check in
    const result = await quickTestCheckin();
    if (!result) return;

    // Wait a few seconds
    console.log('⏳ Waiting 3 seconds...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Check out
    const active = await getActiveCheckin(result.user.id);
    if (active) {
      await checkOut(active.id);
      console.log('✅ Checked out successfully');
    }

    console.log('🎉 Full flow test completed!');
  } catch (error) {
    console.error('❌ Flow test failed:', error);
    throw error;
  }
}

/**
 * Simulate occupancy changes for testing real-time updates
 */
export async function simulateOccupancyChange(lotName: string, delta: number) {
  try {
    const { data, error } = await supabase
      .from('parking_lots')
      .select('id, name, current_occupancy, capacity')
      .eq('name', lotName)
      .single();

    if (error) throw error;

    const newOccupancy = Math.max(
      0,
      Math.min(data.capacity, data.current_occupancy + delta)
    );

    await supabase
      .from('parking_lots')
      .update({ current_occupancy: newOccupancy })
      .eq('id', data.id);

    console.log(`📊 ${lotName}: ${data.current_occupancy} → ${newOccupancy} (${delta > 0 ? '+' : ''}${delta})`);
  } catch (error) {
    console.error('❌ Failed to update occupancy:', error);
    throw error;
  }
}

/**
 * Create multiple test check-ins to simulate busy parking
 */
export async function createBulkTestCheckins(lotName: string, count: number) {
  try {
    console.log(`🧪 Creating ${count} test check-ins for ${lotName}...`);

    // Get or create a test user
    const { user } = await signInAnonymously();
    if (!user) throw new Error('Failed to sign in');

    const profile = await getOrCreateProfile(user.id, 'S - Student');

    // Get the lot
    const { data: lot, error } = await supabase
      .from('parking_lots')
      .select('*')
      .eq('name', lotName)
      .single();

    if (error) throw error;

    // Create check-ins
    const checkins = [];
    for (let i = 0; i < count; i++) {
      const checkin = await createCheckin(
        user.id,
        lot.id,
        profile.permit_type,
        lot.type === 'garage' ? Math.floor(Math.random() * (lot.floors || 1)) + 1 : undefined
      );
      checkins.push(checkin);
      console.log(`✅ Check-in ${i + 1}/${count} created`);
    }

    console.log(`🎉 Created ${checkins.length} check-ins`);
    return checkins;
  } catch (error) {
    console.error('❌ Bulk check-in failed:', error);
    throw error;
  }
}

/**
 * Get current parking statistics
 */
export async function getParkingStats() {
  try {
    const lots = await getAllParkingLots();

    const stats = {
      totalLots: lots.length,
      totalCapacity: lots.reduce((sum, lot) => sum + lot.capacity, 0),
      totalOccupied: lots.reduce((sum, lot) => sum + lot.current_occupancy, 0),
      totalAvailable: lots.reduce((sum, lot) => sum + lot.availableSpots, 0),
      byStatus: {
        available: lots.filter(l => l.status === 'available').length,
        limited: lots.filter(l => l.status === 'limited').length,
        full: lots.filter(l => l.status === 'full').length,
      },
      byType: {
        garage: lots.filter(l => l.type === 'garage').length,
        lot: lots.filter(l => l.type === 'lot').length,
      },
    };

    console.log('📊 Parking Statistics:');
    console.log('  Total Lots:', stats.totalLots);
    console.log('  Total Capacity:', stats.totalCapacity);
    console.log('  Total Occupied:', stats.totalOccupied, `(${((stats.totalOccupied / stats.totalCapacity) * 100).toFixed(1)}%)`);
    console.log('  Total Available:', stats.totalAvailable);
    console.log('  By Status:', stats.byStatus);
    console.log('  By Type:', stats.byType);

    return stats;
  } catch (error) {
    console.error('❌ Failed to get stats:', error);
    throw error;
  }
}

/**
 * Reset all check-ins (for testing)
 * WARNING: This deletes all check-ins!
 */
export async function resetAllCheckins() {
  try {
    console.log('⚠️  Resetting all check-ins...');

    // Delete all check-ins
    const { error } = await supabase
      .from('checkins')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (error) throw error;

    // Reset all occupancy to 0
    const { error: updateError } = await supabase
      .from('parking_lots')
      .update({ current_occupancy: 0 })
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all

    if (updateError) throw updateError;

    console.log('✅ All check-ins cleared and occupancy reset');
  } catch (error) {
    console.error('❌ Reset failed:', error);
    throw error;
  }
}

/**
 * Test database connection
 */
export async function testDatabaseConnection() {
  try {
    console.log('🧪 Testing database connection...');

    const { data, error } = await supabase
      .from('parking_lots')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }

    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return false;
  }
}

/**
 * Verify all tables exist
 */
export async function verifyDatabaseSetup() {
  try {
    console.log('🧪 Verifying database setup...');

    const tables = ['buildings', 'parking_lots', 'profiles', 'checkins'];
    const results: Record<string, number> = {};

    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error(`❌ Table '${table}' check failed:`, error.message);
        results[table] = -1;
      } else {
        results[table] = count || 0;
        console.log(`✅ ${table}: ${count} rows`);
      }
    }

    const allTablesExist = Object.values(results).every(count => count >= 0);

    if (allTablesExist) {
      console.log('🎉 Database setup verified!');
      console.log('📊 Row counts:', results);
    } else {
      console.log('⚠️  Some tables are missing or inaccessible');
    }

    return results;
  } catch (error) {
    console.error('❌ Verification failed:', error);
    throw error;
  }
}

// Export all test functions
export const TestHelpers = {
  quickTestCheckin,
  testFullParkingFlow,
  simulateOccupancyChange,
  createBulkTestCheckins,
  getParkingStats,
  resetAllCheckins,
  testDatabaseConnection,
  verifyDatabaseSetup,
};
