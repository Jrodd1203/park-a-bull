/**
 * Developer Test Screen
 * Add this to your navigator temporarily for easy testing
 *
 * To use:
 * 1. Import in AppNavigator.tsx
 * 2. Add screen: <Stack.Screen name="DevTest" component={DevTestScreen} />
 * 3. Navigate from HomeScreen or add button
 * 4. Remove before production!
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/theme';
import { TestHelpers } from '../utils/testHelpers';

interface TestResult {
  name: string;
  status: 'idle' | 'running' | 'success' | 'error';
  message?: string;
}

export default function DevTestScreen() {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const runTest = async (
    name: string,
    testFn: () => Promise<any>,
    showAlert: boolean = true
  ) => {
    setLoading(true);
    const testIndex = tests.length;

    setTests(prev => [...prev, { name, status: 'running' }]);

    try {
      const result = await testFn();

      setTests(prev => {
        const updated = [...prev];
        updated[testIndex] = {
          name,
          status: 'success',
          message: typeof result === 'string' ? result : 'Success'
        };
        return updated;
      });

      if (showAlert) {
        Alert.alert('✅ Test Passed', name);
      }
    } catch (error: any) {
      setTests(prev => {
        const updated = [...prev];
        updated[testIndex] = {
          name,
          status: 'error',
          message: error.message
        };
        return updated;
      });

      Alert.alert('❌ Test Failed', `${name}\n\n${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTests([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="flask" size={32} color={COLORS.primary} />
        <Text style={styles.title}>Developer Test Panel</Text>
        <Text style={styles.subtitle}>Quick testing utilities</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Connection Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔌 Connection Tests</Text>

          <TouchableOpacity
            style={styles.testButton}
            onPress={() => runTest(
              'Test Database Connection',
              TestHelpers.testDatabaseConnection
            )}
            disabled={loading}
          >
            <Ionicons name="wifi" size={20} color={COLORS.primary} />
            <Text style={styles.buttonText}>Test Connection</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.testButton}
            onPress={() => runTest(
              'Verify Database Setup',
              TestHelpers.verifyDatabaseSetup
            )}
            disabled={loading}
          >
            <Ionicons name="checkmark-done" size={20} color={COLORS.primary} />
            <Text style={styles.buttonText}>Verify Tables</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.testButton}
            onPress={() => runTest(
              'Get Parking Stats',
              TestHelpers.getParkingStats
            )}
            disabled={loading}
          >
            <Ionicons name="stats-chart" size={20} color={COLORS.primary} />
            <Text style={styles.buttonText}>Show Stats</Text>
          </TouchableOpacity>
        </View>

        {/* User Flow Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 User Flow Tests</Text>

          <TouchableOpacity
            style={styles.testButton}
            onPress={() => runTest(
              'Quick Check-in Test',
              TestHelpers.quickTestCheckin
            )}
            disabled={loading}
          >
            <Ionicons name="enter" size={20} color={COLORS.primary} />
            <Text style={styles.buttonText}>Test Check-in</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.testButton}
            onPress={() => runTest(
              'Full Parking Flow',
              TestHelpers.testFullParkingFlow
            )}
            disabled={loading}
          >
            <Ionicons name="swap-horizontal" size={20} color={COLORS.primary} />
            <Text style={styles.buttonText}>Test Full Flow</Text>
          </TouchableOpacity>
        </View>

        {/* Data Manipulation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎲 Data Simulation</Text>

          <TouchableOpacity
            style={styles.testButton}
            onPress={() => runTest(
              'Simulate Occupancy +5',
              () => TestHelpers.simulateOccupancyChange('Lot 1A', 5),
              false
            )}
            disabled={loading}
          >
            <Ionicons name="add-circle" size={20} color={COLORS.primary} />
            <Text style={styles.buttonText}>Add 5 to Lot 1A</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.testButton}
            onPress={() => runTest(
              'Simulate Occupancy -5',
              () => TestHelpers.simulateOccupancyChange('Lot 1A', -5),
              false
            )}
            disabled={loading}
          >
            <Ionicons name="remove-circle" size={20} color={COLORS.primary} />
            <Text style={styles.buttonText}>Remove 5 from Lot 1A</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.testButton}
            onPress={() => runTest(
              'Create 10 Test Check-ins',
              () => TestHelpers.createBulkTestCheckins('Garage A', 10)
            )}
            disabled={loading}
          >
            <Ionicons name="people" size={20} color={COLORS.primary} />
            <Text style={styles.buttonText}>Bulk Check-ins (Garage A)</Text>
          </TouchableOpacity>
        </View>

        {/* Cleanup */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧹 Cleanup</Text>

          <TouchableOpacity
            style={[styles.testButton, styles.dangerButton]}
            onPress={() => {
              Alert.alert(
                'Reset All Check-ins?',
                'This will delete all check-ins and reset occupancy to 0. This cannot be undone!',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: () => runTest(
                      'Reset All Check-ins',
                      TestHelpers.resetAllCheckins
                    ),
                  },
                ]
              );
            }}
            disabled={loading}
          >
            <Ionicons name="trash" size={20} color="#EF4444" />
            <Text style={[styles.buttonText, styles.dangerText]}>Reset All Check-ins</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.testButton}
            onPress={clearResults}
            disabled={loading}
          >
            <Ionicons name="close-circle" size={20} color={COLORS.primary} />
            <Text style={styles.buttonText}>Clear Test Results</Text>
          </TouchableOpacity>
        </View>

        {/* Test Results */}
        {tests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Test Results</Text>
            {tests.map((test, index) => (
              <View key={index} style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  {test.status === 'running' && (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  )}
                  {test.status === 'success' && (
                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  )}
                  {test.status === 'error' && (
                    <Ionicons name="close-circle" size={20} color="#EF4444" />
                  )}
                  <Text style={styles.resultName}>{test.name}</Text>
                </View>
                {test.message && (
                  <Text style={styles.resultMessage}>{test.message}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ Instructions</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              1. Make sure you've run schema.sql and seed.sql in Supabase{'\n'}
              2. Enable anonymous sign-ins in Supabase settings{'\n'}
              3. Check console logs for detailed output{'\n'}
              4. Remove this screen before production!
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.base,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  buttonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
  },
  dangerButton: {
    backgroundColor: '#FEE2E2',
  },
  dangerText: {
    color: '#EF4444',
  },
  resultCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.base,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  resultName: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
    flex: 1,
  },
  resultMessage: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    marginLeft: 28,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.base,
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  infoText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.fontSize.sm * 1.6,
  },
});
