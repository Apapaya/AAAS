import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  X,
  Send,
  Heart,
  MessageCircle,
  Share,
  Filter
} from 'lucide-react-native';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  attendees: number;
  category: 'protest' | 'meeting' | 'legal' | 'community';
  isJoined: boolean;
  organizer: string;
}

export default function CommunityScreen() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'March for Housing Justice',
      description: 'Standing together for affordable housing rights in our community.',
      location: 'City Hall Plaza',
      date: 'Tomorrow',
      time: '2:00 PM',
      attendees: 247,
      category: 'protest',
      isJoined: true,
      organizer: 'Housing Coalition'
    },
    {
      id: '2',
      title: 'Know Your Rights Workshop',
      description: 'Free legal education on immigration rights and police encounters.',
      location: 'Community Center Room A',
      date: 'Friday',
      time: '6:30 PM',
      attendees: 45,
      category: 'legal',
      isJoined: false,
      organizer: 'Legal Aid Society'
    },
    {
      id: '3',
      title: 'Neighborhood Safety Meeting',
      description: 'Community discussion on local safety concerns and solutions.',
      location: 'Library Meeting Room',
      date: 'Saturday',
      time: '10:00 AM',
      attendees: 23,
      category: 'meeting',
      isJoined: true,
      organizer: 'Residents Union'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'joined'>('all');
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    category: 'community' as Event['category']
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'protest': return '#DC2626';
      case 'legal': return '#1E40AF';
      case 'meeting': return '#059669';
      case 'community': return '#7C3AED';
      default: return '#6B7280';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'protest': return 'Protest';
      case 'legal': return 'Legal';
      case 'meeting': return 'Meeting';
      case 'community': return 'Community';
      default: return 'Event';
    }
  };

  const handleCreateEvent = () => {
    if (!newEvent.title.trim() || !newEvent.location.trim()) {
      Alert.alert('Required Fields', 'Please fill in the event title and location.');
      return;
    }

    const event: Event = {
      id: Date.now().toString(),
      ...newEvent,
      attendees: 1,
      isJoined: true,
      organizer: 'You'
    };

    setEvents([event, ...events]);
    setNewEvent({
      title: '',
      description: '',
      location: '',
      date: '',
      time: '',
      category: 'community'
    });
    setShowCreateModal(false);
    Alert.alert('Event Created', 'Your event has been published to the community!');
  };

  const toggleJoinEvent = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { 
            ...event, 
            isJoined: !event.isJoined,
            attendees: event.isJoined ? event.attendees - 1 : event.attendees + 1
          }
        : event
    ));
  };

  const filteredEvents = activeTab === 'joined' 
    ? events.filter(event => event.isJoined)
    : events;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Community</Text>
          <Text style={styles.headerSubtitle}>Organize and connect for change</Text>
        </View>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All Events
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'joined' && styles.activeTab]}
          onPress={() => setActiveTab('joined')}
        >
          <Text style={[styles.tabText, activeTab === 'joined' && styles.activeTabText]}>
            My Events
          </Text>
        </TouchableOpacity>
      </View>

      {/* Events List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredEvents.map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <View style={styles.eventHeader}>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(event.category) }]}>
                <Text style={styles.categoryText}>{getCategoryLabel(event.category)}</Text>
              </View>
              <Text style={styles.organizer}>by {event.organizer}</Text>
            </View>

            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventDescription}>{event.description}</Text>

            <View style={styles.eventDetails}>
              <View style={styles.eventDetailRow}>
                <MapPin size={16} color="#6B7280" strokeWidth={2} />
                <Text style={styles.eventDetailText}>{event.location}</Text>
              </View>
              <View style={styles.eventDetailRow}>
                <Calendar size={16} color="#6B7280" strokeWidth={2} />
                <Text style={styles.eventDetailText}>{event.date}</Text>
              </View>
              <View style={styles.eventDetailRow}>
                <Clock size={16} color="#6B7280" strokeWidth={2} />
                <Text style={styles.eventDetailText}>{event.time}</Text>
              </View>
            </View>

            <View style={styles.eventFooter}>
              <View style={styles.attendeesInfo}>
                <Users size={16} color="#6B7280" strokeWidth={2} />
                <Text style={styles.attendeesText}>{event.attendees} attending</Text>
              </View>

              <View style={styles.eventActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Heart size={18} color="#6B7280" strokeWidth={2} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <MessageCircle size={18} color="#6B7280" strokeWidth={2} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Share size={18} color="#6B7280" strokeWidth={2} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.joinButton, 
                    event.isJoined && styles.joinedButton
                  ]}
                  onPress={() => toggleJoinEvent(event.id)}
                >
                  <Text style={[
                    styles.joinButtonText,
                    event.isJoined && styles.joinedButtonText
                  ]}>
                    {event.isJoined ? 'Joined' : 'Join'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Create Event Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <X size={24} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create Event</Text>
            <TouchableOpacity 
              style={styles.createEventButton}
              onPress={handleCreateEvent}
            >
              <Send size={20} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Event Title *</Text>
              <TextInput
                style={styles.textInput}
                value={newEvent.title}
                onChangeText={(text) => setNewEvent({...newEvent, title: text})}
                placeholder="What's your event about?"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newEvent.description}
                onChangeText={(text) => setNewEvent({...newEvent, description: text})}
                placeholder="Tell people what to expect..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location *</Text>
              <TextInput
                style={styles.textInput}
                value={newEvent.location}
                onChangeText={(text) => setNewEvent({...newEvent, location: text})}
                placeholder="Where will this happen?"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Date</Text>
                <TextInput
                  style={styles.textInput}
                  value={newEvent.date}
                  onChangeText={(text) => setNewEvent({...newEvent, date: text})}
                  placeholder="Tomorrow"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Time</Text>
                <TextInput
                  style={styles.textInput}
                  value={newEvent.time}
                  onChangeText={(text) => setNewEvent({...newEvent, time: text})}
                  placeholder="2:00 PM"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryOptions}>
                {['community', 'protest', 'meeting', 'legal'].map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryOption,
                      newEvent.category === category && styles.selectedCategory,
                      { borderColor: getCategoryColor(category) }
                    ]}
                    onPress={() => setNewEvent({...newEvent, category: category as Event['category']})}
                  >
                    <Text style={[
                      styles.categoryOptionText,
                      newEvent.category === category && { color: getCategoryColor(category) }
                    ]}>
                      {getCategoryLabel(category)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  createButton: {
    backgroundColor: '#1E40AF',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginRight: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#EFF6FF',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#1E40AF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  organizer: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  eventTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  eventDetails: {
    marginBottom: 16,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  eventDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendeesInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  attendeesText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  eventActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
  joinButton: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinedButton: {
    backgroundColor: '#16A34A',
  },
  joinButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  joinedButtonText: {
    color: '#FFFFFF',
  },
  bottomPadding: {
    height: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  createEventButton: {
    backgroundColor: '#1E40AF',
    borderRadius: 8,
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  categoryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  selectedCategory: {
    borderWidth: 2,
  },
  categoryOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
});