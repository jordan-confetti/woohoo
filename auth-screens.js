// screens/auth/PhoneScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import colors from '../../utils/colors';
import constants from '../../utils/constants';
import { setPhoneNumber } from '../../store/authSlice';

const PhoneScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleContinue = async () => {
    if (!phone) {
      setError('Please enter your phone number');
      return;
    }

    if (phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // In a real app, you would call an API to send a verification code
      // For this mockup, we'll just simulate a successful API call
      
      // Store the phone number in Redux
      dispatch(setPhoneNumber(phone));
      
      // Mock network delay
      setTimeout(() => {
        setLoading(false);
        navigation.navigate(constants.ROUTES.CODE, { phone });
      }, 1000);
    } catch (error) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.helpButton}
        onPress={() => {/* Show help modal */}}
      >
        <Text style={styles.helpText}>help</Text>
      </TouchableOpacity>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>my number is</Text>
        
        <Input
          value={phone}
          onChangeText={(text) => {
            // Only allow numbers
            const numericValue = text.replace(/[^0-9]/g, '');
            setPhone(numericValue);
            setError('');
          }}
          placeholder="phone number"
          keyboardType="phone-pad"
          style={styles.input}
          error={error}
          maxLength={15}
        />
        
        <Button
          title="continue"
          onPress={handleContinue}
          loading={loading}
          style={styles.button}
        />
        
        <Text style={styles.termsText}>
          by creating an account or logging in, you agree to our{' '}
          <Text style={styles.linkText}>Terms of Service</Text> and{' '}
          <Text style={styles.linkText}>Privacy Policy</Text>.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  helpButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  helpText: {
    color: colors.primaryDark,
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  input: {
    marginBottom: 30,
  },
  button: {
    marginBottom: 20,
  },
  termsText: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
  linkText: {
    color: colors.primaryDark,
  },
});

export default PhoneScreen;

// screens/auth/CodeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import Button from '../../components/common/Button';
import CodeInput from '../../components/common/CodeInput';
import colors from '../../utils/colors';
import constants from '../../utils/constants';
import { verifyCode } from '../../store/authSlice';

const CodeScreen = ({ navigation, route }) => {
  const { phone } = route.params;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const dispatch = useDispatch();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError('Please enter the complete verification code');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // In a real app, you would call an API to verify the code
      // For this mockup, we'll accept any 6-digit code
      
      // Mock network delay
      setTimeout(() => {
        setLoading(false);
        // Navigate to the next screen in the auth flow
        navigation.navigate(constants.ROUTES.NAME);
      }, 1000);
    } catch (error) {
      setError('Invalid code. Please try again.');
      setLoading(false);
    }
  };

  const handleResend = () => {
    // Reset the countdown
    setCountdown(60);
    
    // In a real app, you would call an API to resend the code
    // ...
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>{'<'}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => {/* In a real app, this would be conditional */}}
      >
        <Text style={styles.skipText}>skip</Text>
      </TouchableOpacity>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>my code is</Text>
        
        <CodeInput
          codeLength={6}
          value={code}
          onCodeChange={(newCode) => {
            setCode(newCode);
            setError('');
          }}
        />
        
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <Text style={styles.codeInfo}>
            code was sent to {phone}
          </Text>
        )}
        
        {countdown > 0 ? (
          <Text style={styles.countdownText}>resend in {countdown}s</Text>
        ) : (
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendText}>resend</Text>
          </TouchableOpacity>
        )}
        
        <Button
          title="continue"
          onPress={handleVerify}
          loading={loading}
          style={styles.button}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backText: {
    color: colors.text,
    fontSize: 24,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    color: colors.primaryDark,
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  errorText: {
    color: colors.error,
    marginTop: 10,
  },
  codeInfo: {
    color: colors.textSecondary,
    marginTop: 10,
  },
  countdownText: {
    color: colors.textSecondary,
    marginTop: 10,
  },
  resendText: {
    color: colors.primaryDark,
    marginTop: 10,
  },
  button: {
    marginTop: 40,
  },
});

export default CodeScreen;

// screens/auth/NameScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import colors from '../../utils/colors';
import constants from '../../utils/constants';
import { setUserName } from '../../store/authSlice';

const NameScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleContinue = () => {
    if (!firstName.trim()) {
      setError('Please enter your first name');
      return;
    }

    setLoading(true);
    
    // Store the name in Redux
    dispatch(setUserName(firstName));
    
    // Navigate to the next screen
    setTimeout(() => {
      setLoading(false);
      navigation.navigate(constants.ROUTES.USERNAME);
    }, 500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>{'<'}</Text>
      </TouchableOpacity>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>my first name is</Text>
        
        <Input
          value={firstName}
          onChangeText={(text) => {
            setFirstName(text);
            setError('');
          }}
          placeholder="first name"
          autoCapitalize="words"
          style={styles.input}
          error={error}
        />
        
        <Button
          title="continue"
          onPress={handleContinue}
          loading={loading}
          style={styles.button}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backText: {
    color: colors.text,
    fontSize: 24,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  input: {
    marginBottom: 30,
  },
  button: {
    marginBottom: 20,
  },
});

export default NameScreen;

// screens/auth/UsernameScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import colors from '../../utils/colors';
import constants from '../../utils/constants';
import { setUsername } from '../../store/authSlice';

const UsernameScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleContinue = async () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    // Basic validation
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // In a real app, you would check if the username is available
      // For this mockup, we'll assume it's available
      
      // Store the username in Redux
      dispatch(setUsername(username));
      
      // Navigate to the next screen
      setTimeout(() => {
        setLoading(false);
        navigation.navigate(constants.ROUTES.PROFILE_PIC);
      }, 1000);
    } catch (error) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>{'<'}</Text>
      </TouchableOpacity>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>my username is</Text>
        
        <View style={styles.usernameContainer}>
          <Text style={styles.atSymbol}>@</Text>
          <Input
            value={username}
            onChangeText={(text) => {
              // Remove spaces and special characters
              const cleanedText = text.replace(/[^a-zA-Z0-9_]/g, '');
              setUsername(cleanedText);
              setError('');
            }}
            placeholder="username"
            autoCapitalize="none"
            style={styles.usernameInput}
            inputStyle={styles.input}
            error={error}
          />
        </View>
        
        <Button
          title="continue"
          onPress={handleContinue}
          loading={loading}
          style={styles.button}
        />
        
        <Text style={styles.warningText}>
          you will not be able to change this later
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backText: {
    color: colors.text,
    fontSize: 24,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  atSymbol: {
    color: colors.text,
    fontSize: 18,
    marginRight: 5,
  },
  usernameInput: {
    flex: 1,
  },
  input: {
    paddingLeft: 5,
  },
  button: {
    marginBottom: 20,
  },
  warningText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 10,
  },
});

export default UsernameScreen;

// screens/auth/ProfilePicScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import Button from '../../components/common/Button';
import colors from '../../utils/colors';
import constants from '../../utils/constants';
import { setProfilePic } from '../../store/authSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProfilePicScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const pickImage = async () => {
    // Request permission to access the photo library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const handleContinue = () => {
    if (image) {
      setLoading(true);
      
      // Store the profile pic in Redux
      dispatch(setProfilePic(image));
      
      // Navigate to the next screen
      setTimeout(() => {
        setLoading(false);
        navigation.navigate(constants.ROUTES.ADD_FRIENDS);
      }, 1000);
    } else {
      // If no image selected, use the default profile pic (placeholder)
      dispatch(setProfilePic('https://via.placeholder.com/150'));
      navigation.navigate(constants.ROUTES.ADD_FRIENDS);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>{'<'}</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>my profile pic</Text>
      
      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>A</Text>
            <View style={styles.addIconContainer}>
              <Ionicons name="add-circle" size={28} color={colors.text} />
            </View>
          </View>
        )}
      </TouchableOpacity>
      
      <Button
        title="continue"
        onPress={handleContinue}
        loading={loading}
        style={styles.button}
      />
      
      <Text style={styles.changeText}>
        don't worry, you can change this later.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backText: {
    color: colors.text,
    fontSize: 24,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 30,
    alignSelf: 'center',
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 30,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.text,
    borderRadius: 60,
  },
  placeholderText: {
    color: colors.text,
    fontSize: 40,
    fontWeight: '500',
  },
  addIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.background,
    borderRadius: 14,
  },
  button: {
    width: '100%',
    marginBottom: 20,
  },
  changeText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});

export default ProfilePicScreen;
