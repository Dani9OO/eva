/* eslint-disable @typescript-eslint/naming-convention */

import { CapacitorConfig } from '@capacitor/cli';

const baseConfig: CapacitorConfig = {
  appId: 'me.daniromo.eva',
  appName: 'eva',
  webDir: 'www',
  bundledWebRuntime: false,
  cordova: {
    preferences: {
      LottieFullScreen: 'true',
      LottieHideAfterAnimationEnd: 'true',
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
            LottieBackgroundColorLight: 'ffffffff',
            LottieBackgroundColorDark: '000000ff',
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
