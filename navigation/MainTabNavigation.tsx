import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';

import ExploreScreen from '../screens/Explore';
import AccountScreen from '../screens/Account';
import MiniPlayer from '../components/MiniPlayer';

const MainTab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const { colors } = useTheme();


  return (
    <MainTab.Navigator
      tabBarOptions={{
        activeTintColor: colors.primary,
        activeBackgroundColor: 'lightgray',
        showLabel: false
      }}
      tabBar={() => (
        <>
          <MiniPlayer /></>
      )}>
      <MainTab.Screen name="Explore" component={ExploreScreen} />
      <MainTab.Screen name="Account" component={AccountScreen} />
    </MainTab.Navigator>
  )
}

const styles = StyleSheet.create({

});

export default MainTabNavigator;