import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface RateAppScreenProps {
  navigation?: any;
  onBack?: () => void;
}

const RateAppScreen: React.FC<RateAppScreenProps> = ({ navigation, onBack }) => {
  const [rating, setRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const stars = [1, 2, 3, 4, 5];

  const handleBack = () => {
    if (onBack) onBack();
    else if (navigation) navigation.goBack();
  };

  const handleRating = (star: number) => {
    setRating(star);
  };

  const handleSubmitRating = () => {
    if (rating === 0) {
      Alert.alert('Please Rate', 'Please select a rating before submitting');
      return;
    }

    setHasRated(true);
    Alert.alert(
      'Thank You!',
      `Thank you for your ${rating}-star rating!`,
      [
        { text: 'Rate on Store', onPress: openAppStore },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  const openAppStore = () => {
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.hellocaptain.rider';
    Linking.openURL(playStoreUrl).catch(err => console.error("Couldn't load page", err));
  };

  const getRatingMessage = () => {
    switch (rating) {
      case 1: return "We're sorry to hear that. Please let us know how we can improve.";
      case 2: return "We appreciate your feedback. We're working to make it better.";
      case 3: return "Thank you for your feedback. We're constantly improving.";
      case 4: return "Great! We're glad you're enjoying Hello Captain.";
      case 5: return "Excellent! We're thrilled you love Hello Captain!";
      default: return 'Rate your experience with Hello Captain';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rate App</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <View style={styles.iconWrapper}>
            <Icon name="star" size={40} color="#F59E0B" />
          </View>
          <Text style={styles.titleText}>Rate Hello Captain</Text>
          <Text style={styles.subtitleText}>
            Your feedback helps us improve and serve you better
          </Text>
        </View>

        {hasRated && (
          <View style={styles.ratedCard}>
            <View style={styles.centerItems}>
              <View style={styles.starRow}>
                {stars.map((star) => (
                  <Icon
                    key={star}
                    name="star"
                    size={24}
                    color={star <= rating ? '#FFD700' : '#D1D5DB'}
                    style={styles.ratedStar}
                  />
                ))}
              </View>
              <Text style={styles.ratedText}>
                You rated us {rating} {rating === 1 ? 'star' : 'stars'}
              </Text>
              <Text style={styles.ratedSubtitle}>Thank you for your feedback!</Text>
            </View>
          </View>
        )}

        <View style={styles.ratingBox}>
          <Text style={styles.ratingQuestionText}>
            How would you rate your experience?
          </Text>
          <View style={styles.ratingStarsContainer}>
            {stars.map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleRating(star)}
                style={styles.starTouchable}>
                <Icon
                  name={star <= rating ? 'star' : 'star-border'}
                  size={40}
                  color={star <= rating ? '#FFD700' : '#D1D5DB'}
                />
              </TouchableOpacity>
            ))}
          </View>

          {rating > 0 && (
            <View style={styles.centerItems}>
              <Text style={styles.ratingValueText}>
                {rating} {rating === 1 ? 'Star' : 'Stars'}
              </Text>
              <Text style={styles.ratingMessage}>{getRatingMessage()}</Text>
            </View>
          )}
        </View>

        {rating > 0 && !hasRated && (
          <TouchableOpacity onPress={handleSubmitRating} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit Rating</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Why Rate Hello Captain?</Text>
            <View style={styles.infoItem}>
              <Icon name="check-circle" size={20} color="#4CAF50" style={styles.infoIcon} />
              <Text style={styles.infoText}>Help other users discover a reliable ride-sharing platform</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="check-circle" size={20} color="#4CAF50" style={styles.infoIcon} />
              <Text style={styles.infoText}>Your feedback drives our continuous improvement</Text>
            </View>
             <View style={styles.infoItem}>
              <Icon name="check-circle" size={20} color="#4CAF50" style={styles.infoIcon} />
              <Text style={styles.infoText}>Support our mission to revolutionize urban mobility</Text>
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
    iconWrapper: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    titleText: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
    subtitleText: { fontSize: 14, color: '#4B5563', textAlign: 'center', marginTop: 8 },
    ratedCard: { backgroundColor: 'white', borderRadius: 8, padding: 16, marginBottom: 16, borderWidth: 2, borderColor: '#A7F3D0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
    centerItems: { alignItems: 'center' },
    starRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    ratedStar: { marginHorizontal: 2 },
    ratedText: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
    ratedSubtitle: { fontSize: 14, color: '#4B5563', textAlign: 'center', marginTop: 4 },
    ratingBox: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 24, marginBottom: 16 },
    ratingQuestionText: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 16, textAlign: 'center' },
    ratingStarsContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    starTouchable: { marginHorizontal: 8 },
    ratingValueText: { fontSize: 18, fontWeight: '500', color: '#1F2937', marginBottom: 8 },
    ratingMessage: { fontSize: 14, color: '#4B5563', textAlign: 'center', lineHeight: 20 },
    submitButton: { backgroundColor: '#F59E0B', paddingVertical: 16, borderRadius: 8, marginBottom: 24 },
    submitButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 18 },
    infoCard: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 16, marginBottom: 16 },
    infoTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 16 },
    infoItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
    infoIcon: { marginTop: 2 },
    infoText: { color: '#374151', marginLeft: 12, flex: 1 },
});

export default RateAppScreen;
