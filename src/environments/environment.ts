import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: false,
  baseApiUrl: 'https://localhost:7280/api'
};
