import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Switch, // Added for uncommented code
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface PrivacyScreenProps {
  navigation?: any;
  onBack?: () => void;
}

const PrivacyScreen: React.FC<PrivacyScreenProps> = ({ navigation, onBack }) => {
  const [privacySettings, setPrivacySettings] = useState({
    locationSharing: true,
    profileVisibility: false,
    rideHistory: true,
    notifications: true,
    dataAnalytics: false,
    thirdPartySharing: false,
    biometricAuth: true,
    autoLock: true,
  });

  const handleBack = () => {
    if (onBack) onBack();
    else if (navigation) navigation.goBack();
  };

  const toggleSetting = (key: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
            // Add account deletion logic here
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <View style={styles.iconWrapper}>
            <Icon name="security" size={40} color="#4CAF50" />
          </View>
          <Text style={styles.titleText}>Privacy Settings</Text>
          <Text style={styles.subtitleText}>
            Control how your data is shared and used
          </Text>
        </View>

        {/* --- All sections below were uncommented for a complete UI --- */}

        {/* Location & Profile Privacy */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Location & Profile</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Location Sharing</Text>
              <Text style={styles.settingDescription}>Share location during rides</Text>
            </View>
            <Switch
              value={privacySettings.locationSharing}
              onValueChange={() => toggleSetting('locationSharing')}
              trackColor={{ false: '#D1D5DB', true: '#4CAF50' }}
              thumbColor={'#FFFFFF'}
            />
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Profile Visibility</Text>
              <Text style={styles.settingDescription}>Show profile to other users</Text>
            </View>
            <Switch
              value={privacySettings.profileVisibility}
              onValueChange={() => toggleSetting('profileVisibility')}
              trackColor={{ false: '#D1D5DB', true: '#4CAF50' }}
              thumbColor={'#FFFFFF'}
            />
          </View>
        </View>
        
        {/* Data Management */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Data Management</Text>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="download" size={20} color="#4A90E2" />
            <View style={styles.actionButtonTextContainer}>
              <Text style={styles.actionButtonTitle}>Download My Data</Text>
              <Text style={styles.actionButtonSubtitle}>Get a copy of your data</Text>
            </View>
            <Icon name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>
           <TouchableOpacity style={[styles.actionButton, { borderBottomWidth: 0}]}>
            <Icon name="delete" size={20} color="#F44336" />
            <View style={styles.actionButtonTextContainer}>
              <Text style={styles.actionButtonTitle}>Delete My Data</Text>
              <Text style={styles.actionButtonSubtitle}>Remove all your data</Text>
            </View>
            <Icon name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Account Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account</Text>
          <TouchableOpacity 
            onPress={handleDeleteAccount}
            style={[styles.actionButton, styles.deleteButton]}
          >
            <Icon name="delete-forever" size={20} color="#D32F2F" />
            <View style={styles.actionButtonTextContainer}>
              <Text style={[styles.actionButtonTitle, styles.deleteButtonTitle]}>Delete Account</Text>
              <Text style={[styles.actionButtonSubtitle, styles.deleteButtonSubtitle]}>Permanently remove account</Text>
            </View>
            <Icon name="arrow-forward-ios" size={16} color="#D32F2F" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  container: { flex: 1, padding: 16 },
  titleContainer: { alignItems: 'center', marginBottom: 24 },
  iconWrapper: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  titleText: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
  subtitleText: { fontSize: 14, color: '#4B5563', textAlign: 'center', marginTop: 8 },
  card: { backgroundColor: 'white', borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6', overflow: 'hidden' },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderColor: '#F3F4F6' },
  settingTextContainer: { flex: 1, marginRight: 8 },
  settingTitle: { fontWeight: '500', color: '#1F2937' },
  settingDescription: { fontSize: 14, color: '#6B7280' },
  actionButton: { flexDirection: 'row', alignItems: 'center', padding: 16, borderTopWidth: 1, borderColor: '#F3F4F6' },
  actionButtonTextContainer: { marginLeft: 12, flex: 1 },
  actionButtonTitle: { fontWeight: '500', color: '#1F2937' },
  actionButtonSubtitle: { fontSize: 14, color: '#6B7280' },
  deleteButton: { backgroundColor: '#FFEBEE' },
  deleteButtonTitle: { color: '#D32F2F' },
  deleteButtonSubtitle: { color: '#EF5350' },
});

export default PrivacyScreen;
