// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import friendsReducer from './friendsSlice';
import woohooReducer from './woohooSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    friends: friendsReducer,
    woohoo: woohooReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // For handling non-serializable values like Date objects
    }),
});

export default store;

// store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../utils/constants';

const initialState = {
  isAuthenticated: false,
  token: null,
  phoneNumber: null,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    setUserName: (state, action) => {
      if (!state.user) {
        state.user = {};
      }
      state.user.name = action.payload;
    },
    setUsername: (state, action) => {
      if (!state.user) {
        state.user = {};
      }
      state.user.username = action.payload;
    },
    setProfilePic: (state, action) => {
      if (!state.user) {
        state.user = {};
      }
      state.user.profilePic = action.payload;
    },
    verifyCode: (state, action) => {
      // This would be replaced with actual verification logic
      // For the mockup, we'll just set a placeholder token
      state.token = 'mock-auth-token';
      // Save token to AsyncStorage
      AsyncStorage.setItem(constants.STORAGE_KEYS.AUTH_TOKEN, state.token);
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
      
      // If user is authenticated, ensure we have a user object
      if (state.isAuthenticated && !state.user) {
        state.user = {
          id: 'current-user',
          name: 'You',
          username: 'yourusername',
          profilePic: 'https://via.placeholder.com/150',
        };
      }
      
      // Save user data to AsyncStorage
      if (state.user) {
        AsyncStorage.setItem(
          constants.STORAGE_KEYS.USER_DATA,
          JSON.stringify(state.user)
        );
      }
    },
    logout: (state) => {
      // Reset state
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      
      // Clear storage
      AsyncStorage.removeItem(constants.STORAGE_KEYS.AUTH_TOKEN);
      AsyncStorage.removeItem(constants.STORAGE_KEYS.USER_DATA);
    },
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setPhoneNumber,
  setUserName,
  setUsername,
  setProfilePic,
  verifyCode,
  setAuthenticated,
  logout,
  setAuthLoading,
  setAuthError,
} = authSlice.actions;

export default authSlice.reducer;

// store/friendsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  friends: [],
  friendRequests: [],
  loading: false,
  error: null,
};

const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    setFriends: (state, action) => {
      state.friends = action.payload;
    },
    addFriend: (state, action) => {
      // Check if friend already exists to avoid duplicates
      const friendExists = state.friends.some(
        friend => friend.id === action.payload.id
      );
      
      if (!friendExists) {
        state.friends.push(action.payload);
      }
    },
    removeFriend: (state, action) => {
      state.friends = state.friends.filter(
        friend => friend.id !== action.payload
      );
    },
    setFriendRequests: (state, action) => {
      state.friendRequests = action.payload;
    },
    addFriendRequest: (state, action) => {
      state.friendRequests.push(action.payload);
    },
    removeFriendRequest: (state, action) => {
      state.friendRequests = state.friendRequests.filter(
        request => request.id !== action.payload
      );
    },
    setFriendsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setFriendsError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setFriends,
  addFriend,
  removeFriend,
  setFriendRequests,
  addFriendRequest,
  removeFriendRequest,
  setFriendsLoading,
  setFriendsError,
} = friendsSlice.actions;

export default friendsSlice.reducer;

// store/woohooSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  woohoos: [],
  loading: false,
  error: null,
};

const woohooSlice = createSlice({
  name: 'woohoo',
  initialState,
  reducers: {
    setWoohoos: (state, action) => {
      state.woohoos = action.payload;
    },
    createWoohoo: (state, action) => {
      state.woohoos.unshift(action.payload);
    },
    deleteWoohoo: (state, action) => {
      state.woohoos = state.woohoos.filter(
        woohoo => woohoo.id !== action.payload
      );
    },
    setWoohooLoading: (state, action) => {
      state.loading = action.payload;
    },
    setWoohooError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setWoohoos,
  createWoohoo,
  deleteWoohoo,
  setWoohooLoading,
  setWoohooError,
} = woohooSlice.actions;

export default woohooSlice.reducer;

// utils/nfc.js - Utility for NFC interactions
import { Alert } from 'react-native';

// This is a mock implementation since we can't test real NFC functionality
// In a real app, you would use a library like react-native-nfc-manager

export const checkNfcSupport = () => {
  return new Promise((resolve) => {
    // Simulate checking for NFC support
    // In a real app, you would use NfcManager.isSupported()
    setTimeout(() => {
      resolve(true); // Pretend the device supports NFC
    }, 500);
  });
};

export const startNfcScan = (onSuccess, onError) => {
  // Simulate starting an NFC scan
  console.log('Starting NFC scan...');
  
  // In a real app, you would use NfcManager.start() and register event listeners
  
  // Simulate finding another device after a delay
  setTimeout(() => {
    // 80% chance of success for demo purposes
    if (Math.random() < 0.8) {
      onSuccess({
        id: Date.now().toString(),
        userId: '123', // ID of the friend's device
        timestamp: new Date().toISOString(),
      });
    } else {
      onError(new Error('Failed to establish NFC connection'));
    }
  }, 3000);
};

export const stopNfcScan = () => {
  // Simulate stopping an NFC scan
  console.log('Stopping NFC scan...');
  
  // In a real app, you would use NfcManager.unregisterTagEvent() and NfcManager.stop()
};

// utils/location.js - Utility for location services
import * as Location from 'expo-location';

export const getCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Location permission not granted');
    }
    
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    
    return location;
  } catch (error) {
    console.error('Error getting location:', error);
    throw error;
  }
};

export const getLocationName = async (latitude, longitude) => {
  try {
    const [result] = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    
    if (result) {
      // Format the location name based on available data
      if (result.name) {
        return result.name;
      } else if (result.street) {
        return result.street;
      } else if (result.city) {
        return result.city;
      }
    }
    
    return 'Unknown location';
  } catch (error) {
    console.error('Error getting location name:', error);
    return 'Unknown location';
  }
};

// api/auth.js - API functions for authentication
import constants from '../utils/constants';

// Base URL for API requests
const API_URL = constants.API_URL;

// Function to send verification code to phone number
export const sendVerificationCode = async (phoneNumber) => {
  try {
    // In a real app, you would make an API call here
    // For this mockup, we'll simulate a successful API response
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'Verification code sent',
    };
  } catch (error) {
    console.error('Error sending verification code:', error);
    throw error;
  }
};

// Function to verify the code entered by the user
export const verifyCode = async (phoneNumber, code) => {
  try {
    // In a real app, you would make an API call here
    // For this mockup, we'll simulate a successful API response
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate a valid code
    if (code.length === 6) {
      return {
        success: true,
        token: 'mock-auth-token',
        user: {
          id: 'user-123',
          phoneNumber,
        },
      };
    } else {
      throw new Error('Invalid verification code');
    }
  } catch (error) {
    console.error('Error verifying code:', error);
    throw error;
  }
};

// Function to register a new user
export const registerUser = async (userData) => {
  try {
    // In a real app, you would make an API call here
    // For this mockup, we'll simulate a successful API response
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      user: {
        id: 'user-123',
        ...userData,
      },
    };
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Function to login an existing user
export const loginUser = async (token) => {
  try {
    // In a real app, you would make an API call here to validate the token
    // For this mockup, we'll simulate a successful API response
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      user: {
        id: 'user-123',
        name: 'Test User',
        username: 'testuser',
        profilePic: 'https://via.placeholder.com/150',
      },
    };
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Function to logout the user
export const logoutUser = async () => {
  try {
    // In a real app, you would make an API call here to invalidate the token
    // For this mockup, we'll just simulate a successful logout
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      message: 'Logged out successfully',
    };
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

// api/woohoo.js - API functions for Woohoo interactions
import constants from '../utils/constants';

// Base URL for API requests
const API_URL = constants.API_URL;

// Function to create a new woohoo
export const createWoohoo = async (woohooData) => {
  try {
    // In a real app, you would make an API call here
    // For this mockup, we'll simulate a successful API response
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      woohoo: {
        id: Date.now().toString(),
        ...woohooData,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Error creating woohoo:', error);
    throw error;
  }
};

// Function to get the user's woohoo feed
export const getWoohooFeed = async () => {
  try {
    // In a real app, you would make an API call here
    // For this mockup, we'll simulate a successful API response
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return sample feed data
    return {
      success: true,
      woohoos: [
        // Sample woohoos would be returned here
      ],
    };
  } catch (error) {
    console.error('Error getting woohoo feed:', error);
    throw error;
  }
};

// Function to delete a woohoo
export const deleteWoohoo = async (woohooId) => {
  try {
    // In a real app, you would make an API call here
    // For this mockup, we'll simulate a successful API response
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      message: 'Woohoo deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting woohoo:', error);
    throw error;
  }
};

// api/friends.js - API functions for friend management
import constants from '../utils/constants';

// Base URL for API requests
const API_URL = constants.API_URL;

// Function to get the user's friends list
export const getFriends = async () => {
  try {
    // In a real app, you would make an API call here
    // For this mockup, we'll simulate a successful API response
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return sample friends data
    return {
      success: true,
      friends: [
        // Sample friends would be returned here
      ],
    };
  } catch (error) {
    console.error('Error getting friends:', error);
    throw error;
  }
};

// Function to add a friend
export const addFriend = async (userId) => {
  try {
    // In a real app, you would make an API call here
    // For this mockup, we'll simulate a successful API response
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      message: 'Friend added successfully',
    };
  } catch (error) {
    console.error('Error adding friend:', error);
    throw error;
  }
};

// Function to remove a friend
export const removeFriend = async (userId) => {
  try {
    // In a real app, you would make an API call here
    // For this mockup, we'll simulate a successful API response
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      message: 'Friend removed successfully',
    };
  } catch (error) {
    console.error('Error removing friend:', error);
    throw error;
  }
};

// Function to get friend requests
export const getFriendRequests = async () => {
  try {
    // In a real app, you would make an API call here
    // For this mockup, we'll simulate a successful API response
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return sample friend requests data
    return {
      success: true,
      requests: [
        // Sample friend requests would be returned here
      ],
    };
  } catch (error) {
    console.error('Error getting friend requests:', error);
    throw error;
  }
};

// Function to respond to a friend request
export const respondToFriendRequest = async (requestId, accept) => {
  try {
    // In a real app, you would make an API call here
    // For this mockup, we'll simulate a successful API response
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      message: accept ? 'Friend request accepted' : 'Friend request declined',
    };
  } catch (error) {
    console.error('Error responding to friend request:', error);
    throw error;
  }
};

// Function to search for users
export const searchUsers = async (query) => {
  try {
    // In a real app, you would make an API call here
    // For this mockup, we'll simulate a successful API response
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return sample search results
    return {
      success: true,
      users: [
        // Sample users would be returned here
      ],
    };
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};
