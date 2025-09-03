import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface LanguageScreenProps {
  navigation?: any;
  onBack?: () => void;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isSelected: boolean;
}

const LanguageScreen: React.FC<LanguageScreenProps> = ({ navigation, onBack }) => {
  const [languages, setLanguages] = useState<Language[]>([
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      isSelected: true,
    },
    {
      code: 'ne',
      name: 'Nepali',
      nativeName: 'नेपाली',
      flag: '🇳🇵',
      isSelected: false,
    },
  ]);

  const handleBack = () => {
    if (onBack) onBack();
    else if (navigation) navigation.goBack();
  };

  const selectLanguage = (code: string) => {
    setLanguages(prev =>
      prev.map(lang => ({
        ...lang,
        isSelected: lang.code === code,
      })),
    );
  };

  const handleSave = () => {
    const selectedLang = languages.find(lang => lang.isSelected);
    if (selectedLang) {
      Alert.alert(
        'Language Changed',
        `App language has been changed to ${selectedLang.name}`,
        [
          {
            text: 'OK',
            onPress: handleBack,
          },
        ],
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Language</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Language Icon and Title */}
        <View style={styles.titleContainer}>
          <View style={styles.iconWrapper}>
            <Icon name="language" size={40} color="#4A90E2" />
          </View>
          <Text style={styles.titleText}>Choose Your Language</Text>
          <Text style={styles.subtitleText}>
            Select your preferred language for the app
          </Text>
        </View>

        {/* Language List */}
        <View>
          {languages.map(language => (
            <TouchableOpacity
              key={language.code}
              onPress={() => selectLanguage(language.code)}
              style={[
                styles.languageItem,
                language.isSelected
                  ? styles.languageItemSelected
                  : styles.languageItemDefault,
              ]}>
              <Text style={styles.flagText}>{language.flag}</Text>
              <View style={styles.languageInfoContainer}>
                <Text
                  style={[
                    styles.languageName,
                    language.isSelected
                      ? styles.languageNameSelected
                      : styles.languageNameDefault,
                  ]}>
                  {language.name}
                </Text>
                <Text
                  style={[
                    styles.nativeName,
                    language.isSelected
                      ? styles.nativeNameSelected
                      : styles.nativeNameDefault,
                  ]}>
                  {language.nativeName}
                </Text>
              </View>
              {language.isSelected && (
                <View style={styles.checkIconContainer}>
                  <Icon name="check" size={16} color="white" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Language Information Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>Note:</Text>
          <Text style={styles.infoBoxText}>
            • Changing the language will affect the entire app interface{'\n'}
            • Some content may remain in the original language{'\n'}
            • The change will take effect immediately
          </Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Apply Language</Text>
        </TouchableOpacity>
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
    iconWrapper: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    titleText: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
    subtitleText: { fontSize: 14, color: '#4B5563', textAlign: 'center', marginTop: 8 },
    languageItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 8, borderWidth: 1, marginBottom: 8 },
    languageItemSelected: { backgroundColor: '#EFF6FF', borderColor: '#93C5FD' },
    languageItemDefault: { backgroundColor: 'white', borderColor: '#E5E7EB' },
    flagText: { fontSize: 24, marginRight: 16 },
    languageInfoContainer: { flex: 1 },
    languageName: { fontWeight: '500' },
    languageNameSelected: { color: '#1E40AF' },
    languageNameDefault: { color: '#1F2937' },
    nativeName: { fontSize: 14 },
    nativeNameSelected: { color: '#2563EB' },
    nativeNameDefault: { color: '#4B5563' },
    checkIconContainer: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center' },
    infoBox: { backgroundColor: '#EFF6FF', padding: 16, borderRadius: 8, marginTop: 24 },
    infoBoxTitle: { fontSize: 14, fontWeight: '500', color: '#1E40AF', marginBottom: 8 },
    infoBoxText: { fontSize: 12, color: '#1D4ED8', lineHeight: 20 },
    saveButton: { backgroundColor: '#3B82F6', paddingVertical: 16, borderRadius: 8, marginTop: 24, marginBottom: 16 },
    saveButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 18 },
  });

export default LanguageScreen;
