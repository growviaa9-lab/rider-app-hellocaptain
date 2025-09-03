import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// --- Updated Props ---
// Navigation is now optional, and onBack/showHeader are added for embedded use.
interface AboutUsScreenProps {
  navigation?: {
    goBack: () => void;
  };
  onBack?: () => void;
  showHeader?: boolean;
}

const AboutUsScreen: React.FC<AboutUsScreenProps> = ({ navigation, onBack, showHeader = true }) => {
  // Function to handle opening external links for contact methods
  const handleContact = (type: string) => {
    switch (type) {
      case 'email':
        Linking.openURL('mailto:support@hellocaptain.com');
        break;
      case 'phone':
        Linking.openURL('tel:+91-1800-123-4567');
        break;
      case 'website':
        Linking.openURL('https://www.hellocaptain.com');
        break;
    }
  };

  // This function decides whether to call onBack (if embedded)
  // or navigation.goBack (if standalone).
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header is now conditionally rendered */}
      {showHeader && (
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About Us</Text>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Company Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Icon name="star" size={48} color="white" />
          </View>
          <Text style={styles.companyName}>Hello Captain</Text>
          <Text style={styles.tagline}>
            Your trusted ride-sharing partner
          </Text>
        </View>

        {/* App Version Info Card */}
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>App Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={[styles.infoRow, { marginTop: 8 }]}>
            <Text style={styles.infoLabel}>Build Number</Text>
            <Text style={styles.infoValue}>2024.01.001</Text>
          </View>
        </View>

        {/* Company Description Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Our Story</Text>
          <Text style={styles.sectionBody}>
            Hello Captain is a leading ride-sharing platform that connects
            riders with reliable drivers. Founded in 2020, we've been committed
            to providing safe, affordable, and convenient transportation
            solutions across India.
          </Text>
        </View>

        {/* Mission & Vision Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={[styles.sectionBody, { marginBottom: 16 }]}>
            To revolutionize urban mobility by creating a seamless, safe, and
            sustainable transportation ecosystem that benefits both riders and
            drivers.
          </Text>
          <Text style={styles.sectionTitle}>Our Vision</Text>
          <Text style={styles.sectionBody}>
            To become India's most trusted and preferred ride-sharing platform,
            setting new standards for safety, reliability, and customer
            satisfaction.
          </Text>
        </View>

        {/* Key Features Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Why Choose Hello Captain?</Text>
          <View>
            <View style={styles.featureItem}>
              <Icon name="security" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>
                Verified drivers with background checks
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="location-on" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Real-time GPS tracking</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="payment" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>
                Multiple payment options
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="support-agent" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>24/7 customer support</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="eco" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>
                Eco-friendly ride options
              </Text>
            </View>
          </View>
        </View>
        
        {/* Contact Information Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <TouchableOpacity
            onPress={() => handleContact('email')}
            style={styles.contactItem}
          >
            <Icon name="email" size={20} color="#4A90E2" />
            <View style={styles.contactDetails}>
              <Text style={styles.contactTitle}>Email Support</Text>
              <Text style={styles.contactInfo}>support@hellocaptain.com</Text>
            </View>
            <Icon name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleContact('phone')}
            style={styles.contactItem}
          >
            <Icon name="phone" size={20} color="#4A90E2" />
            <View style={styles.contactDetails}>
              <Text style={styles.contactTitle}>Customer Care</Text>
              <Text style={styles.contactInfo}>1800-123-4567</Text>
            </View>
            <Icon name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleContact('website')}
            style={styles.contactItem}
          >
            <Icon name="language" size={20} color="#4A90E2" />
            <View style={styles.contactDetails}>
              <Text style={styles.contactTitle}>Website</Text>
              <Text style={styles.contactInfo}>www.hellocaptain.com</Text>
            </View>
            <Icon name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>
        </View>
        
        {/* Legal Information Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <View>
            <TouchableOpacity style={styles.legalButton}><Text style={styles.legalLink}>Privacy Policy</Text></TouchableOpacity>
            <TouchableOpacity style={styles.legalButton}><Text style={styles.legalLink}>Terms of Service</Text></TouchableOpacity>
            <TouchableOpacity style={styles.legalButton}><Text style={styles.legalLink}>Cookie Policy</Text></TouchableOpacity>
            <TouchableOpacity style={styles.legalButton}><Text style={styles.legalLink}>Data Protection</Text></TouchableOpacity>
          </View>
        </View>

        {/* Copyright */}
        <View style={styles.footer}>
          <Text style={styles.copyrightText}>
            © 2024 Hello Captain. All rights reserved.
          </Text>
          <Text style={styles.madeInText}>
            Made with ❤️ in India
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#007AFF', // Example primary color
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  tagline: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    color: '#374151',
    fontSize: 16,
  },
  infoValue: {
    color: '#1F2937',
    fontWeight: '500',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  sectionBody: {
    color: '#4B5563',
    lineHeight: 24,
    fontSize: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    color: '#374151',
    marginLeft: 12,
    fontSize: 16,
    flex: 1, // Allow text to wrap
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#FFFFFF'
  },
  contactDetails: {
    marginLeft: 12,
    flex: 1,
  },
  contactTitle: {
    fontWeight: '500',
    color: '#1F2937',
    fontSize: 16,
  },
  contactInfo: {
    fontSize: 14,
    color: '#6B7280',
  },
  legalButton: {
    marginBottom: 8,
  },
  legalLink: {
    color: '#007AFF',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 20,
  },
  copyrightText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  madeInText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default AboutUsScreen;

