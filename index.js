/**
 * @format
 */

import { AppRegistry, Platform } from 'react-native';
import App from './App';
// import {name as appName} from './app.json';
import { i18n } from './src/utils/i18n';
import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/es';

moment.locale(i18n.language);

const dynamicAppName = Platform.select({
  ios: () => 'massoneApp',
  android: () => 'massoneFieldworker',
})();

AppRegistry.registerComponent(dynamicAppName, () => App);
