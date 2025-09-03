import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import apiService from '../../services/ApiService';

interface EditVehicleScreenProps {
  navigation?: any;
  onBack?: () => void;
}

const EditVehicleScreen: React.FC<EditVehicleScreenProps> = ({
  navigation,
  onBack,
}) => {
  // State for form values, errors, and submission status
  const [values, setValues] = useState({
    phone_number: '',
    brand: '',
    type: '',
    no_kendaraan: '',
    color: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock API service for demonstration
  const apiService = {
    editVehicle: (payload: any) => new Promise(resolve => setTimeout(() => resolve({ status: 200 }), 1000)),
  };

  // --- Form validation without Yup ---
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!values.phone_number) {
        newErrors.phone_number = 'Phone number is required';
    } else if (!/^\+?[\d\s-]+$/.test(values.phone_number)) {
        newErrors.phone_number = 'Please enter a valid phone number';
    }
    if (!values.brand || values.brand.length < 2) {
      newErrors.brand = 'Vehicle brand must be at least 2 characters';
    }
    if (!values.type || values.type.length < 2) {
      newErrors.type = 'Vehicle type must be at least 2 characters';
    }
    if (!values.no_kendaraan || values.no_kendaraan.length < 3) {
      newErrors.no_kendaraan = 'Vehicle number must be at least 3 characters';
    }
    if (!values.color || values.color.length < 2) {
      newErrors.color = 'Color must be at least 2 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleBack = () => {
    if (onBack) onBack();
    else if (navigation) navigation.goBack();
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Assuming id and id_kendaraan are handled by the backend or context
      const payload = { ...values };
      const response = await apiService.editVehicle(payload);

      if (response.status === 200) {
        Alert.alert('Success', 'Vehicle information updated successfully!');
        handleBack();
      } else {
        Alert.alert('Error', 'Failed to update vehicle information');
      }
    } catch (error) {
      console.error('Error updating vehicle:', error);
      Alert.alert('Error', 'Failed to update vehicle information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChange = (name: keyof typeof values, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Vehicle</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          
          <View style={styles.titleContainer}>
            <View style={styles.iconWrapper}>
              <Icon name="directions-car" size={40} color="#F59E0B" />
            </View>
            <Text style={styles.titleText}>Vehicle Information</Text>
            <Text style={styles.subtitleText}>
              Update your vehicle details for ride verification
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={[styles.input, errors.phone_number && styles.inputError]}
                value={values.phone_number}
                onChangeText={text => handleChange('phone_number', text)}
                placeholder="Enter your phone number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
              {errors.phone_number && <Text style={styles.errorText}>{errors.phone_number}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Vehicle Brand</Text>
              <TextInput
                style={[styles.input, errors.brand && styles.inputError]}
                value={values.brand}
                onChangeText={text => handleChange('brand', text)}
                placeholder="e.g., Honda, Yamaha, TVS"
                placeholderTextColor="#9CA3AF"
              />
              {errors.brand && <Text style={styles.errorText}>{errors.brand}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Vehicle Type</Text>
              <TextInput
                style={[styles.input, errors.type && styles.inputError]}
                value={values.type}
                onChangeText={text => handleChange('type', text)}
                placeholder="e.g., Civic, Activa 6G, Jupiter"
                placeholderTextColor="#9CA3AF"
              />
              {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Vehicle Number</Text>
              <TextInput
                style={[styles.input, errors.no_kendaraan && styles.inputError]}
                value={values.no_kendaraan}
                onChangeText={text => handleChange('no_kendaraan', text)}
                placeholder="e.g., MH-01-AB-1234"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="characters"
              />
              {errors.no_kendaraan && <Text style={styles.errorText}>{errors.no_kendaraan}</Text>}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Vehicle Color</Text>
              <TextInput
                style={[styles.input, errors.color && styles.inputError]}
                value={values.color}
                onChangeText={text => handleChange('color', text)}
                placeholder="e.g., Black, White, Red"
                placeholderTextColor="#9CA3AF"
              />
              {errors.color && <Text style={styles.errorText}>{errors.color}</Text>}
            </View>
          </View>
          
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}>
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Saving...' : 'Save Vehicle Details'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'white' },
  flex1: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  container: { flex: 1, padding: 16 },
  scrollContent: { flexGrow: 1, paddingBottom: 20 },
  titleContainer: { alignItems: 'center', marginBottom: 24 },
  iconWrapper: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  titleText: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
  subtitleText: { fontSize: 14, color: '#4B5563', textAlign: 'center', marginTop: 8 },
  form: { marginBottom: 16 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#111827' },
  inputError: { borderColor: '#EF4444' },
  errorText: { color: '#EF4444', fontSize: 14, marginTop: 4 },
  submitButton: { backgroundColor: '#3B82F6', paddingVertical: 16, borderRadius: 8, marginTop: 16 },
  submitButtonDisabled: { backgroundColor: '#9CA3AF' },
  submitButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 18 },
});

export default EditVehicleScreen;
