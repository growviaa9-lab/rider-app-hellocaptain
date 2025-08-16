import React from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { useLanguage, Language } from '../context/LanguageContext';

interface LanguageSelectionScreenProps {
  onLanguageSelected: () => void;
}

const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({
  onLanguageSelected,
}) => {
  const { theme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageSelect = (selectedLanguage: Language) => {
    setLanguage(selectedLanguage);
    onLanguageSelected();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background - Add taxi driver image: src/assets/images/taxi_driver_background.jpg */}
      <View style={[styles.backgroundImage, { backgroundColor: theme.colors.primary }]}>
        {/* Placeholder background until image is added */}
        {/* Overlay */}
        <View style={styles.overlay} />
        
        {/* Language Selection Card */}
        <View style={styles.contentContainer}>
          <Card style={styles.selectionCard}>
            <Card.Content style={styles.cardContent}>
              <Text style={[styles.titleText, { color: theme.colors.onSurface }]}>
                {t('selectLanguage')}
              </Text>
              
              <View style={styles.languageOptions}>
                {/* English Option */}
                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    { backgroundColor: theme.colors.surface },
                    language === 'en' && [styles.languageOptionSelected, { borderColor: theme.colors.primary }]
                  ]}
                  onPress={() => handleLanguageSelect('en')}
                >
                  <View style={styles.flagContainer}>
                    {/* US Flag - Add this image: src/assets/images/flag_us.png */}
                    <View style={styles.flagPlaceholder}>
                      <Text style={styles.flagText}>🇺🇸</Text>
                    </View>
                  </View>
                  <Text style={[styles.languageText, { color: theme.colors.onSurface }]}>
                    {t('english')}
                  </Text>
                </TouchableOpacity>

                {/* Nepali Option */}
                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    { backgroundColor: theme.colors.surface },
                    language === 'ne' && [styles.languageOptionSelected, { borderColor: theme.colors.primary }]
                  ]}
                  onPress={() => handleLanguageSelect('ne')}
                >
                  <View style={styles.flagContainer}>
                    {/* Nepal Flag - Add this image: src/assets/images/flag_nepal.png */}
                    <View style={styles.flagPlaceholder}>
                      <Text style={styles.flagText}>🇳🇵</Text>
                    </View>
                  </View>
                  <Text style={[styles.languageText, { color: theme.colors.onSurface }]}>
                    {t('nepali')}
                  </Text>
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 50,
  },
  selectionCard: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    padding: 24,
    paddingTop: 32,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: 0.5,
  },
  languageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  languageOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 16,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  languageOptionSelected: {
    borderWidth: 3,
    elevation: 6,
  },
  flagContainer: {
    marginBottom: 16,
  },
  flagPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    elevation: 2,
  },
  flagText: {
    fontSize: 36,
  },
  languageText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});

export default LanguageSelectionScreen;
