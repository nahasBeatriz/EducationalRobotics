import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './src/screens/HomeScreen';

const Drawer = createDrawerNavigator();

function BuzzerScreen() {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>Configuração do Buzzer</Text>
    </View>
  );
}

function HomeWithDrawer({ navigation }: any) {
  return (
    <HomeScreen
      musicQueue={[]}
      onOpenDrawer={() => navigation.openDrawer()}
    />
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeWithDrawer} options={{ headerShown: false }} />
        <Drawer.Screen name="Buzzer" component={BuzzerScreen} options={{ title: 'Buzzer' }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E3E3E3' },
  placeholderText: { fontSize: 18, color: '#333' },
});