// screens/friends/AddFriendsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import colors from '../../utils/colors';
import constants from '../../utils/constants';
import { addFriend } from '../../store/friendsSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Sample friends data for UI demonstration
const SAMPLE_FRIENDS = [
  {
    id: '1',
    name: 'Ethan Gibbs',
    username: 'ethangibbs',
    profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
    group: true,
    selected: true,
  },
  {
    id: '2',
    name: 'Ethan Gibbs',
    username: 'ethangibbs',
    profilePic: 'https://randomuser.me/api/portraits/men/2.jpg',
    group: true,
    selected: true,
  },
  {
    id: '3',
    name: 'Ethan Gibbs',
    username: 'ethangibbs',
    profilePic: 'https://randomuser.me/api/portraits/men/3.jpg',
    group: false,
    selected: true,
  },
  {
    id: '4',
    name: 'Ethan Gibbs',
    username: 'ethannnnn',
    profilePic: 'https://randomuser.me/api/portraits/men/4.jpg',
    group: false,
    selected: true,
  },
  {
    id: '5',
    name: 'Ethan Gibbs',
    username: 'bigibsdfhb',
    profilePic: 'https://randomuser.me/api/portraits/men/5.jpg',
    group: false,
    selected: true,
  },
  {
    id: '6',
    name: 'Ethan Gibbs',
    username: 'fdafsdfra',
    profilePic: 'https://randomuser.me/api/portraits/men/6.jpg',
    group: false,
    selected: true,
  },
  {
    id: '7',
    name: 'Ethan Gibbs',
    username: 'fdafsdfra',
    profilePic: 'https://randomuser.me/api/portraits/men/7.jpg',
    group: false,
    selected: true,
  },
  {
    id: '8',
    name: 'Daniela Munoz',
    username: 'danielamunoz',
    profilePic: 'https://randomuser.me/api/portraits/women/1.jpg',
    group: false,
    selected: false,
  },
  {
    id: '9',
    name: 'Carter Dessommes',
    username: 'carterd',
    profilePic: 'https://randomuser.me/api/portraits/men/8.jpg',
    group: false,
    from: 'contacts',
    selected: false,
  },
];

const AddFriendsScreen = ({ navigation, route }) => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [filteredFriends, setFilteredFriends] = useState(SAMPLE_FRIENDS);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const dispatch = useDispatch();
  const isOnboarding = route.name === constants.ROUTES.ADD_FRIENDS;

  useEffect(() => {
    // Filter friends based on search
    if (search) {
      const filtered = SAMPLE_FRIENDS.filter(
        friend => 
          friend.name.toLowerCase().includes(search.toLowerCase()) ||
          friend.username.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredFriends(filtered);
    } else {
      setFilteredFriends(SAMPLE_FRIENDS);
    }
  }, [search]);

  const toggleFriendSelection = (id) => {
    const updatedFriends = filteredFriends.map(friend => {
      if (friend.id === id) {
        return { ...friend, selected: !friend.selected };
      }
      return friend;
    });
    
    setFilteredFriends(updatedFriends);
    
    // Update selected friends list
    const selectedIds = updatedFriends
      .filter(friend => friend.selected)
      .map(friend => friend.id);
    
    setSelectedFriends(selectedIds);
  };

  const handleContinue = () => {
    setLoading(true);
    
    // Add selected friends to Redux
    selectedFriends.forEach(id => {
      const friend = filteredFriends.find(f => f.id === id);
      if (friend) {
        dispatch(addFriend(friend));
      }
    });
    
    setTimeout(() => {
      setLoading(false);
      
      if (isOnboarding) {
        // If we're in onboarding, navigate to the "Woohoo is made for friends" screen
        navigation.navigate('FriendsInfo');
      } else {
        // Otherwise, go back or to the main app
        navigation.goBack();
      }
    }, 1000);
  };

  const handleSkip = () => {
    if (isOnboarding) {
      // If we're in onboarding, navigate to the main app
      navigation.navigate('FriendsInfo');
    } else {
      // Otherwise, just go back
      navigation.goBack();
    }
  };

  const renderFriendItem = ({ item }) => (
    <TouchableOpacity
      style={styles.friendItem}
      onPress={() => toggleFriendSelection(item.id)}
    >
      <Image source={{ uri: item.profilePic }} style={styles.profilePic} />
      
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendUsername}>
          {item.group ? 'in your group' : item.from ? `From your ${item.from}` : `@${item.username}`}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.selectButton}
        onPress={() => toggleFriendSelection(item.id)}
      >
        {item.selected ? (
          <Ionicons name="checkmark-circle" size={24} color={colors.primaryDark} />
        ) : (
          <Ionicons name="add-circle-outline" size={24} color={colors.text} />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>add friends</Text>
        
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text style={styles.skipText}>skip</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={colors.textSecondary} style={styles.searchIcon} />
        <Input
          value={search}
          onChangeText={setSearch}
          placeholder="jordan"
          style={styles.searchInput}
          inputStyle={styles.inputStyle}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={filteredFriends}
        renderItem={renderFriendItem}
        keyExtractor={(item) => item.id}
        style={styles.friendsList}
        showsVerticalScrollIndicator={false}
      />
      
      <Button
        title="continue"
        onPress={handleContinue}
        loading={loading}
        style={styles.button}
        disabled={selectedFriends.length === 0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '600',
  },
  skipButton: {
    padding: 5,
  },
  skipText: {
    color: colors.primaryDark,
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
  },
  inputStyle: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
  },
  friendsList: {
    flex: 1,
    marginBottom: 20,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  friendInfo: {
    flex: 1,
    marginLeft: 15,
  },
  friendName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  friendUsername: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  selectButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginBottom: 20,
  },
});

export default AddFriendsScreen;

// screens/friends/FriendsInfoScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import Button from '../../components/common/Button';
import colors from '../../utils/colors';
import { setAuthenticated } from '../../store/authSlice';

const FriendsInfoScreen = () => {
  const dispatch = useDispatch();

  const handleAddFriends = () => {
    // Complete the onboarding and mark user as authenticated
    dispatch(setAuthenticated(true));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        woohoo is made for 
        <Text style={styles.highlight}> friends</Text>
      </Text>
      
      <Text style={styles.description}>
        add some of your friends to see what they're up to, and send invites to
        contacts who don't have an account yet so you can woohoo together!
      </Text>
      
      <Text style={styles.incentive}>
        plus, for each person you invite who's new to woohoo, we'll send you $5!
      </Text>
      
      <Button
        title="add friends"
        onPress={handleAddFriends}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  highlight: {
    color: colors.primaryDark,
  },
  description: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  incentive: {
    color: colors.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 40,
  },
  button: {
    width: '100%',
  },
});

export default FriendsInfoScreen;

// screens/friends/FriendProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useSelector } from 'react-redux';
import ProfileStats from '../../components/ProfileStats';
import colors from '../../utils/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Sample user for the demonstration
const SAMPLE_USER = {
  id: '1',
  name: 'Alexis',
  username: 'alexis',
  profilePic: 'https://randomuser.me/api/portraits/women/68.jpg',
};

// Sample profile data for the demonstration
const SAMPLE_PROFILE_DATA = {
  rank: 7,
  woohooCount: 8,
  placesCount: 10,
  locations: [
    '2727 edison st',
    'pine crest school',
    'and more...',
  ],
};

const FriendProfileScreen = ({ navigation, route }) => {
  const [friend, setFriend] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector(state => state.auth.user);

  useEffect(() => {
    // In a real app, you would fetch the friend's data from your API
    // For this mockup, we'll use the sample data
    
    setFriend(SAMPLE_USER);
    setProfileData(SAMPLE_PROFILE_DATA);
    setLoading(false);
  }, [route.params?.userId]);

  const handleClose = () => {
    navigation.goBack();
  };

  const handleAddPhoto = () => {
    // Implement photo addition functionality
    console.log('Add photo');
  };

  if (loading || !friend) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={handleClose}
      >
        <Ionicons name="close" size={24} color={colors.text} />
      </TouchableOpacity>
      
      <ScrollView style={styles.contentContainer}>
        <ProfileStats
          username={friend.name}
          rank={profileData.rank}
          woohooCount={profileData.woohooCount}
          placesCount={profileData.placesCount}
          locations={profileData.locations}
          onAddPhoto={handleAddPhoto}
          userImage={currentUser?.profilePic || 'https://via.placeholder.com/40'}
          friendImage={friend.profilePic}
          location="pine crest school"
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.text,
    fontSize: 18,
  },
  closeButton: {
    alignSelf: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  contentContainer: {
    flex: 1,
  },
});

export default FriendProfileScreen;
