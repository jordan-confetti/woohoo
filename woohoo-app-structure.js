// Project structure for Woohoo app

src/
  ├── api/
  │   ├── auth.js       // Authentication API functions
  │   ├── friends.js    // Friends management API
  │   └── woohoo.js     // Woohoo interaction API
  │
  ├── assets/
  │   ├── fonts/        // Custom fonts
  │   └── images/       // App images
  │
  ├── components/
  │   ├── common/       // Reusable components
  │   │   ├── Button.js
  │   │   ├── Input.js
  │   │   └── ...
  │   │
  │   ├── FriendsList.js   // Friends list component
  │   ├── WoohooCard.js    // Card displaying a woohoo event
  │   ├── ProfileStats.js  // Profile statistics component
  │   └── ...
  │
  ├── navigation/
  │   ├── AppNavigator.js      // Main navigation setup
  │   ├── AuthNavigator.js     // Authentication flow
  │   └── MainNavigator.js     // Main app navigation
  │
  ├── screens/
  │   ├── auth/                // Auth screens
  │   │   ├── PhoneScreen.js
  │   │   ├── CodeScreen.js
  │   │   ├── NameScreen.js
  │   │   ├── UsernameScreen.js
  │   │   └── ProfilePicScreen.js
  │   │
  │   ├── friends/             // Friend management screens
  │   │   ├── AddFriendsScreen.js
  │   │   └── FriendProfileScreen.js
  │   │
  │   ├── woohoo/              // Woohoo interaction screens
  │   │   ├── WoohooScreen.js  // "Tap phones" screen
  │   │   └── LoadingScreen.js // Processing screen
  │   │
  │   ├── FeedScreen.js        // Main feed
  │   └── ...
  │
  ├── store/                   // State management
  │   ├── authSlice.js
  │   ├── friendsSlice.js
  │   ├── woohooSlice.js
  │   └── store.js
  │
  ├── utils/
  │   ├── colors.js            // App color scheme
  │   ├── constants.js         // App constants
  │   ├── nfc.js               // NFC functionality for phone tapping
  │   └── location.js          // Location utilities
  │
  └── App.js                   // Main app entry
