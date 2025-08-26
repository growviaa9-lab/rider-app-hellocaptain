import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface LanguageScreenProps {
  navigation: any;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isSelected: boolean;
}

const LanguageScreen: React.FC<LanguageScreenProps> = ({ navigation }) => {
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
            onPress: () => navigation.goBack(),
          },
        ],
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Icon name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Language</Text>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Language Icon */}
        <View className="items-center mb-6">
          <View className="w-20 h-20 rounded-full bg-blue-100 items-center justify-center mb-3">
            <Icon name="language" size={40} color="#4A90E2" />
          </View>
          <Text className="text-lg font-semibold text-gray-800">
            Choose Your Language
          </Text>
          <Text className="text-sm text-gray-600 text-center mt-2">
            Select your preferred language for the app
          </Text>
        </View>

        {/* Language List */}
        <View className="space-y-2">
          {languages.map(language => (
            <TouchableOpacity
              key={language.code}
              onPress={() => selectLanguage(language.code)}
              className={`flex-row items-center p-4 rounded-lg border ${
                language.isSelected
                  ? 'bg-blue-50 border-blue-300'
                  : 'bg-white border-gray-200'
              }`}
            >
              {/* Flag */}
              <Text className="text-2xl mr-4">{language.flag}</Text>

              {/* Language Info */}
              <View className="flex-1">
                <Text
                  className={`font-medium ${
                    language.isSelected ? 'text-blue-800' : 'text-gray-800'
                  }`}
                >
                  {language.name}
                </Text>
                <Text
                  className={`text-sm ${
                    language.isSelected ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  {language.nativeName}
                </Text>
              </View>

              {/* Selection Indicator */}
              {language.isSelected && (
                <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center">
                  <Icon name="check" size={16} color="white" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Language Information */}
        <View className="bg-blue-50 p-4 rounded-lg mt-6">
          <Text className="text-sm font-medium text-blue-800 mb-2">Note:</Text>
          <Text className="text-xs text-blue-700 leading-5">
            • Changing the language will affect the entire app interface{'\n'}•
            Some content may remain in the original language{'\n'}• The change
            will take effect immediately
          </Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          className="bg-blue-500 py-4 rounded-lg mt-6 mb-4"
        >
          <Text className="text-white text-center font-bold text-lg">
            Apply Language
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LanguageScreen;
