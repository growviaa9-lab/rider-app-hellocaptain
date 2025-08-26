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

const WithdrawScreen: React.FC = () => {
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('account1');

  const bankAccounts = [
    {
      id: 'account1',
      bankName: 'HDFC Bank',
      accountNumber: 'XXXX XXXX 1234',
      accountType: 'Savings Account',
      color: 'text-blue-600'
    },
    {
      id: 'account2',
      bankName: 'ICICI Bank',
      accountNumber: 'XXXX XXXX 5678',
      accountType: 'Current Account',
      color: 'text-purple-600'
    }
  ];

  const quickAmounts = ['500', '1000', '2000', '5000', '10000'];

  const handleWithdraw = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }
    
    if (parseFloat(amount) > 3482) {
      Alert.alert('Insufficient Balance', 'Amount exceeds available balance');
      return;
    }
    
    Alert.alert(
      'Confirm Withdrawal',
      `Withdraw ₹${amount} to ${bankAccounts.find(a => a.id === selectedAccount)?.bankName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Withdraw', onPress: () => {
          Alert.alert('Success', 'Withdrawal request submitted successfully!');
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
        <Text className="text-xl font-bold text-black">Withdraw Money</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Current Balance */}
        <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 mt-4 shadow-sm">
          <Text className="text-sm text-gray-600 mb-2">Available Balance</Text>
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

        {/* Bank Account Selection */}
        <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-black">Select Bank Account</Text>
            <TouchableOpacity className="flex-row items-center">
              <Icon name="add" size={20} color="#3B82F6" />
              <Text className="text-blue-600 ml-1">Add New</Text>
            </TouchableOpacity>
          </View>
          
          {bankAccounts.map((account) => (
            <TouchableOpacity
              key={account.id}
              onPress={() => setSelectedAccount(account.id)}
              className={`flex-row items-center p-3 rounded-lg mb-2 ${
                selectedAccount === account.id ? 'bg-white border border-gray-200' : ''
              }`}
            >
              <View className={`w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3`}>
                <Icon name="account-balance" size={20} className={account.color} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-800">{account.bankName}</Text>
                <Text className="text-sm text-gray-600">{account.accountNumber}</Text>
                <Text className="text-xs text-gray-500">{account.accountType}</Text>
              </View>
              <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                selectedAccount === account.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
              }`}>
                {selectedAccount === account.id && (
                  <View className="w-2 h-2 rounded-full bg-white" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Withdrawal Button */}
        <TouchableOpacity
          onPress={handleWithdraw}
          className="bg-primary py-4 rounded-lg mb-6"
          disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > 3482}
        >
          <Text className="text-white text-center text-lg font-bold">
            Withdraw ₹{amount || '0'}
          </Text>
        </TouchableOpacity>

        {/* Info */}
        <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <View className="flex-row items-start">
            <Icon name="info" size={20} color="#3B82F6" className="mr-2 mt-0.5" />
            <View className="flex-1">
              <Text className="text-sm text-blue-800 font-medium mb-1">Important Notes:</Text>
              <Text className="text-xs text-blue-700">
                • Minimum withdrawal amount: ₹500{'\n'}
                • Maximum withdrawal amount: ₹50,000{'\n'}
                • Withdrawal will be processed within 24-48 hours{'\n'}
                • ₹10 processing fee applies for withdrawals below ₹1000
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WithdrawScreen;


