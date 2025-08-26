import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'credit', label: 'Credit' },
    { id: 'debit', label: 'Debit' },
    { id: 'pending', label: 'Pending' },
  ];

  const transactions = [
    {
      id: '1',
      type: 'credit',
      amount: 500,
      description: 'Wallet Recharge',
      date: '2024-01-15',
      time: '14:30',
      status: 'completed',
      icon: 'account-balance-wallet',
      iconColor: 'text-green-600',
    },
    {
      id: '2',
      type: 'debit',
      amount: 150,
      description: 'Ride Payment',
      date: '2024-01-14',
      time: '18:45',
      status: 'completed',
      icon: 'directions-car',
      iconColor: 'text-red-600',
    },
    {
      id: '3',
      type: 'credit',
      amount: 1000,
      description: 'Bonus Credit',
      date: '2024-01-13',
      time: '10:15',
      status: 'completed',
      icon: 'card-giftcard',
      iconColor: 'text-blue-600',
    },
    {
      id: '4',
      type: 'debit',
      amount: 200,
      description: 'Withdrawal',
      date: '2024-01-12',
      time: '16:20',
      status: 'pending',
      icon: 'account-balance',
      iconColor: 'text-orange-600',
    },
    {
      id: '5',
      type: 'credit',
      amount: 300,
      description: 'Referral Bonus',
      date: '2024-01-11',
      time: '12:00',
      status: 'completed',
      icon: 'share',
      iconColor: 'text-purple-600',
    },
    {
      id: '6',
      type: 'debit',
      amount: 80,
      description: 'Service Fee',
      date: '2024-01-10',
      time: '09:30',
      status: 'completed',
      icon: 'receipt',
      iconColor: 'text-gray-600',
    },
  ];

  const filteredTransactions = transactions.filter(transaction => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'credit') return transaction.type === 'credit';
    if (selectedFilter === 'debit') return transaction.type === 'debit';
    if (selectedFilter === 'pending') return transaction.status === 'pending';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-orange-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  const renderTransaction = ({ item }: { item: any }) => (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View
            className={`w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3`}
          >
            <Icon name={item.icon} size={20} className={item.iconColor} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-medium text-gray-800">
              {item.description}
            </Text>
            <Text className="text-sm text-gray-500">
              {item.date} at {item.time}
            </Text>
          </View>
        </View>
        <View className="items-end">
          <Text
            className={`text-lg font-bold ${
              item.type === 'credit' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {item.type === 'credit' ? '+' : '-'}₹{item.amount}
          </Text>
          <Text className={`text-xs ${getStatusColor(item.status)}`}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>
    </View>
  );

  const totalCredit = transactions
    .filter(t => t.type === 'credit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebit = transactions
    .filter(t => t.type === 'debit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black">
          Transaction Details
        </Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <View className="flex-row mt-4 mb-4">
          <View className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-4 mr-2 shadow-sm">
            <Text className="text-sm text-gray-600 mb-1">Total Credit</Text>
            <Text className="text-xl font-bold text-green-600">
              ₹{totalCredit}
            </Text>
          </View>
          <View className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-4 ml-2 shadow-sm">
            <Text className="text-sm text-gray-600 mb-1">Total Debit</Text>
            <Text className="text-xl font-bold text-red-600">
              ₹{totalDebit}
            </Text>
          </View>
        </View>

        {/* Filters */}
        <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-black mb-3">
            Filter Transactions
          </Text>
          <View className="flex-row">
            {filters.map(filter => (
              <TouchableOpacity
                key={filter.id}
                onPress={() => setSelectedFilter(filter.id)}
                className={`mr-3 px-4 py-2 rounded-full bg-white border ${
                  selectedFilter === filter.id
                    ? 'bg-primary border-primary'
                    : 'border-gray-300'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    selectedFilter === filter.id
                      ? 'text-white'
                      : 'text-gray-600'
                  }`}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Transactions List */}
        <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-black">
              Transactions
            </Text>
            <Text className="text-sm text-gray-500">
              {filteredTransactions.length} transactions
            </Text>
          </View>

          {filteredTransactions.length > 0 ? (
            filteredTransactions.map(transaction => (
              <View key={transaction.id} className="mb-3 last:mb-0">
                {renderTransaction({ item: transaction })}
              </View>
            ))
          ) : (
            <View className="items-center py-8">
              <Icon name="receipt-long" size={48} color="#999" />
              <Text className="text-gray-500 mt-2">No transactions found</Text>
            </View>
          )}
        </View>

        {/* Export Options */}
        <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-black mb-3">Export</Text>
          <View className="flex-row">
            <TouchableOpacity className="flex-row items-center mr-6">
              <Icon name="picture-as-pdf" size={20} color="#DC2626" />
              <Text className="text-red-600 ml-2">PDF Report</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center">
              <Icon name="table-chart" size={20} color="#059669" />
              <Text className="text-green-600 ml-2">Excel Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailScreen;
