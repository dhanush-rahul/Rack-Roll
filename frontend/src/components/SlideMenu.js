import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useNavigation, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');
const MENU_WIDTH = width * 0.75; // 75% of screen width

const SlideMenu = ({ isOpen, onClose, contentAnimation }) => {
  const navigation = useNavigation();
  const translateX = useSharedValue(-MENU_WIDTH);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      // Open animation
      translateX.value = withTiming(0, {
        duration: 350,
        easing: Easing.out(Easing.cubic),
      });
      opacity.value = withTiming(1, {
        duration: 350,
        easing: Easing.out(Easing.cubic),
      });
      // Slide hamburger icon to the right
      if (contentAnimation) {
        contentAnimation.value = withTiming(250, {
          duration: 350,
          easing: Easing.out(Easing.cubic),
        });
      }
    } else {
      // Close animation
      translateX.value = withTiming(-MENU_WIDTH, {
        duration: 300,
        easing: Easing.in(Easing.cubic),
      });
      opacity.value = withTiming(0, {
        duration: 300,
        easing: Easing.in(Easing.cubic),
      });
      // Slide hamburger icon back
      if (contentAnimation) {
        contentAnimation.value = withTiming(0, {
          duration: 300,
          easing: Easing.in(Easing.cubic),
        });
      }
    }
  }, [isOpen]);

  const menuStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.6,
  }));

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    onClose();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Signin' }],
      })
    );
  };

  const handleNavigate = (screen) => {
    onClose();
    setTimeout(() => {
      navigation.navigate(screen);
    }, 300);
  };

  if (!isOpen && opacity.value === 0) return null;

  return (
    <View style={styles.container} pointerEvents={isOpen ? 'auto' : 'none'}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, backdropStyle]} />
      </TouchableWithoutFeedback>

      {/* Menu Panel */}
      <Animated.View style={[styles.menuPanel, menuStyle]}>
        <View style={styles.menuHeader}>
          <Text style={styles.menuTitle}>Menu</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuItems}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigate('Tournament')}
          >
            <Text style={styles.menuIcon}>🏆</Text>
            <Text style={styles.menuText}>Tournaments</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigate('CreateTournament')}
          >
            <Text style={styles.menuIcon}>➕</Text>
            <Text style={styles.menuText}>Create Tournament</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigate('Player')}
          >
            <Text style={styles.menuIcon}>👥</Text>
            <Text style={styles.menuText}>Manage Players</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={[styles.menuItem, styles.logoutItem]}
            onPress={handleLogout}
          >
            <Text style={styles.menuIcon}>🚪</Text>
            <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
  menuPanel: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: MENU_WIDTH,
    backgroundColor: Colors.cardBackground,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 16,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.neonGreen,
  },
  closeButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  closeIcon: {
    fontSize: 20,
    color: Colors.textPrimary,
    fontWeight: '300',
  },
  menuItems: {
    paddingTop: 24,
    paddingHorizontal: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 32,
  },
  menuText: {
    fontSize: 17,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 16,
    marginHorizontal: 20,
  },
  logoutItem: {
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
  },
  logoutText: {
    color: Colors.hotPink,
  },
});

export default SlideMenu;
