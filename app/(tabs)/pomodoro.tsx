import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { usePomodoro } from '../../stores/pomodoroStore';

export default function PomodoroScreen() {
  const colorScheme = useColorScheme();
  
  const { mode, setMode, secLeft, startPause, reset, isRunning } = usePomodoro();
  
  const isDarkMode = colorScheme === 'dark';
  const colors = {
    background: isDarkMode ? '#121212' : '#F0F0F0',
    text: isDarkMode ? '#FFFFFF' : '#333333',
    card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    primary: '#007AFF',
    error: '#CF6679',
    };


    const min = String(Math.floor(secLeft /60)).padStart(2,"0")
    const sec = String(secLeft % 60).padStart(2,"0")



  return (
    <View style={[styles.container,{ backgroundColor: colors.background }]}>
      <Text style={[styles.title,{ color: colors.text }]}>Pomodoro Tab</Text>

      <View style={styles.content}>
      <View style={styles.modeRow}>
        <TouchableOpacity style={[styles.modeBtn, mode === "focus" && styles.modeBtnActive,]}
        onPress={() => setMode("focus")}
        >
          <Text style={[styles.modeText,{color:colors.text}, mode === "focus" && styles.modeTextActive,]}> Focus</Text>

        </TouchableOpacity>

        <TouchableOpacity style={[styles.modeBtn, mode === "break" && styles.modeBtnActive,]}
        onPress={() => setMode("break")}
        >
          <Text style={[styles.modeText,{color:colors.text}, mode === "break" && styles.modeTextActive,]}> Break </Text>

        </TouchableOpacity>
      </View>

      <View style={[styles.timeBox,{borderColor: colors.text}]}>
        <Text style={[styles.timerText,{color: colors.text}]}>{min}:{sec}</Text>

      </View>

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.btn} onPress={startPause}>
          <Text style={[styles.btnText, {color:colors.text}]}>
            {isRunning ? "Pause" : "Start"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn]} onPress={reset}>
          <Text style={[styles.btnText, {color:colors.text}]}>
            Reset
          </Text>
        </TouchableOpacity>
      </View>

      </View>
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
  content:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 20,
  },
  modeRow:{
    flexDirection: "row",
    gap:15,
  },

  modeBtn:{
    borderWidth: 1,
    padding:6,
    marginBottom: 20,
    borderRadius: 20,
    borderColor: '#ccc'
  },

  modeBtnActive:{
    backgroundColor: '#007AFF',
    borderColor: '#007AFF'
  },

  modeText:{
    fontSize:16,
    color: '#333'
  },
  modeTextActive:{
    color: '#FFF',
    fontWeight: 'bold'
  },
  timeBox:{
    borderWidth: 4,
    width: 200,
    height: 200,
    borderRadius: '50%',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },

  timerText:{
    fontSize: 60,
    fontWeight: 'bold'
  },
  btnRow:{
    flexDirection: "row",
    gap: 20,
    marginTop: 10
  },
  btn:{
    borderRadius: 5
  },
  btnText:{
    fontSize: 20,
    borderWidth: 1,
    padding:15,
    fontWeight: 'bold',
    marginBottom: 10,
    borderRadius: 30,
    borderColor: '#007AFF'
  }
});