EduTrack:

EduTrack is a mobile application built with React Native intended to help users manage educational
tasks, schedules, and personal data using Firebase for backend services. This project is configured
without the node_modules folder, making the initial setup simpler and keeping repository size
manageable. This README will guide you through running the app, installing required dependencies,
and testing it with a provided test account.

Features:

    - User Authentication: Users can register and log in via Firebase Authentication.
    - Event Management: Users can create, edit, and view their scheduled events.
    - Profile Management: Users can update their personal details.

Prerequisites:

    - React Native Environment Setup:

        Ensure you have set up your React Native development environment as described in the
        official React Native Environment Setup instructions.

    - Android/iOS Emulator or Device:

        You’ll need either an Android emulator (via Android Studio) or an iOS Simulator (via Xcode)
        configured. Alternatively, you can run the app on a physical device with USB debugging
        enabled.

    - Dependencies:

        This project uses several key packages and libraries:

            @react-native-firebase/auth for user authentication.
            @react-native-firebase/firestore for storing and querying event/user data.
            @react-navigation/native for navigation between screens.
            @types/react-native-vector-icons for type definitions when using vector icons.
            react-native-screens and react-native-safe-area-context for optimized navigation UI and
            safe area handling.
            react-native-vector-icons for scalable icons used throughout the UI.

        If these are not already installed, they will be resolved when you run npm install.
        However if any additional installation steps are required for native modules, follow the
        documentation provided by each library.

Installation & Setup:

    - Download or Clone the Repository:

        If you are downloading a ZIP, extract it to your desired location (but make sure the path
        name doesn't get too long to avoid unnecessary issues)

        If you’re cloning from the git repository, run:

            git clone https://github.com/ThalliumSulfate/EduTrack

    -Install Dependencies:

        From the project’s root directory run:

            npm install

        This will fetch and install all required packages, including the React Native libraries and
        Firebase dependencies.

    - Run the app:

        Start the Metro Bundler:

            npx react-native start

        * Keep this terminal window open and running.

        Run the App: For Android (with an emulator running or a connected device):

            npx react-native run-android

        For iOS (with an iOS simulator open or a connected iOS device):

            npx react-native run-ios

    The app should launch on your selected platform!
    If there is any issue, run:

        npx react-native doctor

Usage:

    - Register/Login using Firebase Authentication:

        You should register first if you do not have an account but if you do go ahead and login!
        On successful authentication, user data and event details can be created, viewed, edited,
        or removed.

    - Navigation:

        Use the in-app navigation bar and menu items (on the left) to move between the Home,
        Profile, and Settings screens.

    -Event Management:

        The Home screen allows creating and editing events. Proper input validation ensures that
        your data remains consistent and correctly formatted.

        You can create an event and to edit it you may simply click it and get the option to
        edit/delete it.

    - Settings:

        You may also Log out of your account or Delete it altogether after navigating to the
        settings.


Troubleshooting:

    - Metro Server Issues:

        If you encounter errors starting the Metro server, try restarting with:

            npx react-native start --reset-cache.

    - Android Build Failures:

        Make sure the Android SDK, platform-tools, and emulator are properly installed and updated.
        Check ANDROID_HOME environment variable.

        Try rerunning after cleaning the gradle cache using this command after navigating to
        the android directory:

            ./gradlew clean

        If problems persist run react-native doctor.

    - iOS Build Failures:

        Ensure Xcode and Command Line Tools are up to date. Sometimes running cd ios && pod
        install helps if you add or remove native dependencies.


With these steps and information, you should be ready to set up, run the EduTrack mobile application