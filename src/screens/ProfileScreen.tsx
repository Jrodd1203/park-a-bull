import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/ui/Card';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, OPACITY } from '../../constants/theme';

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}

function SettingItem({
  icon,
  label,
  value,
  onPress,
  showChevron = true,
  isSwitch = false,
  switchValue = false,
  onSwitchChange,
}: SettingItemProps) {
  return (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={isSwitch || !onPress}
      activeOpacity={OPACITY.pressed}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon} size={20} color={COLORS.primary} />
        </View>
        <Text style={styles.settingLabel}>{label}</Text>
      </View>

      <View style={styles.settingRight}>
        {isSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: COLORS.surfaceLight, true: COLORS.primary }}
            thumbColor='#FFF'
          />
        ) : (
          <>
            {value && <Text style={styles.settingValue}>{value}</Text>}
            {showChevron && (
              <Ionicons name='chevron-forward' size={20} color={COLORS.textTertiary} />
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* User Profile Card */}
        <View style={styles.section}>
          <Card variant="elevated" padding="lg">
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Ionicons name='person' size={40} color={COLORS.primary} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.userName}>Student User</Text>
                <Text style={styles.userEmail}>student@usf.edu</Text>
              </View>
              <TouchableOpacity
                style={styles.editButton}
                activeOpacity={OPACITY.pressed}
              >
                <Ionicons name='create-outline' size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* Permit Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Permits</Text>
          <Card variant="elevated" padding="lg">
            <View style={styles.permitCard}>
              <View style={styles.permitHeader}>
                <View style={styles.permitBadge}>
                  <Text style={styles.permitType}>S</Text>
                </View>
                <View style={styles.permitInfo}>
                  <Text style={styles.permitTitle}>Student Commuter</Text>
                  <Text style={styles.permitExpiry}>Valid until May 2025</Text>
                </View>
              </View>

              <View style={styles.permitDivider} />

              <View style={styles.permitDetails}>
                <View style={styles.permitDetailItem}>
                  <Text style={styles.permitDetailLabel}>Permit ID</Text>
                  <Text style={styles.permitDetailValue}>SC-2024-1234</Text>
                </View>
                <View style={styles.permitDetailItem}>
                  <Text style={styles.permitDetailLabel}>Vehicle</Text>
                  <Text style={styles.permitDetailValue}>Honda Civic</Text>
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Card variant="elevated" padding="none">
            <SettingItem
              icon='notifications-outline'
              label='Notifications'
              isSwitch
              switchValue={notifications}
              onSwitchChange={setNotifications}
            />
            <View style={styles.divider} />
            <SettingItem
              icon='location-outline'
              label='Location Services'
              isSwitch
              switchValue={locationServices}
              onSwitchChange={setLocationServices}
            />
            <View style={styles.divider} />
            <SettingItem
              icon='moon-outline'
              label='Dark Mode'
              isSwitch
              switchValue={darkMode}
              onSwitchChange={setDarkMode}
            />
          </Card>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <Card variant="elevated" padding="none">
            <SettingItem
              icon='car-outline'
              label='Default Permit'
              value='Student Commuter'
            />
            <View style={styles.divider} />
            <SettingItem
              icon='navigate-outline'
              label='Preferred Parking'
              value='Closest to destination'
            />
            <View style={styles.divider} />
            <SettingItem
              icon='time-outline'
              label='Reminder Before Expiry'
              value='1 week'
            />
          </Card>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <Card variant="elevated" padding="none">
            <SettingItem
              icon='help-circle-outline'
              label='Help & FAQ'
            />
            <View style={styles.divider} />
            <SettingItem
              icon='mail-outline'
              label='Contact Support'
            />
            <View style={styles.divider} />
            <SettingItem
              icon='document-text-outline'
              label='Terms & Privacy'
            />
          </Card>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Card variant="elevated" padding="none">
            <SettingItem
              icon='information-circle-outline'
              label='App Version'
              value='1.0.0'
              showChevron={false}
            />
          </Card>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.signOutButton}
            activeOpacity={OPACITY.pressed}
          >
            <Ionicons name='log-out-outline' size={20} color={COLORS.error} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xxxl,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.display,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.base,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permitCard: {},
  permitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  permitBadge: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  permitType: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: '#000',
  },
  permitInfo: {
    flex: 1,
  },
  permitTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  permitExpiry: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  permitDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.base,
  },
  permitDetails: {
    gap: SPACING.sm,
  },
  permitDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  permitDetailLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  permitDetailValue: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  settingLabel: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  settingValue: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginLeft: 60,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${COLORS.error}15`,
    paddingVertical: SPACING.base,
    borderRadius: BORDER_RADIUS.button,
    gap: SPACING.sm,
  },
  signOutText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.error,
  },
});
