import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="to-do"
        options={{
          title: 'To-Do',
          tabBarIcon: ({ color }) => ( <Ionicons size={28} name="checkmark-circle" color={color} />),
        
          }}
      />
      <Tabs.Screen
        name="weather"
        options={{
          title: 'Weather',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="thunderstorm" color={color} />,
        }}
      />
      <Tabs.Screen
        name="pomodoro"
        options={{
          title: 'Pomodoro',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="timer" color={color} />,
        }}
      />
      <Tabs.Screen
        name="motivation"
        options={{
          title: 'Motivation',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="robot-happy" color={color} />,
        }}
      />
    </Tabs>
  );
}
