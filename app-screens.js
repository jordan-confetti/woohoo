// screens/woohoo/WoohooScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration, Alert } from 'react-native';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../../utils/colors';
import constants from '../../utils/constants';
import { createWoohoo } from '../../store/woohooSlice';

const WoohooScreen = ({ navigation }) => {
  const [isNfcEnabled, setIsNfcEnabled] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [location, setLocation] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    // Check if the device supports NFC
    // This is just a mockup, so we'll simulate NFC support
    setIsNfcEnabled(true);
    
    // Request location permissions
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      }
    })();
  }, []);

  const startScanning = () => {
    setIsScanning(true);
    
    // Provide haptic feedback when starting scan
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Simulate finding a nearby user after a delay
    setTimeout(() => {
      // First show loading screen
      navigation.navigate(constants.ROUTES.LOADING);
      
      // Then simulate a successful woohoo
      setTimeout(() => {
        finishWoohoo();
      }, 3000);
    }, 2000);
  };

  const finishWoohoo = () => {
    // Simulate creating a woohoo with a random friend
    const sampleFriend = {
      id: '123',
      name: 'Alexis',
      username: 'alexis',
      profilePic: 'https://randomuser.me/api/portraits/women/68.jpg',
    };
    
    const woohoo = {
      id: Date.now().toString(),
      user1: {
        id: user?.id || 'current-user',
        name: user?.name || 'You',
        profilePic: user?.profilePic || 'https://via.placeholder.com/40',
      },
      user2: sampleFriend,
      location: 'Pine Crest School',
      timestamp: new Date().toISOString(),
    };
    
    // Use stronger haptic feedback on successful woohoo
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Add the woohoo to the store
    dispatch(createWoohoo(woohoo));
    
    // Navigate back to the feed
    navigation.navigate('FeedTab');
  };

  if (!isNfcEnabled) {
    return (
      <View style={styles.container}>
        <Text style={styles.notSupportedText}>
          Your device doesn't support NFC, which is required for Woohoo.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.woohooButton}
        onPress={startScanning}
        activeOpacity={0.8}
      >
        <Text style={styles.woohooText}>
          tap phones with a nearby friend to woohoo!
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  woohooButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  woohooText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  notSupportedText: {
    color: colors.text,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default WoohooScreen;

// screens/woohoo/LoadingScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import colors from '../../utils/colors';

const LoadingScreen = () => {
  useEffect(() => {
    // Provide haptic feedback for loading state
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>loading... loading... loading...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    backgroundColor: colors.secondary,
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LoadingScreen;

// screens/FeedScreen.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import WoohooCard from '../components/WoohooCard';
import colors from '../utils/colors';

// Sample feed data for the demonstration
const SAMPLE_FEED = [
  {
    id: '1',
    user1: {
      id: '101',
      name: 'Marshall',
      profilePic: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    user2: {
      id: '102',
      name: 'Alexis',
      profilePic: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    location: 'pine crest school',
    timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), // 20 hours ago
  },
  {
    id: '2',
    user1: {
      id: '103',
      name: 'Catherine',
      profilePic: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    user2: {
      id: '104',
      name: 'Jonathan',
      profilePic: 'https://randomuser.me/api/portraits/men/22.jpg',
    },
    location: 'exploratorium',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: '3',
    user1: {
      id: '105',
      name: 'Matthew',
      profilePic: 'https://randomuser.me/api/portraits/men/62.jpg',
    },
    user2: {
      id: '106',
      name: 'Michael',
      profilePic: 'https://randomuser.me/api/portraits/men/91.jpg',
    },
    location: '2727 edison st',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: '4',
    user1: {
      id: '107',
      name: 'Max',
      profilePic: 'https://randomuser.me/api/portraits/men/29.jpg',
    },
    user2: {
      id: '108',
      name: 'Kylee',
      profilePic: 'https://randomuser.me/api/portraits/women/89.jpg',
    },
    location: 'starbucks',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
  },
  {
    id: '5',
    user1: {
      id: '109',
      name: 'Gabby',
      profilePic: 'https://randomuser.me/api/portraits/women/22.jpg',
    },
    user2: {
      id: '110',
      name: 'Harry',
      profilePic: 'https://randomuser.me/api/portraits/men/55.jpg',
    },
    location: '1171 mission st',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
  },
  {
    id: '6',
    user1: {
      id: '111',
      name: 'Eleanor',
      profilePic: 'https://randomuser.me/api/portraits/women/33.jpg',
    },
    user2: {
      id: '112',
      name: 'Lexi',
      profilePic: 'https://randomuser.me/api/portraits/women/66.jpg',
    },
    location: 'stanford university',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
  },
  {
    id: '7',
    user1: {
      id: '113',
      name: 'Carter',
      profilePic: 'https://randomuser.me/api/portraits/men/78.jpg',
    },
    user2: {
      id: '114',
      name: 'Lacy',
      profilePic: 'https://randomuser.me/api/portraits/women/12.jpg',
    },
    location: 'golden gate park',
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  },
];

const FeedScreen = () => {
  const [feed, setFeed] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const woohoos = useSelector(state => state.woohoo.woohoos);

  useEffect(() => {
    loadFeed();
  }, [woohoos]);

  const loadFeed = () => {
    // In a real app, you would fetch the feed from your API
    // For this mockup, we'll combine our sample data with any woohoos
    // created during this session
    const combinedFeed = [...woohoos, ...SAMPLE_FEED];
    
    // Sort by timestamp (newest first)
    const sortedFeed = combinedFeed.sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    setFeed(sortedFeed);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    
    // Simulate network request
    setTimeout(() => {
      loadFeed();
      setRefreshing(false);
    }, 1500);
  };

  const renderItem = ({ item }) => <WoohooCard item={item} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={feed}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.text}
            colors={[colors.text]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No woohoos yet! Tap phones with a friend to create one.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  listContent: {
    padding: 20,
    paddingTop: 60,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    height: 300,
  },
  emptyText: {
    color: colors.text,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default FeedScreen;
