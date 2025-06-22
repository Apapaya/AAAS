import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity, Alert } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { MapPin, Navigation, TriangleAlert as AlertTriangle, Shield, Plus } from 'lucide-react-native';

// Configure Mapbox
MapboxGL.setAccessToken('pk.eyJ1IjoiYXJmYW5hcyIsImEiOiJjbWM2djB5Y2oxNzRoMmtwcHF3ZnY1M2R5In0.qDhanweufdtF8drhXUaLGA');

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface RiskArea {
  id: string;
  location: string;
  riskLevel: 'low' | 'medium' | 'high';
  type: string;
  coordinates: [number, number];
  radius: number;
}

interface Report {
  lat: number;
  lng: number;
  type: string;
  trustScore: number;
  timestamp: string;
}

interface MapPlaceholderProps {
  userLocation?: [number, number];
  riskAreas?: RiskArea[];
  backendUrl?: string;
}

export default function MapPlaceholder({ 
  userLocation = [-122.2730, 37.8715], // [lng, lat] for Mapbox
  riskAreas = [],
  backendUrl = 'http://localhost:3000'
}: MapPlaceholderProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [safetyData, setSafetyData] = useState<any>(null);
  const [userLocationCoords, setUserLocationCoords] = useState(userLocation);

  // Fetch reports from backend
  const fetchReports = async () => {
    try {
      const response = await fetch(`${backendUrl}/reports`);
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.log('Error fetching reports:', error);
    }
  };

  // Check safety at location
  const checkSafety = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`${backendUrl}/safety?lat=${lat}&lng=${lng}`);
      const data = await response.json();
      setSafetyData(data);
      return data;
    } catch (error) {
      console.log('Error checking safety:', error);
      return null;
    }
  };

  // Submit report
  const submitReport = async (lat: number, lng: number, type: string = 'ICE') => {
    try {
      const response = await fetch(`${backendUrl}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat,
          lng,
          type,
          trustScore: 1,
          timestamp: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        Alert.alert('Success', 'Report submitted successfully');
        fetchReports(); // Refresh reports
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit report');
    }
  };

  // Handle map tap
  const handleMapTap = async (feature: any) => {
    const [lng, lat] = feature.geometry.coordinates;
    setSelectedLocation([lng, lat]);
    
    // Check safety at tapped location
    const safety = await checkSafety(lat, lng);
    
    Alert.alert(
      'Location Selected',
      `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}\nRisk Level: ${safety?.riskLevel || 'Unknown'}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Report ICE Activity', 
          onPress: () => submitReport(lat, lng, 'ICE')
        },
        {
          text: 'Check Safety',
          onPress: () => {
            if (safety) {
              Alert.alert(
                'Safety Report',
                `Risk Score: ${safety.riskScore}\nRisk Level: ${safety.riskLevel}\nNearby Reports: ${safety.nearbyReports?.length || 0}`
              );
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return '#DC2626';
      case 'medium': return '#F59E0B';
      case 'low': return '#16A34A';
      default: return '#6B7280';
    }
  };

  // Create GeoJSON for risk areas from reports
  const createReportsGeoJSON = () => {
    const features = reports.filter(r => r.type === 'ICE').map((report, index) => ({
      type: 'Feature',
      id: `report-${index}`,
      geometry: {
        type: 'Point',
        coordinates: [report.lng, report.lat]
      },
      properties: {
        type: report.type,
        timestamp: report.timestamp,
        riskLevel: 'high'
      }
    }));

    return {
      type: 'FeatureCollection',
      features
    };
  };

  // Create GeoJSON for static risk areas
  const createRiskAreasGeoJSON = () => {
    const features = riskAreas.map((area) => ({
      type: 'Feature',
      id: area.id,
      geometry: {
        type: 'Point',
        coordinates: [area.coordinates[1], area.coordinates[0]] // [lng, lat]
      },
      properties: {
        riskLevel: area.riskLevel,
        type: area.type,
        location: area.location
      }
    }));

    return {
      type: 'FeatureCollection',
      features
    };
  };

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        style={styles.map}
        styleURL={MapboxGL.StyleURL.Street}
        onPress={handleMapTap}
      >
        <MapboxGL.Camera
          centerCoordinate={userLocationCoords}
          zoomLevel={12}
          animationMode="flyTo"
          animationDuration={2000}
        />

        {/* User Location */}
        <MapboxGL.PointAnnotation
          id="user-location"
          coordinate={userLocationCoords}
        >
          <View style={styles.userLocationMarker}>
            <View style={styles.userLocationDot} />
            <View style={styles.userLocationPulse} />
          </View>
        </MapboxGL.PointAnnotation>

        {/* Selected Location Marker */}
        {selectedLocation && (
          <MapboxGL.PointAnnotation
            id="selected-location"
            coordinate={selectedLocation}
          >
            <View style={styles.selectedLocationMarker}>
              <MapPin size={24} color="#DC2626" strokeWidth={2} />
            </View>
          </MapboxGL.PointAnnotation>
        )}

        {/* Risk Areas from Reports */}
        {reports.filter(r => r.type === 'ICE').map((report, index) => (
          <MapboxGL.PointAnnotation
            key={`report-${index}`}
            id={`report-${index}`}
            coordinate={[report.lng, report.lat]}
          >
            <View style={styles.riskMarkerContainer}>
              <View style={[styles.riskCircle, { borderColor: '#DC2626' }]} />
              <View style={[styles.riskMarker, { backgroundColor: '#DC2626' }]}>
                <AlertTriangle size={12} color="#FFFFFF" strokeWidth={2.5} />
              </View>
            </View>
          </MapboxGL.PointAnnotation>
        ))}

        {/* Static Risk Areas */}
        {riskAreas.map((area) => (
          <MapboxGL.PointAnnotation
            key={area.id}
            id={area.id}
            coordinate={[area.coordinates[1], area.coordinates[0]]} // [lng, lat]
          >
            <View style={styles.riskMarkerContainer}>
              <View style={[styles.riskCircle, { borderColor: getRiskColor(area.riskLevel) }]} />
              <View style={[styles.riskMarker, { backgroundColor: getRiskColor(area.riskLevel) }]}>
                <AlertTriangle size={12} color="#FFFFFF" strokeWidth={2.5} />
              </View>
            </View>
          </MapboxGL.PointAnnotation>
        ))}
      </MapboxGL.MapView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => Alert.alert('Info', 'Tap anywhere on the map to report or check safety')}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Report</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={fetchReports}
        >
          <Text style={styles.actionButtonText}>Refresh ({reports.length})</Text>
        </TouchableOpacity>
      </View>

      {/* Safety Status */}
      {safetyData && (
        <View style={styles.safetyStatus}>
          <Text style={styles.safetyText}>
            Risk Level: <Text style={{ color: getRiskColor(safetyData.riskLevel) }}>
              {safetyData.riskLevel}
            </Text>
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  userLocationMarker: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userLocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1E40AF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  userLocationPulse: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1E40AF',
    opacity: 0.3,
  },
  selectedLocationMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  riskMarkerContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  riskCircle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
  },
  riskMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  actionButtons: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  secondaryButton: {
    backgroundColor: '#6B7280',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 8,
  },
  safetyStatus: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  safetyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#374151',
  },
});