/* eslint-disable @typescript-eslint/naming-convention */

import { CapacitorConfig } from '@capacitor/cli';

const baseConfig: CapacitorConfig = {
  appId: 'mx.edu.utj.eva',
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
      serverClientId: '1068748863477-037e76bjhv012k03ph9shrpp23eo1pdb.apps.googleusercontent.com',
      androidClientId: '1068748863477-037e76bjhv012k03ph9shrpp23eo1pdb.apps.googleusercontent.com',
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
