import { Link } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, useColorScheme ,TouchableOpacity} from 'react-native';
import { useMotivation } from "../../stores/motivationStore";
import { useTasks } from "../../stores/taskStore";
import { useWeather } from "../../stores/weatherStore"; 
import { usePomodoro }from '../../stores/pomodoroStore';

// Basic color theme helper
const getThemedColors = (isDarkMode: boolean) => ({
  background: isDarkMode ? '#121212' : '#F0F0F0',
  text: isDarkMode ? '#FFFFFF' : '#333333',
  card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
  primary: '#007AFF',
  secondaryText: isDarkMode ? '#AAAAAA' : '#666666',
});

export default function OverviewScreen() {
  // Get top uncompleted tasks
  const { getTopTasks } = useTasks();
  const tasksToDisplay = getTopTasks();

  // Get motivation quote
  const { quote, isLoading: isQuoteLoading } = useMotivation();

  //Get weather info 
  const {temp,city,isLoading } = useWeather(); 

  // Get Pondoro info 
  const { mode, secLeft, isRunning, startPause, reset} = usePomodoro();
  const min = String(Math.floor(secLeft / 60)).padStart(2, '0');
  const sec = String(secLeft % 60).padStart(2, '0');

 
 


  // Handle theme colors
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const colors = getThemedColors(isDarkMode);

  return (
    // <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <Text style={[styles.title, { color: colors.text }]}>
        FocusHub
      </Text>

      {/* Top tasks card */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Top 3 Tasks
        </Text>

        {tasksToDisplay.length > 0 ? (
          tasksToDisplay.map((task) => (
            <Text
              key={task.id}
              style={[styles.cardContent, { color: colors.secondaryText }]}
            >
              {`• ${task.title}`}
            </Text>
          ))
        ) : (
          <Text style={[styles.cardContent, { color: colors.secondaryText }]}>
            No pending tasks! Good job!
          </Text>
        )}

        {/* Link to tasks page */}
        <Link href="/to-do" style={[styles.link, { color: colors.primary }]}>
          Go to Full To-Do List
        </Link>
      </View>

      {/* Motivation card */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Daily Motivation
        </Text>

        {isQuoteLoading ? (
          <Text
            style={[
              styles.cardContent,
              { color: colors.secondaryText, fontStyle: 'italic' },
            ]}
          >
            Loading motivation...
          </Text>
        ) : (
          <>
            <Text
              style={[
                styles.cardContent,
                { color: colors.secondaryText, fontStyle: 'italic' },
              ]}
            >
              {`"${quote?.content.substring(0, 50)}${quote && quote.content.length > 50 ? '...' : ''
                }"`}
            </Text>

            <Text
              style={[
                styles.cardContent,
                {
                  color: colors.secondaryText,
                  textAlign: 'right',
                  marginTop: 5,
                },
              ]}
            >
              {`– ${quote?.author}`}
            </Text>
          </>
        )}

        {/* Link to motivation page */}
        <Link href="/motivation" style={[styles.link, { color: colors.primary }]}>
          Get Motivated
        </Link>
      </View>
      
      {/* Weather card */}

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Weather Preview
        </Text>
        <Text style={[styles.cardContent, { color: colors.secondaryText }]}>
      
         {isLoading ? "Loading..." : `${city}`}

        </Text>
        <Text style={[styles.cardContent, { color: colors.secondaryText }]}>

          {isLoading ? "Loading Temp..": `${temp}`}

        </Text>

        {/* Link to weather page */}

        <Link href="/weather" style={[styles.link, { color: colors.primary }]}>
          View Full Weather Details
        </Link>
      </View>
           
      {/* Pomodoro card */}

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Pomodoro Timer
        </Text>
        <Text style={[styles.cardContent, { color: colors.secondaryText }]}>
        {min}: {sec}    {mode}
        </Text>
          <View style={{ flexDirection: 'row', marginTop: 5, gap: 10 }}>

            <TouchableOpacity onPress={startPause}>
              <Text style={{ color: colors.primary }}>
                {isRunning ? 'Pause' : 'Start'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={reset}>
              <Text style={{ color: colors.primary }}>Reset</Text>
            </TouchableOpacity>

          </View>
      
       
      
        {/* Link to pomodoro page */}

        <Link href="/pomodoro" style={[styles.link, { color: colors.primary }]}>
          Set Timer
        </Link>
      </View>

      </ScrollView>

// </SafeAreaView>    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 70,
    paddingHorizontal: 20,
  },
  scrollContent: {
  paddingTop: 70,
  paddingHorizontal: 20,
  paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.2)',
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    paddingBottom: 5,
  },
  cardContent: {
    fontSize: 16,
    marginBottom: 4,
  },
  link: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'right',
  },
});
