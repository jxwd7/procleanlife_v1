import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

// Mock data - replace with real data from your Redux store
const mockUser = {
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  phone: '+1 (555) 123-4567',
  role: 'customer' as 'customer' | 'cleaner',
  isVerified: true,
  profilePicture: null,
  location: 'New York, NY',
  memberSince: 'January 2024',
  totalJobs: 12,
  totalEarnings: 0,
  reliabilityScore: 0,
  averageRating: 0,
};

const mockSettings = [
  {
    id: 'notifications',
    title: 'Push Notifications',
    subtitle: 'Get notified about new jobs and messages',
    icon: 'notifications',
    type: 'toggle',
    value: true,
  },
  {
    id: 'location',
    title: 'Location Services',
    subtitle: 'Allow access to your location for nearby jobs',
    icon: 'location',
    type: 'toggle',
    value: true,
  },
  {
    id: 'biometric',
    title: 'Biometric Login',
    subtitle: 'Use fingerprint or face ID to log in',
    icon: 'finger-print',
    type: 'toggle',
    value: false,
  },
  {
    id: 'darkMode',
    title: 'Dark Mode',
    subtitle: 'Switch between light and dark themes',
    icon: 'moon',
    type: 'toggle',
    value: false,
  },
];

const mockMenuItems = [
  {
    id: 'account',
    title: 'Account Settings',
    subtitle: 'Manage your account information',
    icon: 'person',
    type: 'link',
  },
  {
    id: 'payment',
    title: 'Payment Methods',
    subtitle: 'Manage your payment options',
    icon: 'card',
    type: 'link',
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    subtitle: 'Manage your security settings',
    icon: 'shield-checkmark',
    type: 'link',
  },
  {
    id: 'help',
    title: 'Help & Support',
    subtitle: 'Get help and contact support',
    icon: 'help-circle',
    type: 'link',
  },
  {
    id: 'about',
    title: 'About Sweep Logic',
    subtitle: 'Learn more about the app',
    icon: 'information-circle',
    type: 'link',
  },
];

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [settings, setSettings] = useState(mockSettings);

  const handleSettingToggle = (id: string, value: boolean) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.id === id ? { ...setting, value } : setting
      )
    );
  };

  const ProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.avatarSection}>
        <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
          <Text style={[styles.avatarText, { color: colors.background }]}>
            {mockUser.name.charAt(0)}
          </Text>
        </View>
        {mockUser.isVerified && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
          </View>
        )}
      </View>
      
      <View style={styles.profileInfo}>
        <Text style={[styles.userName, { color: colors.text }]}>
          {mockUser.name}
        </Text>
        <Text style={[styles.userEmail, { color: colors.icon }]}>
          {mockUser.email}
        </Text>
        <View style={styles.userStats}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {mockUser.totalJobs}
            </Text>
            <Text style={[styles.statLabel, { color: colors.icon }]}>
              {mockUser.role === 'customer' ? 'Jobs Posted' : 'Jobs Completed'}
            </Text>
          </View>
          {mockUser.role === 'cleaner' && (
            <>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  ${mockUser.totalEarnings}
                </Text>
                <Text style={[styles.statLabel, { color: colors.icon }]}>
                  Total Earnings
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {mockUser.reliabilityScore}
                </Text>
                <Text style={[styles.statLabel, { color: colors.icon }]}>
                  Reliability Score
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );

  const SettingItem = ({ item }: { item: typeof mockSettings[0] }) => (
    <View style={[styles.settingItem, { backgroundColor: colors.background }]}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, { backgroundColor: colors.tint + '20' }]}>
          <Ionicons name={item.icon as any} size={20} color={colors.tint} />
        </View>
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.settingSubtitle, { color: colors.icon }]}>
            {item.subtitle}
          </Text>
        </View>
      </View>
      {item.type === 'toggle' && (
        <Switch
          value={item.value}
          onValueChange={(value) => handleSettingToggle(item.id, value)}
          trackColor={{ false: colors.icon + '40', true: colors.tint + '40' }}
          thumbColor={item.value ? colors.tint : colors.icon}
        />
      )}
    </View>
  );

  const MenuItem = ({ item }: { item: typeof mockMenuItems[0] }) => (
    <TouchableOpacity 
      style={[styles.menuItem, { backgroundColor: colors.background }]}
      activeOpacity={0.8}
    >
      <View style={styles.menuLeft}>
        <View style={[styles.menuIcon, { backgroundColor: colors.tint + '20' }]}>
          <Ionicons name={item.icon as any} size={20} color={colors.tint} />
        </View>
        <View style={styles.menuContent}>
          <Text style={[styles.menuTitle, { color: colors.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.menuSubtitle, { color: colors.icon }]}>
            {item.subtitle}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.icon} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create" size={24} color={colors.tint} />
          </TouchableOpacity>
        </View>

        {/* Profile Header */}
        <ProfileHeader />

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
          <View style={styles.settingsContainer}>
            {settings.map((setting) => (
              <SettingItem key={setting.id} item={setting} />
            ))}
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
          <View style={styles.menuContainer}>
            {mockMenuItems.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </View>
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.logoutButton, { backgroundColor: '#ef444420' }]}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out" size={20} color="#ef4444" />
            <Text style={[styles.logoutText, { color: '#ef4444' }]}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.icon }]}>
            Sweep Logic v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Account for tab bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  editButton: {
    padding: 8,
  },
  profileHeader: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  avatarSection: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 16,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '400',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#e5e7eb',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingsContainer: {
    gap: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  menuContainer: {
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    fontWeight: '400',
  },
}); 