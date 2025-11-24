import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function WeatherScreen() {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pomodoro Tab</Text>
      
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
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center'
  },
  
});