/* eslint-disable @typescript-eslint/naming-convention */

import { CapacitorConfig } from '@capacitor/cli';

const baseConfig: CapacitorConfig = {
  appId: 'me.daniromo.eva',
  appName: 'eva',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      "launchShowDuration": 0,
      "launchAutoHide": true,
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '733249240859-k9viv6v3lagtbqn68uk0a4mnk52ng5h5.apps.googleusercontent.com',
      androidClientId: '733249240859-k9viv6v3lagtbqn68uk0a4mnk52ng5h5.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
  cordova: {
    preferences: {
      LottieFullScreen: 'true',
      LottieHideAfterAnimationEnd: 'true',
      LottieBackgroundColorLight: 'ffffffff',
      LottieBackgroundColorDark: '000000ff'
    }
  }
};

const getConfig = (): CapacitorConfig => {
  switch (process.env.NODE_ENV) {
    case 'ios':
      const ios: CapacitorConfig = {
        ...baseConfig,
        cordova: {
          preferences: {
            ...baseConfig.cordova.preferences,
            LottieFadeOutDuration: '0.5'
          }
        }
      };
      return ios;
    case 'android':
      const android: CapacitorConfig = {
        ...baseConfig,
        cordova: {
          preferences: {
            ...baseConfig.cordova.preferences,
            LottieFadeOutDuration: '500',
            LottieAnimationLocation: 'public/assets/eva.json'
          }
        }
      };
      return android;
    default:
      return { ...baseConfig };
  }
};

export default getConfig();
