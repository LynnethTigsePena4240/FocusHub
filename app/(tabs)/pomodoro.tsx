import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

export default function PomodoroScreen() {
  const colorScheme = useColorScheme();

  const FOCUS_TIME = 25*60; //25 min for focus time
  const BREAK_TIME = 5*60// 5 min for break
  const [mode, setMode] = useState('focus')
  const [secLeft, setSecLeft] = useState(FOCUS_TIME)
  const [isRunning, setIsRunning] = useState(false)
  
  const isDarkMode = colorScheme === 'dark';
  const colors = {
    background: isDarkMode ? '#121212' : '#F0F0F0',
    text: isDarkMode ? '#FFFFFF' : '#333333',
    card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    primary: '#007AFF',
    error: '#CF6679',
    };

    useEffect(()=> {
      if(!isRunning) return;

      const interval = setInterval(() => {
        setSecLeft((prev) => {
          if(prev <= 1)
          {
            const nextMode = mode === "focus" ? "break" : "focus"
            const nextTime = nextMode === "focus" ? FOCUS_TIME : BREAK_TIME

            setMode(nextMode)
            setIsRunning(false)
            return nextTime
          }
          return prev -1
        })
      }, 1000)
      return () => clearInterval(interval)
    }, [isRunning, mode])

    const min = String(Math.floor(secLeft /60)).padStart(2,"0")
    const sec = String(secLeft % 60).padStart(2,"0")

    //start and pause btn function
    const handleStartPause = () => {
      setIsRunning((prev)=> !prev)
    }

    //reset timer function
    const handleReset = () => {
      setIsRunning(false)
      setSecLeft(mode === 'focus' ? FOCUS_TIME:BREAK_TIME)
    }

    //switch from modes
    const switchMode = (newMode: React.SetStateAction<string>) => {
      setMode(newMode)
      setIsRunning(false)
      setSecLeft(newMode === "focus" ? FOCUS_TIME:BREAK_TIME)
    }


  return (
    <View style={[styles.container,{ backgroundColor: colors.background }]}>
      <Text style={[styles.title,{ color: colors.text }]}>Pomodoro Tab</Text>

      <View style={styles.content}>
      <View style={styles.modeRow}>
        <TouchableOpacity style={[styles.modeBtn, mode === "focus" && styles.modeBtnActive,]}
        onPress={() => switchMode("focus")}
        >
          <Text style={[styles.modeText,{color:colors.text}, mode === "focus" && styles.modeTextActive,]}> Focus</Text>

        </TouchableOpacity>

        <TouchableOpacity style={[styles.modeBtn, mode === "break" && styles.modeBtnActive,]}
        onPress={() => switchMode("break")}
        >
          <Text style={[styles.modeText,{color:colors.text}, mode === "break" && styles.modeTextActive,]}> Break </Text>

        </TouchableOpacity>
      </View>

      <View style={[styles.timeBox,{borderColor: colors.text}]}>
        <Text style={[styles.timerText,{color: colors.text}]}>{min}:{sec}</Text>

      </View>

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.btn} onPress={handleStartPause}>
          <Text style={[styles.btnText, {color:colors.text}]}>
            {isRunning ? "Pause" : "Start"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn]} onPress={handleReset}>
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
  },
  btn:{
    padding: 5,
    backgroundColor: '#007AFF'
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