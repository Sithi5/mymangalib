import 'react-native-gesture-handler'; //⚠️ Keep at top of the file ⚠️

import React from 'react';
// import { Provider } from 'react-redux';

import { NavigationContainer } from '@react-navigation/native';

// import { store } from './redux/Store';

import RootDrawerNavigator from './navigations/Navigations';

export default function App() {
    return (
        // <Provider store={store}>
        <NavigationContainer>
            <RootDrawerNavigator />
        </NavigationContainer>
        // </Provider>
    );
}
