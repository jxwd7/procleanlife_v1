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
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

// Mock data - replace with real data from your Redux store
const mockChats = [
  {
    id: '1',
    jobTitle: 'Deep Clean - 2BR Apartment',
    participant: 'Maria S.',
    lastMessage: 'I can start at 2 PM today. Is that okay?',
    timestamp: '2 min ago',
    unreadCount: 1,
    isActive: true,
    participantAvatar: null,
  },
  {
    id: '2',
    jobTitle: 'Regular Cleaning - House',
    participant: 'John D.',
    lastMessage: 'Job completed successfully! Please rate your experience.',
    timestamp: '1 hour ago',
    unreadCount: 0,
    isActive: true,
    participantAvatar: null,
  },
  {
    id: '3',
    jobTitle: 'Move-in Cleaning - Studio',
    participant: 'Sarah L.',
    lastMessage: 'I have a few questions about the special requirements.',
    timestamp: '3 hours ago',
    unreadCount: 2,
    isActive: true,
    participantAvatar: null,
  },
  {
    id: '4',
    jobTitle: 'Weekly Cleaning - Office',
    participant: 'Mike R.',
    lastMessage: 'Thanks for choosing me for this job!',
    timestamp: '1 day ago',
    unreadCount: 0,
    isActive: false,
    participantAvatar: null,
  },
];

export default function MessagesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'unread'>('all');

  const filteredChats = mockChats.filter(chat => {
    const matchesSearch = chat.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chat.participant.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'active' && chat.isActive) ||
                         (selectedFilter === 'unread' && chat.unreadCount > 0);
    return matchesSearch && matchesFilter;
  });

  const FilterButton = ({ 
    title, 
    value, 
    isSelected 
  }: {
    title: string;
    value: 'all' | 'active' | 'unread';
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

  const ChatCard = ({ chat }: { chat: typeof mockChats[0] }) => (
    <TouchableOpacity 
      style={[styles.chatCard, { backgroundColor: colors.background }]}
      activeOpacity={0.8}
    >
      <View style={styles.chatHeader}>
        <View style={styles.avatarContainer}>
          {chat.participantAvatar ? (
            <Text style={[styles.avatarText, { color: colors.background }]}>
              {chat.participant.charAt(0)}
            </Text>
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.tint }]}>
              <Text style={[styles.avatarText, { color: colors.background }]}>
                {chat.participant.charAt(0)}
              </Text>
            </View>
          )}
          {chat.isActive && (
            <View style={styles.onlineIndicator} />
          )}
        </View>
        
        <View style={styles.chatInfo}>
          <View style={styles.chatTitleRow}>
            <Text style={[styles.participantName, { color: colors.text }]} numberOfLines={1}>
              {chat.participant}
            </Text>
            <Text style={[styles.timestamp, { color: colors.icon }]}>
              {chat.timestamp}
            </Text>
          </View>
          <Text style={[styles.jobTitle, { color: colors.icon }]} numberOfLines={1}>
            {chat.jobTitle}
          </Text>
          <Text style={[styles.lastMessage, { color: colors.text }]} numberOfLines={2}>
            {chat.lastMessage}
          </Text>
        </View>

        <View style={styles.chatActions}>
          {chat.unreadCount > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: colors.tint }]}>
              <Text style={styles.unreadText}>{chat.unreadCount}</Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={16} color={colors.icon} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Messages</Text>
        <TouchableOpacity style={styles.newMessageButton}>
          <Ionicons name="add" size={24} color={colors.tint} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.background }]}>
          <Ionicons name="search" size={20} color={colors.icon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search conversations..."
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

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          <FilterButton title="All" value="all" isSelected={selectedFilter === 'all'} />
          <FilterButton title="Active" value="active" isSelected={selectedFilter === 'active'} />
          <FilterButton title="Unread" value="unread" isSelected={selectedFilter === 'unread'} />
        </ScrollView>
      </View>

      {/* Chats List */}
      <ScrollView 
        style={styles.chatsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.chatsListContent}
      >
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <ChatCard key={chat.id} chat={chat} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles" size={48} color={colors.icon} />
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
              No messages found
            </Text>
            <Text style={[styles.emptyStateText, { color: colors.icon }]}>
              Start a conversation by posting a job or responding to offers
            </Text>
          </View>
        )}
      </ScrollView>
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
  newMessageButton: {
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
  chatsList: {
    flex: 1,
  },
  chatsListContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Account for tab bar
    gap: 12,
  },
  chatCard: {
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: 'white',
  },
  chatInfo: {
    flex: 1,
    marginRight: 12,
  },
  chatTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    fontWeight: '400',
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  chatActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  unreadBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
}); 