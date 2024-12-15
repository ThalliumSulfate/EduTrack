/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import Main from './src/Main.tsx'
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Main);
