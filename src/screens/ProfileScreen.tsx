import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Modal, Animated } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';

interface ProfileScreenProps {
  visible: boolean;
  onClose: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ visible, onClose }) => {
    const { theme } = useTheme();
    const slideAnim = useRef(new Animated.Value(300)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 300,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, slideAnim]);


    return (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <Animated.View style={[styles.profileContainer, { backgroundColor: theme.colors.surface, transform: [{ translateX: slideAnim }] }]}>
                     <Appbar.Header>
                        <Appbar.Content title="Profile" />
                        <Appbar.Action icon="close" onPress={onClose} />
                    </Appbar.Header>
                    <View style={{flex: 1, padding: 20}}>
                        <Text style={{color: theme.colors.onSurface}}>User Profile Info</Text>
                        {/* Add more profile details here */}
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    profileContainer: {
        width: '80%',
        height: '100%',
    },
});

export default ProfileScreen;
