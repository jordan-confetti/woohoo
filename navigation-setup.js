// navigation/AppNavigator.js
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import colors from '../utils/colors';
import constants from '../utils/constants';

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const authToken = useSelector(state => state.auth.token);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem(constants.STORAGE_KEYS.AUTH_TOKEN);
        setIsAuthenticated(!!token || !!authToken);
      } catch (error) {
        console.log('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [authToken]);

  // Watch for auth state changes from Redux
  useEffect(() => {
    if (authToken) {
      setIsAuthenticated(true);
    } else if (authToken === null) {
      setIsAuthenticated(false);
    }
  }, [authToken]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary }}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  return isAuthenticated ? <MainNavigator /> : <AuthNavigator />;
};

export default AppNavigator;

// navigation/AuthNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PhoneScreen from '../screens/auth/PhoneScreen';
import CodeScreen from '../screens/auth/CodeScreen';
import NameScreen from '../screens/auth/NameScreen';
import UsernameScreen from '../screens/auth/UsernameScreen';
import ProfilePicScreen from '../screens/auth/ProfilePicScreen';
import AddFriendsScreen from '../screens/friends/AddFriendsScreen';
import constants from '../utils/constants';
import colors from '../utils/colors';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name={constants.ROUTES.PHONE} component={PhoneScreen} />
      <Stack.Screen name={constants.ROUTES.CODE} component={CodeScreen} />
      <Stack.Screen name={constants.ROUTES.NAME} component={NameScreen} />
      <Stack.Screen name={constants.ROUTES.USERNAME} component={UsernameScreen} />
      <Stack.Screen name={constants.ROUTES.PROFILE_PIC} component={ProfilePicScreen} />
      <Stack.Screen name={constants.ROUTES.ADD_FRIENDS} component={AddFriendsScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

// navigation/MainNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FeedScreen from '../screens/FeedScreen';
import WoohooScreen from '../screens/woohoo/WoohooScreen';
import LoadingScreen from '../screens/woohoo/LoadingScreen';
import FriendProfileScreen from '../screens/friends/FriendProfileScreen';
import AddFriendsScreen from '../screens/friends/AddFriendsScreen';
import colors from '../utils/colors';
import constants from '../utils/constants';

const Tab = createBottomTabNavigator();
const WoohooStack = createStackNavigator();
const FeedStack = createStackNavigator();
const FriendsStack = createStackNavigator();

// Woohoo tab stack
const WoohooStackNavigator = () => (
  <WoohooStack.Navigator screenOptions={{ headerShown: false }}>
    <WoohooStack.Screen name={constants.ROUTES.WOOHOO} component={WoohooScreen} />
    <WoohooStack.Screen name={constants.ROUTES.LOADING} component={LoadingScreen} />
  </WoohooStack.Navigator>
);

// Feed tab stack
const FeedStackNavigator = () => (
  <FeedStack.Navigator screenOptions={{ headerShown: false }}>
    <FeedStack.Screen name={constants.ROUTES.FEED} component={FeedScreen} />
    <FeedStack.Screen name={constants.ROUTES.FRIEND_PROFILE} component={FriendProfileScreen} />
  </FeedStack.Navigator>
);

// Friends tab stack
const FriendsStackNavigator = () => (
  <FriendsStack.Navigator screenOptions={{ headerShown: false }}>
    <FriendsStack.Screen name={constants.ROUTES.ADD_FRIENDS} component={AddFriendsScreen} />
  </FriendsStack.Navigator>
);

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.secondary,
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 5,
        },
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'FeedTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'WoohooTab') {
            iconName = focused ? 'send' : 'send-outline';
          } else if (route.name === 'FriendsTab') {
            iconName = focused ? 'people' : 'people-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="FeedTab" component={FeedStackNavigator} />
      <Tab.Screen name="WoohooTab" component={WoohooStackNavigator} />
      <Tab.Screen name="FriendsTab" component={FriendsStackNavigator} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
