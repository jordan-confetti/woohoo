// App.js - Main entry point for the Woohoo app
import React, { useEffect, useState } from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import AppNavigator from './navigation/AppNavigator';
import store from './store/store';
import colors from './utils/colors';
import { LogBox } from 'react-native';

// Ignore specific warnings
LogBox.ignoreLogs(['Remote debugger']);

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
          <AppNavigator />
        </SafeAreaView>
      </NavigationContainer>
    </Provider>
  );
};

export default App;

// utils/colors.js - App color scheme
export default {
  primary: '#FF41A5',        // Main pink color
  primaryDark: '#E03890',    // Darker pink for buttons
  secondary: '#000000',      // Black
  background: '#121212',     // Dark background
  text: '#FFFFFF',           // White text
  textSecondary: '#B0B0B0',  // Light gray text
  border: '#2A2A2A',         // Dark gray border
  success: '#4BB543',        // Green for success states
  error: '#FF3B30',          // Red for errors
  transparent: 'transparent',
};

// utils/constants.js - App constants
export default {
  APP_NAME: 'Woohoo',
  API_URL: 'https://api.woohoo.app', // Replace with your actual API URL
  
  // Storage keys
  STORAGE_KEYS: {
    AUTH_TOKEN: '@Woohoo:auth_token',
    USER_DATA: '@Woohoo:user_data',
  },

  // Default settings
  DEFAULT_SETTINGS: {
    notifications: true,
    locationSharing: true,
  },

  // Animation durations
  ANIMATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },

  // App routes
  ROUTES: {
    PHONE: 'Phone',
    CODE: 'Code',
    NAME: 'Name',
    USERNAME: 'Username',
    PROFILE_PIC: 'ProfilePic',
    ADD_FRIENDS: 'AddFriends',
    FEED: 'Feed',
    WOOHOO: 'Woohoo',
    LOADING: 'Loading',
    FRIEND_PROFILE: 'FriendProfile',
  },
};
