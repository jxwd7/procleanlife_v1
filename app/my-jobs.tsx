import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Linking,
    Modal,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

interface Job {
  id: string;
  title: string;
  serviceType: string;
  status: 'active' | 'scheduled' | 'pending_offers' | 'completed' | 'cancelled';
  location: string;
  area: string;
  scheduledDate?: string;
  scheduledTime?: string;
  price: number;
  recurrence: 'once' | 'weekly' | 'bi-weekly' | 'monthly';
  propertyDetails: {
    bedrooms: number;
    bathrooms: number;
    propertyType: string;
  };
  additionalNotes?: string;
  supplies: 'customer' | 'cleaner' | 'both';
  cleaner?: {
    id: string;
    name: string;
    rating: number;
    phone: string;
    avatar?: string;
  };
  offersCount?: number;
  postedDate: string;
}

// Mock data - replace with real data from your Redux store/API
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Deep Clean - 3BR Apartment',
    serviceType: 'Deep Cleaning',
    status: 'active',
    location: '123 Oak Street, Downtown',
    area: 'Downtown',
    scheduledDate: '2024-06-25',
    scheduledTime: '10:00 AM',
    price: 150,
    recurrence: 'once',
    propertyDetails: {
      bedrooms: 3,
      bathrooms: 2,
      propertyType: 'Apartment'
    },
    additionalNotes: 'Focus on kitchen and bathrooms. Pet-friendly products preferred.',
    supplies: 'cleaner',
    cleaner: {
      id: 'c1',
      name: 'Maria S.',
      rating: 4.9,
      phone: '+1-555-0123'
    },
    postedDate: '2024-06-20'
  },
  {
    id: '2',
    title: 'Regular Clean - House',
    serviceType: 'Regular Cleaning',
    status: 'scheduled',
    location: '456 Pine Ave, Midtown',
    area: 'Midtown',
    scheduledDate: '2024-06-26',
    scheduledTime: '2:00 PM',
    price: 120,
    recurrence: 'weekly',
    propertyDetails: {
      bedrooms: 4,
      bathrooms: 3,
      propertyType: 'House'
    },
    supplies: 'both',
    cleaner: {
      id: 'c2',
      name: 'John D.',
      rating: 4.8,
      phone: '+1-555-0124'
    },
    postedDate: '2024-06-18'
  },
  {
    id: '3',
    title: 'Move-out Cleaning - Studio',
    serviceType: 'Move-out Cleaning',
    status: 'pending_offers',
    location: '789 Elm St, Suburbs',
    area: 'Suburbs',
    price: 85,
    recurrence: 'once',
    propertyDetails: {
      bedrooms: 0,
      bathrooms: 1,
      propertyType: 'Studio'
    },
    supplies: 'cleaner',
    offersCount: 4,
    postedDate: '2024-06-22'
  },
  {
    id: '4',
    title: 'Office Cleaning - Small Office',
    serviceType: 'Office Cleaning',
    status: 'completed',
    location: '321 Business Blvd, Downtown',
    area: 'Downtown',
    price: 200,
    recurrence: 'monthly',
    propertyDetails: {
      bedrooms: 0,
      bathrooms: 1,
      propertyType: 'Office'
    },
    supplies: 'cleaner',
    cleaner: {
      id: 'c3',
      name: 'Sarah L.',
      rating: 5.0,
      phone: '+1-555-0125'
    },
    postedDate: '2024-06-15'
  }
];

const statusConfig = {
  active: { color: '#8b5cf6', bgColor: '#8b5cf620', label: 'Active' },
  scheduled: { color: '#f59e0b', bgColor: '#f59e0b20', label: 'Scheduled' },
  pending_offers: { color: '#3b82f6', bgColor: '#3b82f620', label: 'Pending Offers' },
  completed: { color: '#10b981', bgColor: '#10b98120', label: 'Completed' },
  cancelled: { color: '#ef4444', bgColor: '#ef444420', label: 'Cancelled' }
};

const areas = ['All Areas', 'Downtown', 'Midtown', 'Suburbs'];
const statuses = ['All Jobs', 'Active', 'Scheduled', 'Pending Offers', 'Completed'];

export default function MyJobsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const [selectedStatus, setSelectedStatus] = useState('All Jobs');
  const [showFilters, setShowFilters] = useState(false);

  // Filter jobs based on selected filters
  const filteredJobs = useMemo(() => {
    return mockJobs.filter(job => {
      const areaMatch = selectedArea === 'All Areas' || job.area === selectedArea;
      const statusMatch = selectedStatus === 'All Jobs' || 
        statusConfig[job.status].label === selectedStatus;
      return areaMatch && statusMatch;
    });
  }, [selectedArea, selectedStatus]);

  const handleCallCleaner = useCallback((phone: string) => {
    Alert.alert(
      'Call Cleaner',
      'Would you like to call the cleaner?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => Linking.openURL(`tel:${phone}`)
        }
      ]
    );
  }, []);

  const handleMessageCleaner = useCallback((cleanerId: string) => {
    // TODO: Navigate to chat screen
    console.log('Message cleaner:', cleanerId);
    Alert.alert('Message', 'Opening chat with cleaner...');
  }, []);

  const JobCard = useCallback(({ item }: { item: Job }) => {
    const isExpanded = expandedJobId === item.id;
    const statusInfo = statusConfig[item.status];
    const hasActiveCleaner = item.cleaner && (item.status === 'active' || item.status === 'scheduled');

    return (
      <TouchableOpacity 
        style={[styles.jobCard, { backgroundColor: colors.background }]}
        onPress={() => setExpandedJobId(isExpanded ? null : item.id)}
        activeOpacity={0.8}
      >
        {/* Header */}
        <View style={styles.jobHeader}>
          <View style={styles.jobTitleContainer}>
            <Text style={[styles.jobTitle, { color: colors.text }]} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
              <Text style={[styles.statusText, { color: statusInfo.color }]}>
                {statusInfo.label}
              </Text>
            </View>
          </View>
        </View>

        {/* Location and Service Type */}
        <View style={styles.jobInfo}>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={14} color={colors.icon} />
            <Text style={[styles.locationText, { color: colors.icon }]} numberOfLines={1}>
              {item.area}
            </Text>
          </View>
          <Text style={[styles.serviceType, { color: colors.icon }]}>
            {item.serviceType}
          </Text>
        </View>

        {/* Cleaner Info */}
        {hasActiveCleaner && (
          <View style={styles.cleanerSection}>
            <View style={styles.cleanerInfo}>
              <View style={styles.cleanerAvatar}>
                <Ionicons name="person" size={16} color={colors.icon} />
              </View>
              <Text style={[styles.cleanerName, { color: colors.text }]}>
                {item.cleaner?.name}
              </Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={12} color="#f59e0b" />
                <Text style={[styles.ratingText, { color: colors.text }]}>
                  {item.cleaner?.rating}
                </Text>
              </View>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.messageButton, { backgroundColor: colors.tint }]}
                onPress={() => handleMessageCleaner(item.cleaner!.id)}
              >
                <Ionicons name="chatbubble" size={14} color="white" />
                <Text style={styles.actionButtonText}>Message</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.callButton, { borderColor: colors.tint }]}
                onPress={() => handleCallCleaner(item.cleaner!.phone)}
              >
                <Ionicons name="call" size={14} color={colors.tint} />
                <Text style={[styles.callButtonText, { color: colors.tint }]}>Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Pending Offers Info */}
        {item.status === 'pending_offers' && (
          <View style={styles.offersSection}>
            <Ionicons name="document-text" size={16} color={colors.tint} />
            <Text style={[styles.offersText, { color: colors.text }]}>
              {item.offersCount} offers received
            </Text>
            <TouchableOpacity style={[styles.viewOffersButton, { backgroundColor: colors.tint }]}>
              <Text style={styles.viewOffersText}>View Offers</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Expanded Details */}
        {isExpanded && (
          <View style={styles.expandedSection}>
            <View style={styles.divider} />
            
            {/* Schedule */}
            {item.scheduledDate && (
              <View style={styles.detailRow}>
                <Ionicons name="calendar" size={16} color={colors.icon} />
                <Text style={[styles.detailText, { color: colors.text }]}>
                  {new Date(item.scheduledDate).toLocaleDateString()} at {item.scheduledTime}
                </Text>
              </View>
            )}

            {/* Price and Recurrence */}
            <View style={styles.detailRow}>
              <Ionicons name="cash" size={16} color={colors.icon} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                ${item.price} • {item.recurrence === 'once' ? 'One-time' : `${item.recurrence} recurring`}
              </Text>
            </View>

            {/* Property Details */}
            <View style={styles.detailRow}>
              <Ionicons name="home" size={16} color={colors.icon} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                {item.propertyDetails.propertyType}
                {item.propertyDetails.bedrooms > 0 && ` • ${item.propertyDetails.bedrooms}BR`}
                {item.propertyDetails.bathrooms > 0 && ` • ${item.propertyDetails.bathrooms}Bath`}
              </Text>
            </View>

            {/* Supplies */}
            <View style={styles.detailRow}>
              <Ionicons name="bag" size={16} color={colors.icon} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                {item.supplies === 'cleaner' ? 'Cleaner brings supplies' : 
                 item.supplies === 'customer' ? 'Customer provides supplies' : 
                 'Supplies to be discussed'}
              </Text>
            </View>

            {/* Additional Notes */}
            {item.additionalNotes && (
              <View style={styles.detailRow}>
                <Ionicons name="document-text" size={16} color={colors.icon} />
                <Text style={[styles.detailText, { color: colors.text }]}>
                  {item.additionalNotes}
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.expandedActions}>
              <TouchableOpacity style={[styles.expandedActionButton, { borderColor: colors.tint }]}>
                <Text style={[styles.expandedActionText, { color: colors.tint }]}>View Full Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.expandedActionButton, { borderColor: colors.tint }]}>
                <Text style={[styles.expandedActionText, { color: colors.tint }]}>Edit Job</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  }, [expandedJobId, colors, handleCallCleaner, handleMessageCleaner]);

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>
        <Text style={styles.emptyStateEmoji}>🏠✨🧹</Text>
      </View>
      
      <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
        Your cleaning journey starts with one job!
      </Text>
      
      <Text style={[styles.emptyStateSubtitle, { color: colors.icon }]}>
        Ready to experience the magic of professional cleaning?
      </Text>
      
      <TouchableOpacity
        style={[styles.emptyStateCTA, { backgroundColor: colors.tint }]}
        onPress={() => router.push('/post-job')}
      >
        <Ionicons name="sparkles" size={20} color="white" />
        <Text style={styles.emptyStateCTAText}>Post Your First Cleaning Job</Text>
      </TouchableOpacity>
      
      <Text style={[styles.emptyStateHint, { color: colors.icon }]}>
        💡 Get quotes in under 2 hours
      </Text>
    </View>
  );

  const FilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowFilters(false)}
    >
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Filter Jobs</Text>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.filterSection}>
          <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Location</Text>
          {areas.map((area) => (
            <TouchableOpacity
              key={area}
              style={[
                styles.filterOption,
                selectedArea === area && { backgroundColor: colors.tint + '20' }
              ]}
              onPress={() => setSelectedArea(area)}
            >
              <Text style={[
                styles.filterOptionText,
                { color: selectedArea === area ? colors.tint : colors.text }
              ]}>
                {area}
              </Text>
              {selectedArea === area && (
                <Ionicons name="checkmark" size={20} color={colors.tint} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.filterSection}>
          <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Status</Text>
          {statuses.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterOption,
                selectedStatus === status && { backgroundColor: colors.tint + '20' }
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text style={[
                styles.filterOptionText,
                { color: selectedStatus === status ? colors.tint : colors.text }
              ]}>
                {status}
              </Text>
              {selectedStatus === status && (
                <Ionicons name="checkmark" size={20} color={colors.tint} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.applyFiltersButton, { backgroundColor: colors.tint }]}
          onPress={() => setShowFilters(false)}
        >
          <Text style={styles.applyFiltersText}>Apply Filters</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Jobs</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="filter" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Active Filters */}
      {(selectedArea !== 'All Areas' || selectedStatus !== 'All Jobs') && (
        <View style={styles.activeFilters}>
          {selectedArea !== 'All Areas' && (
            <View style={[styles.activeFilter, { backgroundColor: colors.tint + '20' }]}>
              <Text style={[styles.activeFilterText, { color: colors.tint }]}>{selectedArea}</Text>
              <TouchableOpacity onPress={() => setSelectedArea('All Areas')}>
                <Ionicons name="close" size={16} color={colors.tint} />
              </TouchableOpacity>
            </View>
          )}
          {selectedStatus !== 'All Jobs' && (
            <View style={[styles.activeFilter, { backgroundColor: colors.tint + '20' }]}>
              <Text style={[styles.activeFilterText, { color: colors.tint }]}>{selectedStatus}</Text>
              <TouchableOpacity onPress={() => setSelectedStatus('All Jobs')}>
                <Ionicons name="close" size={16} color={colors.tint} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Jobs List */}
      <FlatList
        data={filteredJobs}
        renderItem={JobCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyState}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />

      <FilterModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  filterButton: {
    padding: 4,
  },
  activeFilters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  activeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  activeFilterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    padding: 20,
    flexGrow: 1,
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
    marginBottom: 12,
  },
  jobTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
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
  jobInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '400',
  },
  serviceType: {
    fontSize: 14,
    fontWeight: '400',
  },
  cleanerSection: {
    marginBottom: 8,
  },
  cleanerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  cleanerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cleanerName: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    flex: 1,
  },
  messageButton: {
    // backgroundColor set dynamically
  },
  callButton: {
    borderWidth: 1,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  offersSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    gap: 12,
  },
  offersText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  viewOffersButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewOffersText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  expandedSection: {
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '400',
    flex: 1,
    lineHeight: 20,
  },
  expandedActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  expandedActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  expandedActionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    marginBottom: 24,
  },
  emptyStateEmoji: {
    fontSize: 48,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  emptyStateCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  emptyStateCTAText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyStateHint: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  filterOptionText: {
    fontSize: 16,
    fontWeight: '400',
  },
  applyFiltersButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyFiltersText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 