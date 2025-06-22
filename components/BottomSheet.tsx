import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { TriangleAlert as AlertTriangle, Shield, Clock, MapPin, ChevronUp, ChevronDown, Users } from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.6; // Reduced from 0.75 to 0.6
const BOTTOM_SHEET_MIN_HEIGHT = 140;

interface RiskArea {
  id: string;
  location: string;
  riskLevel: 'low' | 'medium' | 'high';
  type: string;
  lastReported: string;
}

interface RouteInfo {
  destination: string;
  duration: string;
  riskLevel: 'low' | 'medium' | 'high';
  alternatives: number;
}

interface BottomSheetProps {
  nearbyRisks: RiskArea[];
  recentRoutes: RouteInfo[];
}

export default function BottomSheet({ nearbyRisks, recentRoutes }: BottomSheetProps) {
  const translateY = useSharedValue(BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT);
  const isExpanded = useSharedValue(false);

  const scrollToTop = () => {
    translateY.value = withSpring(0, { damping: 50 });
    isExpanded.value = true;
  };

  const scrollToBottom = () => {
    translateY.value = withSpring(BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT, { damping: 50 });
    isExpanded.value = false;
  };

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: (_, context) => {
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      const newTranslateY = context.startY + event.translationY;
      translateY.value = Math.max(0, Math.min(newTranslateY, BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT));
    },
    onEnd: (event) => {
      const shouldExpand = event.velocityY < -500 || translateY.value < (BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT) / 2;
      
      if (shouldExpand) {
        runOnJS(scrollToTop)();
      } else {
        runOnJS(scrollToBottom)();
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const handleToggle = () => {
    if (isExpanded.value) {
      scrollToBottom();
    } else {
      scrollToTop();
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return '#DC2626';
      case 'medium': return '#F59E0B';
      case 'low': return '#16A34A';
      default: return '#6B7280';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertTriangle size={16} color="#DC2626" strokeWidth={2.5} />;
      case 'medium': return <AlertTriangle size={16} color="#F59E0B" strokeWidth={2.5} />;
      case 'low': return <Shield size={16} color="#16A34A" strokeWidth={2.5} />;
      default: return <AlertTriangle size={16} color="#6B7280" strokeWidth={2.5} />;
    }
  };

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.bottomSheet, animatedStyle]}>
        {/* Handle */}
        <TouchableOpacity style={styles.handle} onPress={handleToggle}>
          <View style={styles.handleBar} />
          <View style={styles.handleContent}>
            <Text style={styles.handleText}>Latest in the area...</Text>
            <ChevronUp size={20} color="#6B7280" strokeWidth={2} />
          </View>
        </TouchableOpacity>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Nearby Risks Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AlertTriangle size={20} color="#DC2626" strokeWidth={2.5} />
              <Text style={styles.sectionTitle}>Nearby Risks</Text>
              <View style={styles.liveBadge}>
                <View style={styles.liveIndicator} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>
            
            {nearbyRisks.map((risk) => (
              <TouchableOpacity key={risk.id} style={styles.riskCard}>
                <View style={styles.riskHeader}>
                  <View style={styles.riskIconContainer}>
                    {getRiskIcon(risk.riskLevel)}
                  </View>
                  <View style={styles.riskInfo}>
                    <Text style={styles.riskLocation}>{risk.location}</Text>
                    <Text style={styles.riskType}>{risk.type}</Text>
                  </View>
                  <View style={styles.riskTime}>
                    <Clock size={14} color="#6B7280" strokeWidth={2} />
                    <Text style={styles.riskTimeText}>{risk.lastReported}</Text>
                  </View>
                </View>
                <View style={[styles.riskLevelBadge, { backgroundColor: getRiskColor(risk.riskLevel) }]}>
                  <Text style={styles.riskLevelText}>{risk.riskLevel.toUpperCase()}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recent Safe Routes Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Shield size={20} color="#16A34A" strokeWidth={2.5} />
              <Text style={styles.sectionTitle}>Recent Safe Routes</Text>
            </View>
            
            {recentRoutes.map((route, index) => (
              <TouchableOpacity key={index} style={styles.routeCard}>
                <View style={styles.routeHeader}>
                  <View style={styles.routeInfo}>
                    <Text style={styles.routeDestination}>{route.destination}</Text>
                    <View style={styles.routeDetails}>
                      <Text style={styles.routeDuration}>{route.duration}</Text>
                      <View style={styles.routeSeparator} />
                      <View style={[styles.riskBadge, { backgroundColor: getRiskColor(route.riskLevel) }]}>
                        <Text style={styles.riskBadgeText}>{route.riskLevel} risk</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.routeAlternatives}>
                    <Text style={styles.alternativesText}>{route.alternatives}</Text>
                    <Text style={styles.alternativesLabel}>alternatives</Text>
                  </View>
                </View>
                <View style={styles.routeActions}>
                  <TouchableOpacity style={styles.routeButton}>
                    <Text style={styles.routeButtonText}>View Route</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Safety Reminders Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Shield size={20} color="#1E40AF" strokeWidth={2.5} />
              <Text style={styles.sectionTitle}>Safety Reminders</Text>
            </View>
            <View style={styles.tipsCard}>
              <View style={styles.tipItem}>
                <View style={styles.tipBullet} />
                <Text style={styles.tipText}>Stay aware of your surroundings at all times</Text>
              </View>
              <View style={styles.tipItem}>
                <View style={styles.tipBullet} />
                <Text style={styles.tipText}>Keep emergency contacts readily available</Text>
              </View>
              <View style={styles.tipItem}>
                <View style={styles.tipBullet} />
                <Text style={styles.tipText}>Trust your instincts about unsafe situations</Text>
              </View>
              <View style={styles.tipItem}>
                <View style={styles.tipBullet} />
                <Text style={styles.tipText}>Know your rights during any police encounter</Text>
              </View>
            </View>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BOTTOM_SHEET_MAX_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  handle: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  handleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  handleText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 28,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    flex: 1,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC2626',
  },
  liveText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#DC2626',
    letterSpacing: 0.5,
  },
  riskCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 14,
  },
  riskIconContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  riskInfo: {
    flex: 1,
  },
  riskLocation: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 6,
  },
  riskType: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  riskTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  riskTimeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  riskLevelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  riskLevelText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  routeCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#16A34A',
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  routeInfo: {
    flex: 1,
  },
  routeDestination: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  routeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  routeDuration: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  routeSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
  },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  riskBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  routeAlternatives: {
    alignItems: 'center',
    marginLeft: 16,
  },
  alternativesText: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#16A34A',
  },
  alternativesLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  routeActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  routeButton: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  routeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  tipsCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    gap: 14,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1E40AF',
    marginTop: 7,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 22,
  },
  bottomPadding: {
    height: 60,
  },
});