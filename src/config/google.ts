type GoogleClientConfig = {
  expoClientId?: string;
  iosClientId?: string;
  androidClientId?: string;
  webClientId?: string;
};

const ids: GoogleClientConfig = {
  expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
};

export const googleClientConfig: GoogleClientConfig = ids;
export const hasGoogleSignInConfig = Boolean(
  ids.expoClientId || ids.iosClientId || ids.androidClientId || ids.webClientId,
);
