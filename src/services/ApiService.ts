import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ApiService {
  private api: AxiosInstance;
  private baseURL = 'https://api.hellocaptain.com'; // Replace with actual API URL

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle token expiration
          await AsyncStorage.removeItem('authToken');
          // Redirect to login screen
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth APIs
  async login(phoneNumber: string, otp: string) {
    try {
      const response = await this.api.post('/auth/login', {
        phoneNumber,
        otp,
      });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async sendOTP(phoneNumber: string) {
    try {
      const response = await this.api.post('/auth/send-otp', {
        phoneNumber,
      });
      return response.data;
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  }

  async register(userData: any) {
    try {
      const response = await this.api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Driver Profile APIs
  async getProfile() {
    try {
      const response = await this.api.get('/driver/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  async editProfile(profileData: any) {
    try {
      const response = await this.api.put('/driver/edit_profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  async changePassword(passwordData: { phone_number: string; password: string; new_password: string }) {
    try {
      const response = await this.api.post('/driver/changepass', passwordData);
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  // Ride APIs
  async getRideRequests() {
    try {
      const response = await this.api.get('/rides/requests');
      return response.data;
    } catch (error) {
      console.error('Get ride requests error:', error);
      throw error;
    }
  }

  async acceptRide(rideId: string) {
    try {
      const response = await this.api.post(`/rides/${rideId}/accept`);
      return response.data;
    } catch (error) {
      console.error('Accept ride error:', error);
      throw error;
    }
  }

  async updateRideStatus(rideId: string, status: string, location?: any) {
    try {
      const response = await this.api.patch(`/rides/${rideId}/status`, {
        status,
        location,
      });
      return response.data;
    } catch (error) {
      console.error('Update ride status error:', error);
      throw error;
    }
  }

  // Earnings APIs
  async getEarnings(period: 'daily' | 'weekly' | 'monthly') {
    try {
      const response = await this.api.get(`/driver/earnings?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Get earnings error:', error);
      throw error;
    }
  }

  // Location APIs
  async updateLocation(latitude: number, longitude: number) {
    try {
      const response = await this.api.post('/driver/location', {
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error('Update location error:', error);
      throw error;
    }
  }

  // Duty Status APIs
  async updateDutyStatus(isOnDuty: boolean) {
    try {
      const response = await this.api.patch('/driver/duty-status', {
        isOnDuty,
        timestamp: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error('Update duty status error:', error);
      throw error;
    }
  }

  // Vehicle APIs
  async editVehicle(vehicleData: {
    id: string;
    phone_number: string;
    id_kendaraan: number;
    brand: string;
    type: string;
    no_kendaraan: string;
    color: string;
  }) {
    try {
      const response = await this.api.post('/driver/edit_kendaraan', vehicleData);
      return response;
    } catch (error) {
      console.error('Edit vehicle error:', error);
      throw error;
    }
  }
}

export default new ApiService();
