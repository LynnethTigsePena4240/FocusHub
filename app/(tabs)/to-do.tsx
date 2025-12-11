import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Button, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from "react-native";
import { useTasks } from "../../stores/taskStore";
import ProgressBar from "../components/progressBar";

// theme values for light/dark
const getThemedColors = (isDarkMode: boolean) => ({
  background: isDarkMode ? '#121212' : '#F0F0F0',
  text: isDarkMode ? '#FFFFFF' : '#333333',
  card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
  primary: '#2f00ffff',
});

// small spacing divider
function Separator() {
  return <View style={styles.separator}></View>
}

// handles fade animation for each task row
function TaskFade({ item, onToggle, onDelete }) {
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(false);

  // fade in when the row appears
  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // fade out before removing the task
  const deleteTask = () => {
    Animated.timing(fadeAnimation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      onDelete(item.id);
    });
  };

  const confirmDelete = () => {
    setIsVisible(false);
    deleteTask();
  };

  return (
    <>
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={() => setIsVisible(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirm Deletion</Text>
          <Text style={styles.modalMessage}>Are you sure you want to delete the task: "{item.title}"?</Text>
              <View style={{ flexDirection : 'row', justifyContent: 'space-between', marginTop: 20 }}>
                <Button title="Cancel" onPress={() => setIsVisible(false)} />
                <Button title="Delete" color="red" onPress={confirmDelete} />
              </View>
        </View>
      </View>
    </Modal>

    <Animated.View style={[styles.taskContainer, { opacity: fadeAnimation }]}>
      <TouchableOpacity onPress={() => onToggle(item.id)}>
        <Text style={[styles.taskText, item.completed && styles.taskTextCompleted]}>
          {item.title}
        </Text>
      </TouchableOpacity>

      <View style={styles.button}>
        <Button title="Delete" onPress={() => setIsVisible(true)} />
      </View>
    </Animated.View>
    </>
  )
}

export default function TaskPage() {
  // store actions + task list
  const { tasks, addTask, toggleTask, deleteTask, getProgress } = useTasks();

  const [newTask, setNewTask] = useState("");
  const [progress, setProgress] = useState(0);
  const [notification, setNotification] = useState(null); // short alerts
  const [isModalVisible, setIsModalVisible] = useState(false);

  // dark mode detection
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const colors = getThemedColors(isDarkMode);

  // adding a new task
  const handleAddTask = () => {
    const title = newTask.trim();
    if (title === "") {
      Alert.alert("Input Error", "Please enter a task.");
      setNotification("Please enter a task.");
      return;
    }
    addTask(newTask);
    setNotification('New task added: "' + newTask + '"');
    setNewTask("");
  };

  // update progress bar when tasks change
  useEffect(() => {
    const newProgress = getProgress();
    setProgress(newProgress);
  }, [tasks]);

  // auto clear notifications
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => { setNotification(null); }, 3000);
    return () => clearTimeout(timer);
  }, [notification]);

  // simple color rules for progress bar
  let barColor = progress >= 100 ? "green" : (progress >= 50 ? "yellow" : "red");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>To-Do List</Text>

      <Modal visible={isModalVisible} transparent animationType="slide" onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How It Works:</Text>
            <Text style={styles.modalMessage}>
              Use the "Add' button to create new tasks. {"\n"}
              Tap on a task to mark it complete. {"\n"}
              Use the "Delete" button to remove tasks. {"\n"}
              </Text>
            <Button title="Got it!" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <View style={{alignItems: 'center', marginBottom: 5}}>
        <Button title="Help Button" onPress={() => setIsModalVisible(true)} />
      </View>

      {notification && (
        <View style={styles.notification}>
          <Text style={styles.notificationText}>{notification}</Text>
        </View>
      )}

      <Separator />

      {/* progress display */}
      <View style={styles.progressSection}>
        <ProgressBar
          progress={progress}
          min={0}
          max={100}
          barColor={barColor}
          backColor={isDarkMode ? "#343434ff" :"#ddd"}
          borderColor={isDarkMode ? "gray" : "black"}
        />

        <Separator />
        <Text style={[styles.percentageText, { color: colors.text }]}>{progress}% Completed</Text>
      </View>

      {/* input row */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: isDarkMode ? "#343434ff":"#ddd", color:colors.text }]}
          placeholder="Add a new task"
          placeholderTextColor={isDarkMode ? "#999999" : "#555555"}
          value={newTask}
          onChangeText={setNewTask}
        />
        <View style={styles.button}>
          <Button title="Add" onPress={handleAddTask} />
        </View>
      </View>

      {/* task list */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskFade
            item={item}
            onToggle={() => toggleTask(item.id)}
            onDelete={(id) => {
              deleteTask(id);
              setNotification('Task deleted: "' + item.title + '"');
            }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    padding: 10,
    backgroundColor: "#4b86adff",
    paddingTop: 70
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  progressSection: {
    width: '33%',
    alignSelf: 'center',
  },
  percentageText: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  hintText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#aaa",
    textAlign: "center",
    marginBottom: 5,
  },
  inputContainer: {
    width: '75%',
    alignSelf: 'center',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    color: "#333333",
    backgroundColor: "#ccc",
  },
  button: {
    width: 90,
    borderRadius: 10,
    overflow: "hidden",
  },
  notificationText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    padding: 10,
    margin: 3
  },
  notification: {
    width: 150,
    position: "absolute",
    top: 50,
    right: 200,
    borderRadius: 5,
    backgroundColor: "#3e6ca9ff",
  },
  taskContainer: {
    width: '75%',
    alignSelf: 'center',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#002d59ff",
    borderRadius: 8,
    paddingRight: 40,
  },
  taskText: {
    margin: 10,
    fontSize: 18,
    color: "#fff",
  },
  taskTextCompleted: {
    fontSize: 18,
    color: "#aaa",
    textDecorationLine: "line-through",
  },
  separator: {
    height: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});
