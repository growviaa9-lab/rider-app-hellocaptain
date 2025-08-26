import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const RechargeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('upi');

  const paymentMethods = [
    { id: 'upi', label: 'UPI', icon: 'account-balance-wallet', color: 'text-green-600' },
    { id: 'card', label: 'Credit/Debit Card', icon: 'credit-card', color: 'text-blue-600' },
    { id: 'netbanking', label: 'Net Banking', icon: 'account-balance', color: 'text-purple-600' },
  ];

  const quickAmounts = ['100', '200', '500', '1000', '2000'];

  const handleRecharge = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }
    
    Alert.alert(
      'Confirm Recharge',
      `Recharge ₹${amount} using ${paymentMethods.find(m => m.id === selectedMethod)?.label}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Recharge', onPress: () => {
          Alert.alert('Success', 'Recharge initiated successfully!');
          navigation.goBack();
        }}
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black">Recharge Wallet</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Current Balance */}
        <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 mt-4 shadow-sm">
          <Text className="text-sm text-gray-600 mb-2">Current Balance</Text>
          <Text className="text-3xl font-bold text-primary">₹3,482</Text>
        </View>

        {/* Amount Input */}
        <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-black mb-3">Enter Amount</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg px-3 bg-white">
            <Text className="text-2xl font-bold text-gray-400 mr-2">₹</Text>
            <TextInput
              className="flex-1 text-2xl font-bold text-black"
              placeholder="0"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              placeholderTextColor="#999"
            />
          </View>
          
          {/* Quick Amount Buttons */}
          <View className="flex-row flex-wrap mt-3">
            {quickAmounts.map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                onPress={() => setAmount(quickAmount)}
                className={`mr-2 mb-2 px-4 py-2 rounded-full bg-white border ${
                  amount === quickAmount
                    ? 'bg-primary border-primary'
                    : 'border-gray-300'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    amount === quickAmount ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  ₹{quickAmount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Payment Method Selection */}
        <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-black mb-3">Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => setSelectedMethod(method.id)}
              className={`flex-row items-center p-3 rounded-lg mb-2 ${
                selectedMethod === method.id ? 'bg-white border border-gray-200' : ''
              }`}
            >
              <View className={`w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3`}>
                <Icon name={method.icon} size={20} className={method.color} />
              </View>
              <Text className="flex-1 text-base text-gray-800">{method.label}</Text>
              <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                selectedMethod === method.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
              }`}>
                {selectedMethod === method.id && (
                  <View className="w-2 h-2 rounded-full bg-white" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recharge Button */}
        <TouchableOpacity
          onPress={handleRecharge}
          className="bg-primary py-4 rounded-lg mb-6"
          disabled={!amount || parseFloat(amount) <= 0}
        >
          <Text className="text-white text-center text-lg font-bold">
            Recharge ₹{amount || '0'}
          </Text>
        </TouchableOpacity>

        {/* Info */}
        <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <View className="flex-row items-start">
            <Icon name="info" size={20} color="#3B82F6" className="mr-2 mt-0.5" />
            <View className="flex-1">
              <Text className="text-sm text-blue-800 font-medium mb-1">Important Notes:</Text>
              <Text className="text-xs text-blue-700">
                • Minimum recharge amount: ₹100{'\n'}
                • Maximum recharge amount: ₹50,000{'\n'}
                • Recharge will be processed within 2-3 minutes{'\n'}
                • Service charges may apply based on payment method
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RechargeScreen;


