// config.js is a CommonJS module (`module.exports = config`), so this declaration uses `export =`.
declare const config: {
  general: {
    appName: string;
    owner: string;
    slug: string;
    icon: string;
    scheme: string;
    iosBundleIdentifier: string;
    androidPackageName: string;
    easProjectId: string;
  };
  profilePage: {
    supportPage: string;
    contactPage: string;
  };
};

export = config;
