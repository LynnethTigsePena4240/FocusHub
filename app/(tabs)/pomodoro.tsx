import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';

export default function PomodoroScreen() {
  const colorScheme = useColorScheme();
  
      const isDarkMode = colorScheme === 'dark';
      const colors = {
          background: isDarkMode ? '#121212' : '#F0F0F0',
          text: isDarkMode ? '#FFFFFF' : '#333333',
          card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
          primary: '#007AFF',
          error: '#CF6679',
      };

  return (
    <View style={[styles.container,{ backgroundColor: colors.background }]}>
      <Text style={[styles.title,{ color: colors.text }]}>Pomodoro Tab</Text>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 70,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  
});