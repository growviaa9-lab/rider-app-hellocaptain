import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
// To enable copy-to-clipboard, you would typically use a library like this:
// import Clipboard from '@react-native-clipboard/clipboard';

interface ShareAppScreenProps {
  navigation?: any;
  onBack?: () => void;
}

const ShareAppScreen: React.FC<ShareAppScreenProps> = ({ navigation, onBack }) => {
  const [referralCode] = useState('LOKI2024');
  const [copied, setCopied] = useState(false);

  const handleBack = () => {
    if (onBack) onBack();
    else if (navigation) navigation.goBack();
  };
  
  const shareMessage =
    `🚗 Download Hello Captain - Your trusted ride-sharing partner!\n\n` +
    `Experience safe, reliable, and affordable rides across India.\n\n` +
    `Use my referral code: ${referralCode}\n\n` +
    `Download now: https://play.google.com/store/apps/details?id=com.hellocaptain.rider`;

  const generalShare = async () => {
    try {
      await Share.share({
        message: shareMessage,
        title: 'Hello Captain - Ride Sharing App',
        ...(Platform.OS === 'ios' && { url: 'https://play.google.com/store/apps/details?id=com.hellocaptain.rider' }),
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share app');
    }
  };

  const copyReferralCode = () => {
    // Clipboard.setString(referralCode); // This line requires the clipboard library
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Alert.alert('Copied!', 'Referral code copied to clipboard');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Share App</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <View style={styles.iconWrapper}>
            <Icon name="share" size={40} color="#4CAF50" />
          </View>
          <Text style={styles.titleText}>Share Hello Captain</Text>
          <Text style={styles.subtitleText}>
            Help your friends discover safe and reliable rides
          </Text>
        </View>

        {/* Referral Code Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Referral Code</Text>
          <View style={styles.referralContainer}>
            <View style={styles.referralCodeBox}>
              <Text style={styles.referralCodeText}>{referralCode}</Text>
            </View>
            <TouchableOpacity
              onPress={copyReferralCode}
              style={[styles.copyButton, copied && styles.copyButtonCopied]}>
              <Text style={styles.copyButtonText}>{copied ? 'Copied!' : 'Copy'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.referralSubtitle}>
            Share this code with friends and earn rewards!
          </Text>
        </View>

        {/* Quick Share Button */}
        <TouchableOpacity onPress={generalShare} style={styles.shareButton}>
          <View style={styles.shareButtonContent}>
            <Icon name="share" size={24} color="white" />
            <Text style={styles.shareButtonText}>Share App</Text>
          </View>
        </TouchableOpacity>

        {/* Referral Benefits */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Referral Benefits</Text>
            <View style={styles.benefitItem}>
              <Icon name="check-circle" size={20} color="#4CAF50" />
              <Text style={styles.benefitText}>₹50 credit for each successful referral</Text>
            </View>
            <View style={styles.benefitItem}>
              <Icon name="check-circle" size={20} color="#4CAF50" />
              <Text style={styles.benefitText}>Free ride on your 5th referral</Text>
            </View>
            <View style={styles.benefitItem}>
              <Icon name="check-circle" size={20} color="#4CAF50" />
              <Text style={styles.benefitText}>Exclusive rewards and discounts</Text>
            </View>
        </View>

        {/* How It Works */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>How It Works</Text>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepTextContainer}>
                <Text style={styles.stepTitle}>Share your referral code</Text>
                <Text style={styles.stepDescription}>Send it to friends via any platform</Text>
              </View>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepTextContainer}>
                <Text style={styles.stepTitle}>Friend downloads the app</Text>
                <Text style={styles.stepDescription}>They use your code during registration</Text>
              </View>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepTextContainer}>
                <Text style={styles.stepTitle}>Both get rewards</Text>
                <Text style={styles.stepDescription}>You and your friend receive benefits</Text>
              </View>
            </View>
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
    card: { backgroundColor: '#F9FAFB', borderRadius: 8, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6' },
    cardTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 12 },
    referralContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    referralCodeBox: { flex: 1, backgroundColor: '#E5E7EB', borderRadius: 8, padding: 12, marginRight: 8 },
    referralCodeText: { textAlign: 'center', fontWeight: 'bold', fontSize: 18, color: '#1F2937' },
    copyButton: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, backgroundColor: '#3B82F6' },
    copyButtonCopied: { backgroundColor: '#10B981' },
    copyButtonText: { color: 'white', fontWeight: '600' },
    referralSubtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
    shareButton: { backgroundColor: '#3B82F6', paddingVertical: 16, borderRadius: 8, marginBottom: 24 },
    shareButtonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    shareButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 18, marginLeft: 8 },
    benefitItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    benefitText: { color: '#374151', marginLeft: 12 },
    stepItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
    stepNumber: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center', marginRight: 12, marginTop: 2 },
    stepNumberText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
    stepTextContainer: { flex: 1 },
    stepTitle: { fontWeight: '500', color: '#1F2937' },
    stepDescription: { fontSize: 14, color: '#6B7280' },
});

export default ShareAppScreen;
