declare let PROFILE_CONFIG: any;
export const environment = {
    version: PROFILE_CONFIG['version'],
    buildDate: PROFILE_CONFIG['buildDate'],
    production: PROFILE_CONFIG['production'],
    apiUrl: PROFILE_CONFIG['apiUrl']
};
