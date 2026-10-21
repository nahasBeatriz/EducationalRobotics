import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';

const DRAWER_WIDTH = 260;
const SCREEN_WIDTH = Dimensions.get('window').width;

function DrawerContent({ onClose }: { onClose: () => void }) {
  return (
    <View style={styles.drawer}>
      <Text style={styles.drawerTitle}>Menu</Text>
      <TouchableOpacity style={styles.drawerItem} onPress={onClose}>
        <Text style={styles.drawerItemText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerItem} onPress={onClose}>
        <Text style={styles.drawerItemText}>Buzzer</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.timing(translateX, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(translateX, {
      toValue: -DRAWER_WIDTH,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setDrawerOpen(false));
  };

  return (
    <View style={styles.root}>
      <HomeScreen musicQueue={[]} onOpenDrawer={openDrawer} />

      {drawerOpen && (
        <TouchableWithoutFeedback onPress={closeDrawer}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View style={[styles.drawerContainer, { transform: [{ translateX }] }]}>
        <DrawerContent onClose={closeDrawer} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  overlay: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  drawerContainer: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0,
    width: DRAWER_WIDTH,
    zIndex: 100,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  drawer: { flex: 1, backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 20 },
  drawerTitle: { fontSize: 20, fontWeight: '700', marginBottom: 24, color: '#333' },
  drawerItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#eee' },
  drawerItemText: { fontSize: 16, color: '#333' },
});