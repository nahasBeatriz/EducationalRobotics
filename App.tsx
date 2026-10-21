import React, { useState, useRef } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    Animated, TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MotionScreen from './src/screens/MotionScreen';
import MusicScreen from './src/screens/MusicScreen';
import { useMusic } from './src/hooks/useMusic';

type Screen = 'motion' | 'music';

const DRAWER_WIDTH = 260;

const MENU_ITEMS: { key: Screen; label: string; icon: string }[] = [
    { key: 'motion', label: 'Movimento', icon: '' },
    { key: 'music',  label: 'Buzzer',    icon: '' },
];

export default function App() {
    const [currentScreen, setCurrentScreen] = useState<Screen>('motion');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

    const { musicQueue, addNote, removeNote, moveNote, clearMusic } = useMusic();

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

    const navigate = (screen: Screen) => {
        closeDrawer();
        setTimeout(() => setCurrentScreen(screen), 200);
    };

    const renderScreen = () => {
        switch (currentScreen) {
            case 'motion':
                return <MotionScreen musicQueue={musicQueue} onOpenDrawer={openDrawer} />;
            case 'music':
                return (
                    <MusicScreen
                        musicQueue={musicQueue}
                        onAdd={addNote}
                        onRemove={removeNote}
                        onMoveUp={id => moveNote(id, 'up')}
                        onMoveDown={id => moveNote(id, 'down')}
                        onClear={clearMusic}
                        onOpenDrawer={openDrawer}/>
                );
        }
    };

    return (
        <View style={styles.root}>
            {renderScreen()}

            {drawerOpen && (
                <TouchableWithoutFeedback onPress={closeDrawer}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
            )}

            <Animated.View style={[styles.drawerContainer, { transform: [{ translateX }] }]}>
                <SafeAreaView style={styles.drawer}>
                    <Text style={styles.drawerTitle}>Menu</Text>
                    {MENU_ITEMS.map(item => (
                        <TouchableOpacity
                            key={item.key}
                            style={[
                                styles.drawerItem,
                                currentScreen === item.key && styles.drawerItemActive,
                            ]}
                            onPress={() => navigate(item.key)}>
                            <Text style={[
                                styles.drawerItemText,
                                currentScreen === item.key && styles.drawerItemTextActive,
                            ]}>
                                {item.icon}{'  '}{item.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </SafeAreaView>
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
        zIndex: 99,
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
    drawer: { flex: 1, backgroundColor: '#35005a', paddingHorizontal: 20, paddingTop: 20 },
    drawerTitle: { fontSize: 20, fontWeight: '700', marginBottom: 24, color: '#ffffff' },
    drawerItem: {
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#35005a',
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    drawerItemActive: { backgroundColor: '#560072' },
    drawerItemText: { fontSize: 16, color: '#ffffff' },
    drawerItemTextActive: { color: '#ffffff', fontWeight: '700' },
});