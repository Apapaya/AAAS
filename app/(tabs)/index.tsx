import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Search, Mic, Navigation, User, MapPin, Chrome as Home, Briefcase, Users as UsersIcon } from 'lucide-react-native';
import MapPlaceholder from '@/components/MapPlaceholder';
import BottomSheet from '@/components/BottomSheet';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface RiskArea {
  id: string;
  location: string;
  riskLevel: 'low' | 'medium' | 'high';
  type: string;
  lastReported: string;
  coordinates: [number, number];
  radius: number;
}

interface RouteInfo {
  destination: string;
  duration: string;
  riskLevel: 'low' | 'medium' | 'high';
  alternatives: number;
}

export default function MapScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number]>([-122.4194, 37.7749]); // Default to SF

  const nearbyRisks: RiskArea[] = [
    {
      id: '1',
      location: 'Downtown Transit Center',
      riskLevel: 'high',
      type: 'ICE checkpoint reported',
      lastReported: '15 min ago',
      coordinates: [-122.4094, 37.7849],
      radius: 50
    },
    {
      id: '2',
      location: 'Highway 101 North',
      riskLevel: 'medium',
      type: 'Heavy patrol presence',
      lastReported: '45 min ago',
      coordinates: [-122.4294, 37.7649],
      radius: 75
    },
    {
      id: '3',
      location: 'Market Street',
      riskLevel: 'low',
      type: 'All clear - community verified',
      lastReported: '2 hours ago',
      coordinates: [-122.4394, 37.7549],
      radius: 30
    }
  ];

  const recentRoutes: RouteInfo[] = [
    {
      destination: 'Community Center',
      duration: '12 min',
      riskLevel: 'low',
      alternatives: 3
    },
    {
      destination: 'Legal Aid Office',
      duration: '8 min',
      riskLevel: 'low',
      alternatives: 2
    },
    {
      destination: 'Immigration Services',
      duration: '18 min',
      riskLevel: 'medium',
      alternatives: 4
    }
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      Alert.alert('Enter Destination', 'Please enter where you want to go for the safest route.');
      return;
    }
    
    // Simulate route calculation
    Alert.alert(
      'Route Calculated',
      `Finding the safest route to ${searchQuery}.\n\nRoute analysis complete:\n• Low risk detected\n• Estimated time: 15 minutes\n• 3 alternative routes available`,
      [
        { text: 'View Alternatives', style: 'default' },
        { text: 'Start Navigation', style: 'default' }
      ]
    );
  };

  const handleQuickAction = (destination: string) => {
    setSearchQuery(destination);
    handleSearch();
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Map */}
      <MapPlaceholder
        userLocation={userLocation}
        riskAreas={nearbyRisks}
      />

      {/* Search Bar Overlay */}
      <SafeAreaView style={styles.searchOverlay} edges={['top']}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#6B7280" strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Where do you need to go?"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity style={styles.micButton}>
              <Mic size={18} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <User size={20} color="#1E40AF" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => handleQuickAction('Home')}
          >
            <Home size={16} color="#1E40AF" strokeWidth={2} />
            <Text style={styles.quickActionText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => handleQuickAction('Work')}
          >
            <Briefcase size={16} color="#1E40AF" strokeWidth={2} />
            <Text style={styles.quickActionText}>Work</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => handleQuickAction('Legal Aid')}
          >
            <Navigation size={16} color="#1E40AF" strokeWidth={2} />
            <Text style={styles.quickActionText}>Legal Aid</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => handleQuickAction('Community Center')}
          >
            <UsersIcon size={16} color="#1E40AF" strokeWidth={2} />
            <Text style={styles.quickActionText}>Community</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Bottom Sheet */}
      <BottomSheet 
        nearbyRisks={nearbyRisks}
        recentRoutes={recentRoutes}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  searchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: Platform.OS === 'ios' ? 40 : 32,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
    gap: 12,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 12,
    minHeight: 56,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    paddingVertical: 0,
  },
  micButton: {
    padding: 6,
    borderRadius: 20,
  },
  profileButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 16,
    minWidth: 56,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    minHeight: 44,
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
  quickActionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
});