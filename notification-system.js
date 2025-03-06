// components/NotificationSystem.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../utils/colors';

const NotificationSystem = ({ navigation }) => {
  const [notification, setNotification] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const translateY = new Animated.Value(-100);

  // Mock function to simulate receiving notifications
  const mockReceiveNotification = () => {
    // Sample notification types
    const notificationTypes = [
      {
        type: 'woohoo',
        title: 'New Woohoo!',
        message: 'Alexis wants to woohoo with you!',
        timestamp: new Date(),
        data: { friendId: '123' },
      },
      {
        type: 'friend_request',
        title: 'New Friend Request',
        message: 'Jordan wants to be your friend',
        timestamp: new Date(),
        data: { userId: '456' },
      },
      {
        type: 'friend_woohoo',
        title: 'Friends Woohoo\'d!',
        message: 'Max and Kylee woohoo\'d at Starbucks',
        timestamp: new Date(),
        data: { woohooId: '789' },
      },
    ];

    // Randomly select a notification
    const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    
    // Show the notification
    showNotification(randomNotification);
  };

  // Show a notification banner
  const showNotification = (notificationData) => {
    setNotification(notificationData);
    setIsVisible(true);
    
    // Provide haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Animate notification in
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      speed: 12,
      bounciness: 5,
    }).start();

    // Hide notification after 4 seconds
    setTimeout(hideNotification, 4000);
  };

  // Hide the notification banner
  const hideNotification = () => {
    Animated.timing(translateY, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
      setNotification(null);
    });
  };

  // Handle notification press
  const handleNotificationPress = () => {
    hideNotification();
    
    if (!notification) return;
    
    // Navigate based on notification type
    switch (notification.type) {
      case 'woohoo':
        navigation.navigate('WoohooTab');
        break;
      case 'friend_request':
        navigation.navigate('FriendsTab');
        break;
      case 'friend_woohoo':
        navigation.navigate('FeedTab');
        break;
      default:
        break;
    }
  };

  // Set up an interval to simulate receiving notifications (for demo purposes)
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Only show a new notification if one isn't already showing
      if (!isVisible) {
        // 10% chance of getting a notification every 30 seconds
        if (Math.random() < 0.1) {
          mockReceiveNotification();
        }
      }
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [isVisible]);

  if (!isVisible || !notification) {
    return null;
  }

  return (
    <Animated.View 
      style={[
        styles.container, 
        { transform: [{ translateY }] }
      ]}
    >
      <TouchableOpacity style={styles.content} onPress={handleNotificationPress}>
        <View style={styles.iconContainer}>
          {notification.type === 'woohoo' && (
            <Ionicons name="people" size={24} color={colors.primaryDark} />
          )}
          {notification.type === 'friend_request' && (
            <Ionicons name="person-add" size={24} color={colors.primaryDark} />
          )}
          {notification.type === 'friend_woohoo' && (
            <Ionicons name="heart" size={24} color={colors.primaryDark} />
          )}
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{notification.title}</Text>
          <Text style={styles.message}>{notification.message}</Text>
        </View>
        
        <TouchableOpacity style={styles.closeButton} onPress={hideNotification}>
          <Ionicons name="close" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: 50, // Account for status bar
    paddingHorizontal: 16,
  },
  content: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 65, 165, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 2,
  },
  message: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NotificationSystem;