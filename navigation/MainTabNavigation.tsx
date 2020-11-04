import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';

import ExploreScreen from '../screens/Explore';
import AccountScreen from '../screens/Account';
import MiniPlayer from '../components/MiniPlayer';

const ExploreScreenStack = createStackNavigator();
const AccountScreenStack = createStackNavigator();

const ExploreScreenStackNavigator = () => {
  return (
    <ExploreScreenStack.Navigator headerMode='none'>
      <ExploreScreenStack.Screen name='Explore' component={ExploreScreen} />
    </ExploreScreenStack.Navigator>
  )
}

const AccountScreenStackNavigator = () => {
  return (
    <AccountScreenStack.Navigator headerMode='none'>
      <AccountScreenStack.Screen name='Account' component={AccountScreen} />
    </AccountScreenStack.Navigator>
  )
}

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
      tabBar={tabsProps => (
        <>
          <MiniPlayer />
          <BottomTabBar {...tabsProps} />
        </>
      )}>
      <MainTab.Screen name="Explore" component={ExploreScreenStackNavigator} options={{
        tabBarLabel: 'Explore',
        tabBarIcon: ({color}) => (
          <MaterialCommunityIcons name="music-box-multiple" color={color} size={30} />
        ),
      }} />
      <MainTab.Screen name="Account" component={AccountScreenStackNavigator} options={{
        tabBarLabel: 'Account',
        tabBarIcon: ({color}) => (
          <MaterialCommunityIcons name="account" color={color} size={30} />
        ),
      }} />
    </MainTab.Navigator>
  )
}

export default MainTabNavigator;