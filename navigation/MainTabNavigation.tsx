import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme, IconButton } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { usePlayerContext } from '../contexts/PlayerContext';

import ExploreScreen from '../screens/Explore';
import AccountScreen from '../screens/Account';
import MiniPlayer from '../components/MiniPlayer';

const MainTab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const currScreen = useSelector(state => state.currentScreen);
  const playerContext = usePlayerContext();
  const navigation = useSelector(state => state.navigation);
  const { colors } = useTheme();

  const iconLocation = playerContext.isEmpty || !playerContext.currentTrack ? 0 : 80;

  return (
    <MainTab.Navigator
      tabBarOptions={{
        activeTintColor: colors.primary,
        activeBackgroundColor: 'lightgray',
        showLabel: false
      }}
      tabBar={() => (
        <>
          {currScreen === 'Account' ?
            <IconButton style={{ ...styles.backIcon }} onPress={() => navigation.goBack()} animated icon="keyboard-backspace" size={30} /> : <IconButton style={{ ...styles.settingsIcon, bottom: iconLocation }} onPress={() => navigation.navigate('Account')} animated icon="cog-outline" size={30} />
          }
          <MiniPlayer /></>
      )}>
      <MainTab.Screen name="Explore" component={ExploreScreen} />
      <MainTab.Screen name="Account" component={AccountScreen} />
    </MainTab.Navigator>
  )
}

const styles = StyleSheet.create({
  settingsIcon: {
    position: 'absolute',
    right: 0
  },
  backIcon: {
    position: 'absolute',
    left: 0,
    top: 0
  }
});

export default MainTabNavigator;