// iosBundleIdentifier and androidPackageName are permanent once published:
// a live app cannot change them, only be replaced by a new listing.
const config = {
  appName: 'My App',
  owner: 'REPLACE_ME',
  slug: 'my-app',
  icon: './src/assets/images/icon.png',
  // The deep-link scheme in confirmation and password-reset mail: unique to your app, lowercase, no spaces.
  scheme: 'myapp',
  iosBundleIdentifier: 'com.example.myapp',
  androidPackageName: 'com.example.myapp',
  // From `eas init`. Leave empty until you have run it.
  easProjectId: '',
};

module.exports = config;
