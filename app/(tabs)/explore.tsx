import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

const API_URL = 'http://localhost:3000/api';

interface JobPhoto {
  id: number;
  photoUrl: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Job {
  id: number;
  title: string;
  location: string;
  basePrice: string;
  createdAt: string;
  details: {
    urgency?: 'regular' | 'urgent' | 'emergency';
    bedrooms?: number;
    bathrooms?: number;
    propertyType?: string;
    additionalInstructions?: string;
  };
  customer: User;
  photos: JobPhoto[];
}

const urgencyColors = {
  regular: '#10b981',
  urgent: '#f59e0b',
  emergency: '#ef4444',
};

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'urgent' | 'regular'>('all');
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/jobs`);
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const data = await response.json();
      setJobs(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || job.details.urgency === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const FilterButton = ({ 
    title, 
    value, 
    isSelected 
  }: {
    title: string;
    value: 'all' | 'urgent' | 'regular';
    isSelected: boolean;
  }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        { 
          backgroundColor: isSelected ? colors.tint : colors.background,
          borderColor: colors.tint,
        }
      ]}
      onPress={() => setSelectedFilter(value)}
      activeOpacity={0.8}
    >
      <Text style={[
        styles.filterButtonText,
        { color: isSelected ? 'white' : colors.tint }
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const JobCard = ({ job }: { job: Job }) => {
    const urgency = job.details?.urgency || 'regular';
    const bedrooms = job.details?.bedrooms || 0;
    const bathrooms = job.details?.bathrooms || 0;
    const propertyType = job.details?.propertyType || 'N/A';
    const description = job.details?.additionalInstructions || 'No additional details provided.';
    
    return (
      <TouchableOpacity 
        style={[styles.jobCard, { backgroundColor: colors.background }]}
        activeOpacity={0.8}
      >
        <View style={styles.jobHeader}>
          <View style={styles.jobTitleContainer}>
            <Text style={[styles.jobTitle, { color: colors.text }]} numberOfLines={1}>
              {job.title}
            </Text>
            <View style={[
              styles.urgencyBadge, 
              { backgroundColor: (urgencyColors[urgency] || urgencyColors.regular) + '20' }
            ]}>
              <Text style={[
                styles.urgencyText, 
                { color: urgencyColors[urgency] || urgencyColors.regular }
              ]}>
                {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
              </Text>
            </View>
          </View>
          <Text style={[styles.postedTime, { color: colors.icon }]}>
            {new Date(job.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.jobLocation}>
          <Ionicons name="location" size={16} color={colors.icon} />
          <Text style={[styles.locationText, { color: colors.icon }]}>
            {job.location}
          </Text>
        </View>

        <Text style={[styles.jobDescription, { color: colors.text }]} numberOfLines={2}>
          {description}
        </Text>

        <View style={styles.jobDetails}>
          <View style={styles.propertyInfo}>
            <View style={styles.propertyItem}>
              <Ionicons name="bed" size={16} color={colors.icon} />
              <Text style={[styles.propertyText, { color: colors.icon }]}>
                {bedrooms} BR
              </Text>
            </View>
            <View style={styles.propertyItem}>
              <Ionicons name="water" size={16} color={colors.icon} />
              <Text style={[styles.propertyText, { color: colors.icon }]}>
                {bathrooms} Bath
              </Text>
            </View>
            <View style={styles.propertyItem}>
              <Ionicons name="home" size={16} color={colors.icon} />
              <Text style={[styles.propertyText, { color: colors.icon }]}>
                {propertyType}
              </Text>
            </View>
          </View>

          <View style={styles.budgetContainer}>
            <Text style={[styles.budgetLabel, { color: colors.icon }]}>Price:</Text>
            <Text style={[styles.budgetAmount, { color: colors.text }]}>
              ${job.basePrice}
            </Text>
          </View>
        </View>
        
        {job.photos && job.photos.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScrollView}>
            <View style={styles.photoPlaceholder} />
            <Text style={{color: colors.icon}}>{job.photos.length} photo(s)</Text>
          </ScrollView>
        )}

        <TouchableOpacity 
          style={[styles.applyButton, { backgroundColor: colors.tint }]}
          activeOpacity={0.8}
        >
          <Text style={styles.applyButtonText}>View Details & Submit Offer</Text>
          <Ionicons name="arrow-forward" size={16} color="white" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.tint} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centered}>
          <Text style={{ color: 'red' }}>Error: {error}</Text>
          <TouchableOpacity onPress={fetchJobs} style={styles.retryButton}>
            <Text style={{ color: colors.tint }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (filteredJobs.length === 0) {
      return (
        <View style={styles.centered}>
          <Text style={{ color: colors.icon }}>No open jobs found.</Text>
        </View>
      );
    }

    return (
      <ScrollView 
        style={styles.jobsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.jobsListContent}
      >
        {filteredJobs.map(job => <JobCard key={job.id} job={job} />)}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Available Jobs</Text>
        <TouchableOpacity style={styles.filterIconButton}>
          <Ionicons name="options" size={24} color={colors.tint} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.background }]}>
          <Ionicons name="search" size={20} color={colors.icon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search jobs, locations..."
            placeholderTextColor={colors.icon}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.icon} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          <FilterButton title="All Jobs" value="all" isSelected={selectedFilter === 'all'} />
          <FilterButton title="Urgent" value="urgent" isSelected={selectedFilter === 'urgent'} />
          <FilterButton title="Regular" value="regular" isSelected={selectedFilter === 'regular'} />
        </ScrollView>
      </View>

      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  filterIconButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '400',
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filtersScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  jobsList: {
    flex: 1,
  },
  jobsListContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  jobCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
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
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  urgencyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  postedTime: {
    fontSize: 12,
    fontWeight: '400',
  },
  jobLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '400',
    marginLeft: 4,
  },
  jobDescription: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    marginBottom: 12,
  },
  jobDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  propertyInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  propertyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  propertyText: {
    fontSize: 12,
    fontWeight: '400',
  },
  budgetContainer: {
    alignItems: 'flex-end',
  },
  budgetLabel: {
    fontSize: 12,
    fontWeight: '400',
  },
  budgetAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButton: {
    marginTop: 10,
    padding: 10,
    borderColor: Colors.light.tint,
    borderWidth: 1,
    borderRadius: 5,
  },
  photoScrollView: {
    marginVertical: 10,
  },
  photoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginRight: 10,
  },
}); 