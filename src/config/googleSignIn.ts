import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Your Web Client ID from Google Console
export const WEB_CLIENT_ID = '902979315326-jal6dnedilqiqoeuidtbrgfutpnr98jq.apps.googleusercontent.com';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
    offlineAccess: true,
  });
};
