// Everything about this app that is not code.
//
// One file rather than values scattered through app.config.js, so renaming the
// app or changing its bundle id is one edit. Two of these are permanent once
// published: iosBundleIdentifier and androidPackageName cannot be changed on a
// live app, only replaced by a new listing. Decide them before your first
// submission.
const config = {
  general: {
    appName: 'My App',
    owner: 'REPLACE_ME',
    slug: 'my-app',
    icon: './src/assets/images/icon.png',
    // Used by the links in confirmation and password-reset mail. Must be unique
    // to your app, lowercase, no spaces.
    scheme: 'myapp',
    iosBundleIdentifier: 'com.example.myapp',
    androidPackageName: 'com.example.myapp',
    // From `eas init`. Leave empty until you have run it.
    easProjectId: '',
  },
  profilePage: {
    supportPage: 'https://example.com/support',
    contactPage: 'https://example.com/contact',
  },
};

module.exports = config;
