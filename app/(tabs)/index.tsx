import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

// Mock data - replace with real data from your Redux store
const mockUser = {
  name: 'Sarah',
  role: 'customer' as 'customer' | 'cleaner',
  isVerified: true,
  email: 'sarah@example.com',
  phone: '+1 (555) 123-4567',
};

interface CustomerData {
  totalJobsPosted: number;
  completedJobs: number;
  totalSpent: number;
  averageJobCost: number;
  savingsVsMarket: number;
  activeJobs: number;
  pendingOffers: number;
}

interface CleanerData {
  totalJobsCompleted: number;
  totalEarnings: number;
  averageJobEarning: number;
  reliabilityScore: number;
  winRate: number;
  averageResponseTime: string;
  activeJobs: number;
  availableJobs: number;
}

const mockCustomerData: CustomerData = {
  totalJobsPosted: 12,
  completedJobs: 8,
  totalSpent: 960,
  averageJobCost: 120,
  savingsVsMarket: 240,
  activeJobs: 2,
  pendingOffers: 3,
};

const mockCleanerData: CleanerData = {
  totalJobsCompleted: 45,
  totalEarnings: 3420,
  averageJobEarning: 76,
  reliabilityScore: 4.8,
  winRate: 67,
  averageResponseTime: '1.2 hours',
  activeJobs: 3,
  availableJobs: 24,
};

const mockRecentJobs = [
  {
    id: '1',
    title: 'Deep Clean - 2BR Apartment',
    status: 'completed',
    date: '2024-01-15',
    amount: 120,
    cleaner: 'Maria S.',
    rating: 5,
  },
  {
    id: '2',
    title: 'Regular Cleaning - House',
    status: 'in_progress',
    date: '2024-01-20',
    amount: 85,
    cleaner: 'John D.',
    rating: null,
  },
  {
    id: '3',
    title: 'Move-in Cleaning - Studio',
    status: 'pending_offers',
    date: '2024-01-22',
    amount: null,
    cleaner: null,
    offers: 4,
  },
];

const mockMarketInsights = {
  averageRate: 95,
  jobsAvailable: 24,
  responseTime: '2.3 hours',
  successRate: '94%',
  topEarningAreas: ['Downtown', 'Midtown', 'Suburbs'],
  peakHours: '9 AM - 2 PM',
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [userRole, setUserRole] = useState<'customer' | 'cleaner'>(mockUser.role);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');

  const isCustomer = userRole === 'customer';
  const userData = isCustomer ? mockCustomerData : mockCleanerData;

  const handleRoleSwitch = () => {
    Alert.alert(
      'Switch Role',
      `Are you sure you want to switch to ${isCustomer ? 'cleaner' : 'customer'} mode?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Switch', 
          onPress: () => setUserRole(isCustomer ? 'cleaner' : 'customer') 
        },
      ]
    );
  };

  const QuickActionButton = ({ 
    title, 
    subtitle, 
    icon, 
    onPress, 
    color = '#3b82f6',
    badge 
  }: {
    title: string;
    subtitle: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    color?: string;
    badge?: number;
  }) => (
    <TouchableOpacity 
      style={[styles.quickActionButton, { backgroundColor: colors.background }]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.quickActionLeft}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <View style={styles.quickActionContent}>
          <Text style={[styles.quickActionTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.quickActionSubtitle, { color: colors.icon }]}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.quickActionRight}>
        {badge && (
          <View style={[styles.badge, { backgroundColor: colors.tint }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color={colors.icon} />
      </View>
    </TouchableOpacity>
  );

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    trend,
    icon 
  }: {
    title: string;
    value: string;
    subtitle?: string;
    trend?: 'up' | 'down' | 'neutral';
    icon?: keyof typeof Ionicons.glyphMap;
  }) => (
    <View style={[styles.statCard, { backgroundColor: colors.background }]}>
      {icon && (
        <View style={[styles.statIcon, { backgroundColor: colors.tint + '20' }]}>
          <Ionicons name={icon} size={16} color={colors.tint} />
        </View>
      )}
      <Text style={[styles.statTitle, { color: colors.icon }]}>{title}</Text>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      {subtitle && (
        <Text style={[styles.statSubtitle, { color: colors.icon }]}>{subtitle}</Text>
      )}
      {trend && (
        <View style={styles.trendContainer}>
          <Ionicons 
            name={trend === 'up' ? 'trending-up' : trend === 'down' ? 'trending-down' : 'remove'} 
            size={16} 
            color={trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : colors.icon} 
          />
        </View>
      )}
    </View>
  );

  const JobCard = ({ job }: { job: typeof mockRecentJobs[0] }) => (
    <TouchableOpacity 
      style={[styles.jobCard, { backgroundColor: colors.background }]}
      activeOpacity={0.8}
    >
      <View style={styles.jobHeader}>
        <Text style={[styles.jobTitle, { color: colors.text }]} numberOfLines={1}>
          {job.title}
        </Text>
        <View style={[
          styles.statusBadge, 
          { 
            backgroundColor: job.status === 'completed' ? '#10b98120' : 
                           job.status === 'in_progress' ? '#f59e0b20' : '#3b82f620' 
          }
        ]}>
          <Text style={[
            styles.statusText, 
            { 
              color: job.status === 'completed' ? '#10b981' : 
                     job.status === 'in_progress' ? '#f59e0b' : '#3b82f6' 
            }
          ]}>
            {job.status === 'completed' ? 'Completed' : 
             job.status === 'in_progress' ? 'In Progress' : `${job.offers} Offers`}
          </Text>
        </View>
      </View>
      
      <View style={styles.jobDetails}>
        <Text style={[styles.jobDate, { color: colors.icon }]}>
          {new Date(job.date).toLocaleDateString()}
        </Text>
        {job.amount && (
          <Text style={[styles.jobAmount, { color: colors.text }]}>
            ${job.amount}
          </Text>
        )}
      </View>

      {job.cleaner && (
        <View style={styles.cleanerInfo}>
          <Ionicons name="person" size={16} color={colors.icon} />
          <Text style={[styles.cleanerName, { color: colors.text }]}>
            {job.cleaner}
          </Text>
          {job.rating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#f59e0b" />
              <Text style={[styles.ratingText, { color: colors.text }]}>
                {job.rating}
              </Text>
            </View>
          )}
        </View>
      )}
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
        {/* Header with Role Switcher */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>
              Good morning, {mockUser.name}! 👋
            </Text>
            <Text style={[styles.subtitle, { color: colors.icon }]}>
              {isCustomer ? 'Ready to get your space cleaned?' : 'Ready to find your next job?'}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={[styles.roleSwitch, { backgroundColor: colors.tint + '20' }]}
              onPress={handleRoleSwitch}
            >
              <Ionicons name="swap-horizontal" size={16} color={colors.tint} />
              <Text style={[styles.roleText, { color: colors.tint }]}>
                {isCustomer ? 'Customer' : 'Cleaner'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton}>
              <Ionicons name="person-circle" size={40} color={colors.tint} />
              {mockUser.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            {isCustomer ? (
              <>
                <QuickActionButton
                  title="Post a Job"
                  subtitle="Get quotes from cleaners"
                  icon="add-circle"
                  color="#3b82f6"
                  onPress={() => console.log('Post job')}
                />
                <QuickActionButton
                  title="My Jobs"
                  subtitle="View your active jobs"
                  icon="list"
                  color="#10b981"
                  onPress={() => console.log('My jobs')}
                  badge={userData.activeJobs}
                />
                <QuickActionButton
                  title="View Offers"
                  subtitle="Review cleaner proposals"
                  icon="document-text"
                  color="#f59e0b"
                  onPress={() => console.log('View offers')}
                  badge={isCustomer ? mockCustomerData.pendingOffers : undefined}
                />
                <QuickActionButton
                  title="Payments"
                  subtitle="Manage your payments"
                  icon="card"
                  color="#8b5cf6"
                  onPress={() => console.log('Payments')}
                />
              </>
            ) : (
              <>
                <QuickActionButton
                  title="Browse Jobs"
                  subtitle="Find cleaning opportunities"
                  icon="search"
                  color="#3b82f6"
                  onPress={() => console.log('Browse jobs')}
                  badge={!isCustomer ? mockCleanerData.availableJobs : undefined}
                />
                <QuickActionButton
                  title="My Work"
                  subtitle="View your assignments"
                  icon="briefcase"
                  color="#10b981"
                  onPress={() => console.log('My work')}
                  badge={userData.activeJobs}
                />
                <QuickActionButton
                  title="Earnings"
                  subtitle="Track your income"
                  icon="trending-up"
                  color="#f59e0b"
                  onPress={() => console.log('Earnings')}
                />
                <QuickActionButton
                  title="Schedule"
                  subtitle="Manage your calendar"
                  icon="calendar"
                  color="#8b5cf6"
                  onPress={() => console.log('Schedule')}
                />
              </>
            )}
          </View>
        </View>

        {/* Analytics Dashboard */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {isCustomer ? 'Your Activity' : 'Market Insights'}
          </Text>
          <View style={styles.statsGrid}>
            {isCustomer ? (
              <>
                <StatCard
                  title="Jobs Posted"
                  value={mockCustomerData.totalJobsPosted.toString()}
                  subtitle="total"
                  icon="add-circle"
                  trend="up"
                />
                <StatCard
                  title="Completed"
                  value={mockCustomerData.completedJobs.toString()}
                  subtitle="jobs"
                  icon="checkmark-circle"
                />
                <StatCard
                  title="Total Spent"
                  value={`$${mockCustomerData.totalSpent}`}
                  subtitle="lifetime"
                  icon="card"
                />
                <StatCard
                  title="Savings"
                  value={`$${mockCustomerData.savingsVsMarket}`}
                  subtitle="vs market"
                  icon="trending-down"
                  trend="up"
                />
              </>
            ) : (
              <>
                <StatCard
                  title="Avg. Rate"
                  value={`$${mockMarketInsights.averageRate}`}
                  subtitle="per job"
                  icon="cash"
                  trend="up"
                />
                <StatCard
                  title="Jobs Available"
                  value={mockMarketInsights.jobsAvailable.toString()}
                  subtitle="in your area"
                  icon="briefcase"
                />
                <StatCard
                  title="Response Time"
                  value={mockMarketInsights.responseTime}
                  subtitle="average"
                  icon="time"
                  trend="down"
                />
                <StatCard
                  title="Success Rate"
                  value={mockMarketInsights.successRate}
                  subtitle="of your offers"
                  icon="trophy"
                  trend="up"
                />
              </>
            )}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.tint }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.jobsContainer}>
            {mockRecentJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <View style={[styles.tipsCard, { backgroundColor: colors.tint + '10' }]}>
            <Ionicons name="bulb" size={24} color={colors.tint} />
            <View style={styles.tipsContent}>
              <Text style={[styles.tipsTitle, { color: colors.text }]}>
                {isCustomer ? 'Pro Tip' : 'Earning Tip'}
              </Text>
              <Text style={[styles.tipsText, { color: colors.icon }]}>
                {isCustomer 
                  ? 'Be specific about your cleaning needs to get more accurate quotes from cleaners.'
                  : 'Respond quickly to job requests - customers prefer cleaners who respond within 2 hours.'
                }
              </Text>
            </View>
          </View>
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
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 12,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  roleSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  profileButton: {
    position: 'relative',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  quickActionsContainer: {
    gap: 12,
  },
  quickActionButton: {
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
  quickActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  quickActionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 52) / 2, // Account for padding and gap
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
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    fontWeight: '400',
  },
  trendContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  jobsContainer: {
    gap: 12,
  },
  jobCard: {
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
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  jobDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobDate: {
    fontSize: 14,
    fontWeight: '400',
  },
  jobAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  cleanerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cleanerName: {
    fontSize: 14,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '500',
  },
  tipsCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  tipsContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  tipsText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
});
