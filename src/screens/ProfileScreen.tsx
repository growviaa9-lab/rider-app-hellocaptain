import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Modal,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Import all the actual screen components ---
import AboutUsScreen from './Profile/AboutUsScreen';
import DriverRatingsScreen from './DriverRatingsScreen';
import ChangePasswordScreen from './Profile/ChangePasswordScreen';
import EditProfileScreen from './Profile/EditProfileScreen';
import EditVehicleScreen from './Profile/EditVehicleScreen';
import LanguageScreen from './Profile/LanguageScreen';
import RateAppScreen from './Profile/RateAppScreen';
import PrivacyScreen from './Profile/PrivacyScreen';
import ShareAppScreen from './Profile/ShareAppScreen';

// Define the types for the navigation stack for screens opened outside the panel
type ProfileStackParamList = {
  Recharge: undefined;
  Withdraw: undefined;
  Detail: undefined;
  LanguageSelection: undefined; 
};

// --- Props for the slide-in panel ---
interface ProfileScreenProps {
  visible: boolean;
  onClose: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();
  const slideAnim = useRef(new Animated.Value(400)).current; 
  const [currentView, setCurrentView] = useState('main');

  // --- Animation Logic ---
  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 400,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // Reset to main view after animation finishes to prevent flicker on next open
        setCurrentView('main');
      });
    }
  }, [visible, slideAnim]);


  const handleLogout = async () => {
    onClose(); 
    console.log('Logging out...');
    await AsyncStorage.multiRemove(['isLoggedIn', 'language', 'locationPermission', 'onboardingCompleted']);
    navigation.reset({
      index: 0,
      routes: [{ name: 'LanguageSelection' }],
    });
  };

  const confirmLogout = () => {
    Alert.alert(
      'Logout', 
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: handleLogout }
      ]
    );
  };

  const menuItems = [
    { id: 'EditProfile', icon: 'person', label: 'Edit Profile', iconColor: '#4B5563' },
    { id: 'ChangePassword', icon: 'lock', label: 'Change Password', iconColor: '#F59E0B' },
    { id: 'EditVehicle', icon: 'directions-car', label: 'Edit Vehicle', iconColor: '#F59E0B' },
    { id: 'DriverRatings', icon: 'star-half', label: 'Driver Ratings', iconColor: '#10B981' },
    { id: 'AboutUs', icon: 'info-outline', label: 'About Us', iconColor: '#4B5563' },
    { id: 'Language', icon: 'language', label: 'Language', iconColor: '#4B5563' },
    { id: 'Privacy', icon: 'security', label: 'Privacy', iconColor: '#4B5563' },
    { id: 'ShareApp', icon: 'share', label: 'Share App', iconColor: '#4B5563' },
    { id: 'RateApp', icon: 'star-rate', label: 'Rate App', iconColor: '#4B5563' },
    { id: 'Logout', icon: 'logout', label: 'Logout', iconColor: '#4B5563' },
  ];

  const financialActions = [
    { id: 'Recharge', icon: 'account-balance-wallet', label: 'Recharge', iconColor: '#F59E0B' },
    { id: 'Withdraw', icon: 'credit-card', label: 'Withdraw', iconColor: '#3B82F6' },
    { id: 'Detail', icon: 'description', label: 'Detail', iconColor: '#4B5563' },
  ];

  const MainProfileView = () => (
    <SafeAreaView style={styles.flex1}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.primary }]}>
          Profile
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Icon name="close" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.flex1} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.profileSummaryContainer}>
            <View style={styles.avatar}>
              <Icon name="person" size={40} color="#666" />
            </View>
            <View style={styles.flex1}>
              <Text style={styles.profileName}>lokik</Text>
              <Text style={styles.profileEmail}>uditpandey546@gmail.com</Text>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>4.5</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.balanceContainer}>
            <View>
              <Text style={styles.driverStatusTitle}>Great Ride</Text>
              <Text style={styles.driverStatusSubtitle}>Driver</Text>
            </View>
            <View style={styles.balanceDetails}>
              <Text style={styles.balanceLabel}>Balance</Text>
              <Text style={styles.balanceAmount}>₹3,482</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.financialActionsContainer}>
            {financialActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.financialActionItem}
                onPress={() => {
                  onClose(); 
                  navigation.navigate(action.id as keyof ProfileStackParamList);
                }}
              >
                <View style={styles.financialActionIconBg}>
                  <Icon name={action.icon} size={24} color={action.iconColor} />
                </View>
                <Text style={styles.financialActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, index !== menuItems.length - 1 && styles.menuItemBorder]}
              onPress={() => {
                // All these cases will now switch the view inside the modal
                if (item.id === 'Logout') {
                  confirmLogout();
                } else {
                  // Convert PascalCase ID to camelCase for state
                  const viewName = item.id.charAt(0).toLowerCase() + item.id.slice(1);
                  setCurrentView(viewName);
                }
              }}
            >
              <View style={styles.menuIconBg}>
                <Icon name={item.icon} size={20} color={item.iconColor} />
              </View>
              <Text style={styles.menuItemLabel}>{item.label}</Text>
              <Icon name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const renderContent = () => {
    switch(currentView) {
      case 'aboutUs':
        return <AboutUsScreen onBack={() => setCurrentView('main')} />;
      case 'driverRatings':
        return <DriverRatingsScreen onBack={() => setCurrentView('main')} />;
      case 'changePassword':
        return <ChangePasswordScreen onBack={() => setCurrentView('main')} />;
      case 'editProfile':
        return <EditProfileScreen onBack={() => setCurrentView('main')} />;
      case 'editVehicle':
        return <EditVehicleScreen onBack={() => setCurrentView('main')} />;
      case 'language':
        return <LanguageScreen onBack={() => setCurrentView('main')} />;
      case 'rateApp':
        return <RateAppScreen onBack={() => setCurrentView('main')} />;
      case 'privacy':
        return <PrivacyScreen onBack={() => setCurrentView('main')} />;
      case 'shareApp':
        return <ShareAppScreen onBack={() => setCurrentView('main')} />;
      default:
        return <MainProfileView />;
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="none"
    >
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <Animated.View 
          style={[
            styles.profileContainer, 
            { 
              backgroundColor: theme.colors.surface,
              transform: [{ translateX: slideAnim }] 
            }
          ]}
          onStartShouldSetResponder={() => true} 
        >
          {renderContent()}
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  profileContainer: {
    width: '90%',
    maxWidth: 400,
    height: '100%',
    position: 'absolute',
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scrollContainer: { paddingHorizontal: 16, paddingBottom: 16 },
  header: { 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', textTransform: 'uppercase' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  profileSummaryContainer: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#000000', marginBottom: 4 },
  profileEmail: { fontSize: 14, color: '#4B5563', marginBottom: 8 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 14, color: '#4B5563', marginLeft: 4 },
  balanceContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  driverStatusTitle: { fontSize: 18, fontWeight: '600', color: '#000000' },
  driverStatusSubtitle: { fontSize: 16, color: '#4B5563' },
  balanceDetails: { alignItems: 'flex-end' },
  balanceLabel: { fontSize: 14, color: '#4B5563' },
  balanceAmount: { fontSize: 20, fontWeight: 'bold', color: '#000000' },
  financialActionsContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  financialActionItem: { alignItems: 'center' },
  financialActionIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  financialActionLabel: { fontSize: 14, color: '#4B5563' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  menuIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemLabel: { flex: 1, fontSize: 16, color: '#1F2937' },
});

export default ProfileScreen;

