// components/common/Button.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import colors from '../../utils/colors';

const Button = ({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  disabled = false, 
  loading = false,
  backgroundColor = colors.primaryDark
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor },
        disabled && styles.disabledButton,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default Button;

// components/common/Input.js
import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import colors from '../../utils/colors';

const Input = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  autoCapitalize = 'none',
  keyboardType = 'default',
  style,
  inputStyle,
  label,
  error,
  disabled = false,
  maxLength,
  multiline = false,
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          disabled && styles.disabledInput,
          inputStyle,
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        editable={!disabled}
        maxLength={maxLength}
        multiline={multiline}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    width: '100%',
  },
  label: {
    color: colors.text,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    color: colors.text,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    width: '100%',
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 1,
  },
  disabledInput: {
    opacity: 0.7,
  },
  errorText: {
    color: colors.error,
    marginTop: 4,
    fontSize: 12,
  },
});

export default Input;

// components/common/CodeInput.js
import React, { useRef, useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Keyboard } from 'react-native';
import colors from '../../utils/colors';

const CodeInput = ({ codeLength = 6, value = '', onCodeChange }) => {
  const inputRefs = useRef([]);
  const [code, setCode] = useState(value.split(''));

  useEffect(() => {
    // Initialize array with empty values if needed
    if (code.length < codeLength) {
      setCode([...code, ...Array(codeLength - code.length).fill('')]);
    }
  }, []);

  const handleChangeText = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    
    // Notify parent component
    onCodeChange(newCode.join(''));

    // Auto advance to next input
    if (text !== '' && index < codeLength - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Go back to previous input on backspace if current is empty
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      {Array(codeLength)
        .fill(0)
        .map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.codeInput}
            maxLength={1}
            keyboardType="number-pad"
            value={code[index] || ''}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            autoFocus={index === 0}
            selectionColor={colors.primaryDark}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
  codeInput: {
    width: 40,
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: colors.textSecondary,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
});

export default CodeInput;

// components/WoohooCard.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../utils/colors';
import constants from '../utils/constants';

const WoohooCard = ({ item }) => {
  const navigation = useNavigation();
  
  const handleProfilePress = (userId) => {
    navigation.navigate(constants.ROUTES.FRIEND_PROFILE, { userId });
  };

  const getTimeAgo = (timestamp) => {
    // Basic time formatting
    const now = new Date();
    const postedTime = new Date(timestamp);
    const diffInMilliseconds = now - postedTime;
    
    const minutes = Math.floor(diffInMilliseconds / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    
    if (weeks > 0) return `${weeks}w ago`;
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => handleProfilePress(item.user1.id)} 
          style={styles.profilePic}
        >
          <Image source={{ uri: item.user1.profilePic }} style={styles.profileImage} />
        </TouchableOpacity>
        
        <View style={styles.nameContainer}>
          <Text style={styles.names}>{item.user1.name} & {item.user2.name}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={14} color={colors.text} />
            <Text style={styles.location}>{item.location}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          onPress={() => handleProfilePress(item.user2.id)} 
          style={styles.profilePic}
        >
          <Image source={{ uri: item.user2.profilePic }} style={styles.profileImage} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.timestamp}>{getTimeAgo(item.timestamp)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    borderRadius: 30,
    padding: 15,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  nameContainer: {
    flex: 1,
    alignItems: 'center',
  },
  names: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    color: colors.text,
    fontSize: 14,
    marginLeft: 4,
  },
  timestamp: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'right',
    marginTop: 5,
  },
});

export default WoohooCard;

// components/ProfileStats.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../utils/colors';

const ProfileStats = ({ 
  username, 
  rank, 
  woohooCount, 
  placesCount, 
  locations, 
  onAddPhoto, 
  userImage,
  friendImage,
  location,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userImages}>
          <Image source={{ uri: userImage }} style={styles.userImage} />
          <Text style={styles.usernames}>you & {username}</Text>
          <Image source={{ uri: friendImage }} style={styles.userImage} />
        </View>
        
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={16} color={colors.text} />
          <Text style={styles.location}>{location}</Text>
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <Text style={styles.rank}>you're</Text>
        <Text style={styles.rankNumber}>#{rank}</Text>
        <Text style={styles.rankText}>on {username}'s bff list!</Text>
        
        <View style={styles.stat}>
          <Ionicons name="people" size={18} color="#FFD700" />
          <Text style={styles.statText}>{woohooCount} woohoos together</Text>
        </View>
        
        <View style={styles.stat}>
          <Ionicons name="pin" size={18} color="#FF6347" />
          <Text style={styles.statText}>{placesCount} different places</Text>
        </View>
        
        {locations.map((loc, index) => (
          <Text key={index} style={styles.placeText}>{loc}</Text>
        ))}
        
        <Text style={styles.moreText}>and more...</Text>
      </View>
      
      {onAddPhoto && (
        <TouchableOpacity style={styles.addPhotoButton} onPress={onAddPhoto}>
          <Ionicons name="camera" size={18} color={colors.text} />
          <Text style={styles.addPhotoText}>add a photo!</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    borderRadius: 30,
    padding: 20,
    marginVertical: 10,
  },
  header: {
    marginBottom: 15,
  },
  userImages: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  usernames: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    color: colors.text,
    marginLeft: 4,
    fontSize: 14,
  },
  statsContainer: {
    alignItems: 'flex-start',
  },
  rank: {
    color: colors.text,
    fontSize: 18,
  },
  rankNumber: {
    color: colors.text,
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  rankText: {
    color: colors.text,
    fontSize: 18,
    marginBottom: 15,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statText: {
    color: colors.text,
    marginLeft: 8,
    fontSize: 15,
  },
  placeText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  moreText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  addPhotoButton: {
    flexDirection: 'row',
    backgroundColor: colors.text,
    borderRadius: 30,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  addPhotoText: {
    color: colors.secondary,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ProfileStats;
