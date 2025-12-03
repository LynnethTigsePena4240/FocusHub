import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Button, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useMotivation } from "../../stores/motivationStore";

// theme colors for dark/light mode
const getThemedColors = (isDarkMode: boolean) => ({
  background: isDarkMode ? '#121212' : '#F0F0F0',
  text: isDarkMode ? '#FFFFFF' : '#333333',
  card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
  primary: '#007AFF',
});

export default function MotivationScreen() {
  const { quote, isLoading, error, fetchNewQuote } = useMotivation();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const colors = getThemedColors(isDarkMode);

  // animation value for fading in new quotes
  const fadeAnimation = useRef(new Animated.Value(0)).current;

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Daily Motivation
      </Text>

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
      </View>

      {/* fetch new quote button */}
      <Button
        title={isLoading ? "Loading..." : "New Quote"}
        onPress={fetchNewQuote}
        disabled={isLoading}
        color={colors.primary}
      />

      <View style={styles.spacer} />
      <Text style={{ color: colors.text, fontSize: 12 }}>
        *Quote provided by DummyJSON API
      </Text>
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
  }
});
