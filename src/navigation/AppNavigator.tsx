import React from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ResultsScreen from '../screens/ResultsScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type RootStackParamList = {
  Home: undefined;
  Results: {
    buildingName?: string;
    permitType?: string;
  };
  Map: {
    lotId?: string;
  };
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f9fafb',
    card: '#ffffff',
    border: '#e5e7eb',
    text: '#1f2937',
    primary: '#00C853',
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#1a1a1a',
    card: '#1a1a1a',
    border: '#2d2d2d',
    text: '#ffffff',
    primary: '#00C853',
  },
};

export default function AppNavigator() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? CustomDarkTheme : CustomLightTheme;

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
          },
          headerTintColor: theme.colors.primary,
          headerTitleStyle: {
            fontWeight: 'bold',
            color: theme.colors.text,
          },
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{ title: 'Available Lots' }}
        />
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{ title: 'Lot Map' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'My Profile' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
