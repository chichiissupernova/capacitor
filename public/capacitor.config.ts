import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.app',
  appName: 'chichi',
  webDir: 'dist',
  ios: {
    path: 'ios',
    scheme: 'App'
  },
  server: {
    url: 'https://8d2f92c9-c1f9-4104-96ab-d2cb44377e30.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config; 