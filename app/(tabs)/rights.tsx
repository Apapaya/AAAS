import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Shield, 
  Phone, 
  FileText, 
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Search,
  MapPin,
  Clock
} from 'lucide-react-native';

interface LegalResource {
  id: string;
  title: string;
  description: string;
  category: 'rights' | 'emergency' | 'contact' | 'guide';
  content?: string;
  phone?: string;
  urgent?: boolean;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  location: string;
  hours: string;
  specialty: string;
}

export default function RightsScreen() {
  const [selectedResource, setSelectedResource] = useState<LegalResource | null>(null);
  const [activeSection, setActiveSection] = useState<'resources' | 'contacts'>('resources');

  const legalResources: LegalResource[] = [
    {
      id: '1',
      title: 'Your Rights During Police Encounters',
      description: 'Essential knowledge for interactions with law enforcement',
      category: 'rights',
      urgent: true,
      content: `YOUR FUNDAMENTAL RIGHTS:

• You have the right to remain silent
• You have the right to refuse searches of your person, belongings, or vehicle
• You have the right to ask "Am I free to leave?"
• You have the right to an attorney

WHAT TO DO:
• Stay calm and keep your hands visible
• Don't argue, resist, or run
• Say clearly: "I am exercising my right to remain silent"
• Ask for a lawyer immediately if arrested

REMEMBER:
• You don't have to answer questions about where you're from
• You don't have to show papers unless you're driving
• Anything you say can be used against you`
    },
    {
      id: '2',
      title: 'Immigration Rights & ICE Encounters',
      description: 'Know your rights regardless of immigration status',
      category: 'rights',
      urgent: true,
      content: `IMPORTANT: You have rights regardless of immigration status.

YOUR RIGHTS:
• Right to remain silent about citizenship/immigration status
• Right to refuse to sign papers
• Right to speak with a lawyer
• Right to an interpreter

IF ICE COMES TO YOUR HOME:
• You do not have to open the door unless they have a warrant
• Ask to see the warrant through the door or window
• If they have a warrant, ask to see it before opening

IF STOPPED BY ICE:
• Give your name only
• Say "I want to remain silent" and "I want to speak to a lawyer"
• Do not sign anything
• Remember: You have the right to make a phone call`
    },
    {
      id: '3',
      title: 'Protest & Free Speech Rights',
      description: 'Understanding your First Amendment protections',
      category: 'rights',
      content: `YOUR FIRST AMENDMENT RIGHTS:

• Freedom of speech and peaceful assembly
• Right to protest in public spaces
• Right to record police in public

PEACEFUL PROTEST GUIDELINES:
• Stay on public property (sidewalks, parks, plazas)
• Follow lawful police orders about time, place, manner
• Don't block pedestrian or vehicle traffic
• Remain peaceful and non-threatening

IF ARRESTED AT A PROTEST:
• Stay calm and don't resist
• Say "I want to remain silent" and "I want a lawyer"
• Don't sign anything
• Try to remember badge numbers and officer descriptions

KNOW THE LIMITS:
• You cannot be arrested for what you say, only for what you do
• Police can arrest you for blocking traffic or trespassing
• Private property owners can set their own rules`
    },
    {
      id: '4',
      title: 'What to Do If Arrested',
      description: 'Step-by-step guide for arrest situations',
      category: 'guide',
      content: `IF YOU ARE ARRESTED:

IMMEDIATE STEPS:
1. Don't resist, even if the arrest feels unfair
2. Say clearly: "I want to remain silent"
3. Say: "I want to speak to a lawyer"
4. Don't answer questions without a lawyer present

YOUR RIGHTS:
• Right to make one phone call
• Right to an attorney (free if you can't afford one)
• Right to know the charges against you
• Right to remain silent

WHAT NOT TO DO:
• Don't argue with police
• Don't give explanations or excuses
• Don't sign anything
• Don't discuss your case with cellmates

REMEMBER:
• Police may lie to you - this is legal
• Anything you say will be used against you
• Even small talk can be used as evidence
• Only speak to your lawyer about your case`
    }
  ];

  const emergencyContacts: EmergencyContact[] = [
    {
      id: '1',
      name: 'Legal Aid Immigration Hotline',
      phone: '1-800-555-0123',
      location: 'San Francisco Bay Area',
      hours: '24/7 Emergency Line',
      specialty: 'Immigration & deportation defense'
    },
    {
      id: '2',
      name: 'Criminal Defense Legal Clinic',
      phone: '1-800-555-0456',
      location: 'Downtown Legal Center',
      hours: 'Mon-Fri 9AM-6PM, Emergency 24/7',
      specialty: 'Criminal defense & police encounters'
    },
    {
      id: '3',
      name: 'Civil Rights Legal Support',
      phone: '1-800-555-0789',
      location: 'Community Justice Center',
      hours: '24/7 Rapid Response',
      specialty: 'Protest arrests & civil rights'
    },
    {
      id: '4',
      name: 'Know Your Rights Helpline',
      phone: '1-800-555-0321',
      location: 'Statewide',
      hours: 'Daily 8AM-10PM',
      specialty: 'General legal questions & referrals'
    }
  ];

  const handleCallEmergency = (phone: string, name: string) => {
    Alert.alert(
      'Call Legal Support',
      `Call ${name} at ${phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call Now', 
          onPress: () => Linking.openURL(`tel:${phone}`) 
        }
      ]
    );
  };

  const renderResourceDetail = () => {
    if (!selectedResource) return null;

    return (
      <View style={styles.detailContainer}>
        <View style={styles.detailHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedResource(null)}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          {selectedResource.urgent && (
            <View style={styles.urgentBadge}>
              <AlertCircle size={14} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.urgentText}>Essential</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.detailTitle}>{selectedResource.title}</Text>
        <Text style={styles.detailDescription}>{selectedResource.description}</Text>
        
        <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.contentText}>{selectedResource.content}</Text>
          
          <View style={styles.emergencyNote}>
            <AlertCircle size={20} color="#DC2626" strokeWidth={2} />
            <Text style={styles.emergencyNoteText}>
              If you're in immediate danger, call 911. For legal emergencies, use the contacts in the Emergency section.
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  };

  if (selectedResource) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        {renderResourceDetail()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rights & Resources</Text>
        <Text style={styles.headerSubtitle}>Know your rights. Stay informed. Stay safe.</Text>
      </View>

      {/* Section Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeSection === 'resources' && styles.activeTab]}
          onPress={() => setActiveSection('resources')}
        >
          <FileText size={18} color={activeSection === 'resources' ? '#1E40AF' : '#6B7280'} strokeWidth={2} />
          <Text style={[styles.tabText, activeSection === 'resources' && styles.activeTabText]}>
            Legal Guides
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeSection === 'contacts' && styles.activeTab]}
          onPress={() => setActiveSection('contacts')}
        >
          <Phone size={18} color={activeSection === 'contacts' ? '#1E40AF' : '#6B7280'} strokeWidth={2} />
          <Text style={[styles.tabText, activeSection === 'contacts' && styles.activeTabText]}>
            Emergency Contacts
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeSection === 'resources' ? (
          <>
            {/* Emergency Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Essential Rights</Text>
              {legalResources.filter(r => r.urgent).map((resource) => (
                <TouchableOpacity 
                  key={resource.id}
                  style={styles.urgentResourceCard}
                  onPress={() => setSelectedResource(resource)}
                >
                  <View style={styles.resourceHeader}>
                    <View style={styles.urgentIndicator}>
                      <AlertCircle size={16} color="#FFFFFF" strokeWidth={2} />
                      <Text style={styles.urgentIndicatorText}>Essential</Text>
                    </View>
                    <ChevronRight size={20} color="#6B7280" strokeWidth={2} />
                  </View>
                  <Text style={styles.resourceTitle}>{resource.title}</Text>
                  <Text style={styles.resourceDescription}>{resource.description}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Other Resources */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Resources</Text>
              {legalResources.filter(r => !r.urgent).map((resource) => (
                <TouchableOpacity 
                  key={resource.id}
                  style={styles.resourceCard}
                  onPress={() => setSelectedResource(resource)}
                >
                  <View style={styles.resourceContent}>
                    <Text style={styles.resourceTitle}>{resource.title}</Text>
                    <Text style={styles.resourceDescription}>{resource.description}</Text>
                  </View>
                  <ChevronRight size={20} color="#6B7280" strokeWidth={2} />
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Legal Emergency Contacts</Text>
            <Text style={styles.sectionSubtitle}>
              Free legal support available 24/7. Save these numbers in your phone.
            </Text>
            
            {emergencyContacts.map((contact) => (
              <View key={contact.id} style={styles.contactCard}>
                <View style={styles.contactHeader}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <TouchableOpacity 
                    style={styles.callButton}
                    onPress={() => handleCallEmergency(contact.phone, contact.name)}
                  >
                    <Phone size={16} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.callButtonText}>Call</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.contactDetails}>
                  <View style={styles.contactDetailRow}>
                    <Phone size={14} color="#6B7280" strokeWidth={2} />
                    <Text style={styles.contactDetailText}>{contact.phone}</Text>
                  </View>
                  <View style={styles.contactDetailRow}>
                    <MapPin size={14} color="#6B7280" strokeWidth={2} />
                    <Text style={styles.contactDetailText}>{contact.location}</Text>
                  </View>
                  <View style={styles.contactDetailRow}>
                    <Clock size={14} color="#6B7280" strokeWidth={2} />
                    <Text style={styles.contactDetailText}>{contact.hours}</Text>
                  </View>
                </View>
                
                <Text style={styles.contactSpecialty}>{contact.specialty}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 8,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  urgentResourceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  resourceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  urgentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  urgentIndicatorText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    flex: 1,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16A34A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  callButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  contactDetails: {
    marginBottom: 12,
  },
  contactDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  contactDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  contactSpecialty: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1E40AF',
    fontStyle: 'italic',
  },
  detailContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1E40AF',
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  urgentText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  detailTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  detailDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    paddingHorizontal: 20,
    marginBottom: 20,
    lineHeight: 24,
  },
  contentScroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 24,
    marginBottom: 24,
  },
  emergencyNote: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  emergencyNoteText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#DC2626',
    lineHeight: 20,
  },
  bottomPadding: {
    height: 20,
  },
});