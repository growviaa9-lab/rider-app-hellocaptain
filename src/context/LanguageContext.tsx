import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en' | 'ne';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation object
const translations = {
  en: {
    // Location Permission Screen
    enableLocation: 'Enable Location!',
    locationDescription: 'This app requires location information for\nRide Booking, Pick Up and Drop',
    givePermission: 'Give Permission',
    
    // Language Selection
    selectLanguage: 'Select Language',
    english: 'English',
    nepali: 'Nepali',
    
    // Common
    helloCaptain: 'Hello Captain',
    tagline: 'Nepali by Heart, Nepali by Purpose.',
    continue: 'Continue',
    back: 'Back',
    loading: 'Loading...',
  },
  ne: {
    // Location Permission Screen
    enableLocation: 'स्थान सक्षम गर्नुहोस्!',
    locationDescription: 'यो एप्लिकेसनलाई राइड बुकिङ, पिक अप र\nड्रपको लागि स्थान जानकारी चाहिन्छ',
    givePermission: 'अनुमति दिनुहोस्',
    
    // Language Selection
    selectLanguage: 'भाषा छान्नुहोस्',
    english: 'अङ्ग्रेजी',
    nepali: 'नेपाली',
    
    // Common
    helloCaptain: 'हैलो क्याप्टेन',
    tagline: 'मनले नेपाली, उद्देश्यले नेपाली।',
    continue: 'जारी राख्नुहोस्',
    back: 'फिर्ता',
    loading: 'लोड हुँदैछ...',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    loadLanguagePreference();
  }, []);

  const loadLanguagePreference = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ne')) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Error loading language preference:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    try {
      await AsyncStorage.setItem('language', lang);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
