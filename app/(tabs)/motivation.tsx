import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useMotivation } from "../../stores/motivationStore";

// theme colors for dark/light mode
const getThemedColors = (isDarkMode: boolean) => ({
  background: isDarkMode ? '#121212' : '#F0F0F0',
  text: isDarkMode ? '#FFFFFF' : '#333333',
  secondText: isDarkMode ? '#ffffffac' : '#333333b9',
  card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
  primary: '#007AFF',
});

export default function MotivationScreen() {
  const { quote, isLoading, error, fetchNewQuote } = useMotivation();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const colors = getThemedColors(isDarkMode);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  // animation value for fading in new quotes
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  //moode selection
  const moods = [
    {id: 'sad', emoji:'😔', label:'low'},
    {id: 'ok', emoji:'🙂', label:'okay'},
    {id: 'happy', emoji:'😁', label:'Happy'},
    {id: 'excited', emoji:'🥳', label:'Excited'},
  ];

  const selectedMoodLabel = moods.find(m => m.id === selectedMood)?.label ?? null;

  // restart fade animation whenever a new quote loads
  useEffect(() => {
    if (!quote || isLoading) return;

    fadeAnimation.setValue(0);

    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [quote, isLoading]);

  // delay for the motivation refresh button 

const fadeBtn = useRef(new Animated.Value(1)).current;

useEffect(() => {
  if (isLoading) {
      Animated.sequence([
        Animated.timing(fadeBtn, {
          toValue: 1,
          duration: 20000,
          useNativeDriver: true })
      
      ]).start();
  } else {
    fadeBtn.setValue(1); // reset when loading ends
  }
}, [isLoading]);


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Daily Motivation
      </Text>

      <Text style={[styles.subtitle, { color: colors.secondText }]}>
        A little boost every time you need some motivation.
      </Text>

      {/* small visual icon to make the screen feel less empty */}
      <View style={styles.iconWrapper}>
        <Text style={styles.icon}>🌅</Text>
      </View>

      {/* main card displaying quote or loading/error */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.text }]}>
              Fetching inspiration...
            </Text>
          </View>
        )}

        {error && (
          <Text style={[styles.errorText, { color: 'red' }]}>{error}</Text>
        )}

        {/* fade-in animation for successful quote load */}
        {quote && !isLoading && (
          <Animated.View style={{ opacity: fadeAnimation }}>
            <Text style={[styles.quoteText, { color: colors.text }]}>
              {`"${quote.content}"`}
            </Text>
            <Text style={[styles.authorText, { color: colors.text }]}>
              {`— ${quote.author}`}
            </Text>
            
          </Animated.View>
          
        )}
        <View style={{marginTop: 50}}>
          <Text style={[{ color: colors.secondText, fontSize: 12 }]}>
        *Quote provided by DummyJSON API
      </Text>
        </View>
      </View>

      {/* fetch new quote button */}
      <Animated.View style={{ opacity: fadeBtn }}>
        <TouchableOpacity
          onPress={fetchNewQuote}
          disabled={isLoading}
          style={{
            backgroundColor: colors.primary,
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
          }}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: 'white', fontWeight: '600' }}>New Quote</Text>
          )}
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.moodSection}>
        <Text style={[styles.moodTitle, { color: colors.text }]}>
          How are you feeling today?
        </Text>

        <View style={styles.moodRow}>
          {moods.map(mood => {
            const isSelected = selectedMood === mood.id;
            return (
              <TouchableOpacity
                key={mood.id}
                style={[
                  styles.moodEmojiContainer,
                  isSelected && {
                    borderColor: colors.primary,
                    backgroundColor: isDarkMode
                      ? 'rgba(0, 122, 255, 0.15)'
                      : 'rgba(0, 122, 255, 0.1)',
                  },
                ]}
                onPress={() => setSelectedMood(mood.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedMoodLabel && (
          <Text style={[styles.moodLabel, { color: colors.text }]}>
            Mood: <Text style={{ fontWeight: '600' }}>{selectedMoodLabel}</Text>
          </Text>
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 70,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  card: {
    width: '100%',
    padding: 30,
    borderRadius: 12,
    marginBottom: 30,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 20,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 15,
  },
  authorText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'right',
    alignSelf: 'flex-end',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  spacer: {
    height: 50,
  },
    subtitle: {
    marginTop: 4,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  iconWrapper: {
    marginBottom: 16,
  },
  icon: {
    fontSize: 40,
  },
  
  moodSection: {
    marginTop: 100,
    marginBottom: 16,
    alignItems: 'center',
  },
  moodTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  moodEmojiContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  moodEmoji: {
    fontSize: 26,
  },
  moodLabel: {
    marginTop: 8,
    fontSize: 14,
  },

});
