import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Modal,
  ActivityIndicator,
  TouchableWithoutFeedback,
  StatusBar,
  SafeAreaView,
  BackHandler,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { useNotifications } from '../../context/NotificationContext';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
import {
  toggleMenu,
  fetchRoomsRequest,
  fetchAmenitiesRequest,
  scrollToSection as scrollToSectionAction,
} from '../../app/actions/homeActions';
import { logoutRequest } from '../../app/actions/authActions';
import {
  selectMenuVisible,
  selectRooms,
  selectAmenities,
  selectSectionLayouts,
  selectHomeLoading,
  selectHomeError,
} from '../../app/selectors/homeSelectors';

const { width, height } = Dimensions.get('window');

const HamburgerIcon = () => (
  <View pointerEvents="none" style={styles.hamburgerContainer}>
    <View style={styles.hamburgerLine} />
    <View style={styles.hamburgerLine} />
    <View style={styles.hamburgerLine} />
  </View>
);

const getImageSource = (imageName: string) => {
  switch (imageName) {
    case 'hotelpatterned':
      return require('../../../assets/images/hotelpatterned.png');
    case 'hotelroom':
      return require('../../../assets/images/hotelroom.png');
    case 'diningroom':
      return require('../../../assets/images/diningroom.png');
    case 'hotelspa':
      return require('../../../assets/images/hotelspa.png');
    case 'hotel':
      return require('../../../assets/images/hotel.png');
    case 'hotelrewards':
      return require('../../../assets/images/hotelrewards.png');
    case 'logo':
      return require('../../../assets/images/HOTEL LOGO.png');
    default:
      return require('../../../assets/images/hotelpatterned.png');
  }
};

const renderSectionHeader = (title: string) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const BellIcon = ({ unreadCount }: { unreadCount: number }) => (
  <View style={styles.bellContainer}>
    <View style={styles.bellIconWrapper}>
      {/* Simple bell shape using Views — no external icon library needed */}
      <View style={styles.bellTop} />
      <View style={styles.bellBody} />
      <View style={styles.bellBottom} />
    </View>
    {unreadCount > 0 && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {unreadCount > 9 ? '9+' : unreadCount}
        </Text>
      </View>
    )}
  </View>
);

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const scrollViewRef = useRef<ScrollView>(null);
  const dispatch = useDispatch();
  const [currentSlide, setCurrentSlide] = useState(0);

  const menuVisible = useSelector(selectMenuVisible);
  const rooms = useSelector(selectRooms);
  const amenities = useSelector(selectAmenities);
  const sectionLayouts = useSelector(selectSectionLayouts);
  const homeLoading = useSelector(selectHomeLoading);
  const homeError = useSelector(selectHomeError);
  const { unreadCount } = useNotifications();

  const onSectionLayout = (name: string) => (event: any) => {
    const { y } = event.nativeEvent.layout;
    (dispatch as any)(scrollToSectionAction(name, y));
  };

  const handleMenuToggle = () => {
    (dispatch as any)(toggleMenu());
  };

  const handleLogout = useCallback(() => {
    (dispatch as any)(logoutRequest());
  }, [dispatch]);

  const scrollToSection = (name: string) => {
    const y = sectionLayouts[name];
    if (y !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y, animated: true });
    }
    (dispatch as any)(toggleMenu());
  };

  const slides = [
    { image: 'hotelpatterned', title: 'HOTEL DIONGCO', subtitle: 'Experience Luxury & Warmth' },
    { image: 'hotelroom', title: 'HOTEL DIONGCO', subtitle: 'Experience Luxury & Warmth' },
    { image: 'diningroom', title: 'HOTEL DIONGCO', subtitle: 'Experience Luxury & Warmth' },
    { image: 'hotelspa', title: 'HOTEL DIONGCO', subtitle: 'Experience Luxury & Warmth' },
  ];

  const staticAmenities = [
    { name: 'Spa', description: 'Relax and rejuvenate with our luxury spa treatments.', image: getImageSource('hotelspa') },
    { name: 'Restaurant', description: 'Enjoy world-class cuisine prepared by our top chefs.', image: getImageSource('hotelspa') },
    { name: 'Gym', description: 'Stay fit with modern equipment and spacious workout areas.', image: getImageSource('hotelspa') },
    { name: 'Pool', description: 'Take a refreshing swim in our outdoor infinity pool.', image: getImageSource('hotelspa') },
  ];

  const staticRooms = [
    { name: 'Deluxe Room', description: 'Spacious and comfortable, perfect for relaxation.', image: getImageSource('hotelroom') },
    { name: 'Suite Room', description: 'Luxury suite with a private balcony and city view.', image: getImageSource('hotelroom') },
    { name: 'Standard Room', description: 'Cozy and affordable, ideal for short stays.', image: getImageSource('hotelroom') },
  ];

  useEffect(() => {
    (dispatch as any)(fetchRoomsRequest());
    (dispatch as any)(fetchAmenitiesRequest());

    const timer = setInterval(() => {
      const slides = ['hotelpatterned', 'hotelroom', 'diningroom', 'hotelspa'];
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [dispatch]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Close menu if open
      if (menuVisible) {
        (dispatch as any)(toggleMenu());
        return true;
      }
      // Otherwise let default back behavior happen (go to previous screen)
      return false;
    });

    return () => {
      backHandler.remove();
    };
  }, [menuVisible, dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleMenuToggle} style={styles.menuButton} activeOpacity={0.7}>
          <HamburgerIcon />
        </TouchableOpacity>
        <Image source={getImageSource('logo')} style={styles.headerLogoImage} resizeMode="contain" />
        <TouchableOpacity
          onPress={() => navigation.navigate('Notifications')}
          style={styles.bellButton}
          activeOpacity={0.7}>
          <BellIcon unreadCount={unreadCount} />
        </TouchableOpacity>
      </View>

      <Modal animationType="fade" transparent={true} visible={menuVisible} onRequestClose={() => (dispatch as any)(toggleMenu())}>
        <TouchableWithoutFeedback onPress={() => (dispatch as any)(toggleMenu())}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.menuContainer}>
                <View style={styles.menuHeader}>
                  <Text style={styles.menuTitle}>HOTEL DIONGCO</Text>
                  <TouchableOpacity onPress={() => (dispatch as any)(toggleMenu())}>
                    <Text style={styles.closeText}>×</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.menuItems}>
                  <TouchableOpacity style={styles.menuItem} onPress={() => {
                    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
                    (dispatch as any)(toggleMenu());
                  }}>
                    <Text style={styles.menuItemText}>Home</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuItem} onPress={() => scrollToSection('rooms')}>
                    <Text style={styles.menuItemText}>Rooms</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuItem} onPress={() => scrollToSection('amenities')}>
                    <Text style={styles.menuItemText}>Amenities</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuItem} onPress={() => scrollToSection('about')}>
                    <Text style={styles.menuItemText}>About Us</Text>
                  </TouchableOpacity>

                  <View style={styles.menuDivider} />

                  <TouchableOpacity 
                    style={styles.menuItem} 
                    onPress={() => {
                      (dispatch as any)(toggleMenu());
                      navigation.navigate('MyBookings');
                    }}
                  >
                    <Text style={styles.menuItemText}>My Bookings</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.menuItem} 
                    onPress={() => {
                      (dispatch as any)(toggleMenu());
                      navigation.navigate('Profile');
                    }}
                  >
                    <Text style={styles.menuItemText}>My Profile</Text>
                  </TouchableOpacity>

                  <View style={styles.menuDivider} />

                  <TouchableOpacity style={[styles.menuItem, styles.logoutMenuItem]} onPress={handleLogout}>
                    <Text style={[styles.menuItemText, styles.logoutMenuItemText]}>Logout</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
        <View style={styles.heroContainer}>
          <ImageBackground source={getImageSource(slides[currentSlide].image)} style={styles.heroBackground}>
            <View style={styles.heroOverlay}>
              <Text style={styles.heroTitle}>HOTEL DIONGCO</Text>
              <Text style={styles.heroSubtitle}>Experience Luxury & Warmth</Text>
              <TouchableOpacity 
                style={styles.heroButton}
                onPress={() => navigation.navigate('Rooms')}
              >
                <Text style={styles.heroButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        <View onLayout={onSectionLayout('about')} style={styles.aboutSection}>
          <View style={styles.aboutTextContainer}>
            <Text style={styles.aboutTitle}>Experience the perfect balance of luxury and warmth.</Text>
            <Text style={styles.aboutDescription}>Experience the perfect balance of luxury and warmth at Hotel Diongco. From elegant accommodations to world-class amenities, every detail is designed for your comfort. Whether you're here for business, leisure, or a special occasion, enjoy exceptional service, refined hospitality, and unforgettable moments in the heart of Dumaguete City.</Text>
            <TouchableOpacity 
              style={styles.learnMoreButton}
              onPress={() => scrollViewRef.current?.scrollTo({ y: 0, animated: true })}
            >
              <Text style={styles.learnMoreText}>Learn More</Text>
            </TouchableOpacity>
          </View>
          <Image source={getImageSource('hotel')} style={styles.aboutImage} resizeMode="cover" />
        </View>

        <View onLayout={onSectionLayout('rooms')} style={styles.section}>
          {renderSectionHeader('Our Rooms')}
          {homeLoading.rooms ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1D3599" />
              <Text style={styles.loadingText}>Loading rooms...</Text>
            </View>
          ) : homeError.rooms ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Error loading rooms: {homeError.rooms}</Text>
            </View>
          ) : (
            <View style={styles.cardGrid}>
              {rooms.length > 0 ? rooms.map((room: any, index: number) => (
                <View key={index} style={styles.roomCard}>
                  <Image source={room.imageName ? getImageSource(room.imageName) : getImageSource('hotelroom')} style={styles.cardImage} />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardName}>{room.name}</Text>
                    <Text style={styles.cardDescription}>{room.description}</Text>
                  </View>
                </View>
              )) : staticRooms.map((room, index) => (
                <View key={index} style={styles.roomCard}>
                  <Image source={room.image} style={styles.cardImage} />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardName}>{room.name}</Text>
                    <Text style={styles.cardDescription}>{room.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => navigation.navigate('Rooms')}
          >
            <Text style={styles.viewAllText}>View All Rooms</Text>
          </TouchableOpacity>
        </View>

        <View onLayout={onSectionLayout('amenities')} style={[styles.section, { backgroundColor: '#F8F9FA' }]}>
          {renderSectionHeader('Amenities & Services')}
          {homeLoading.amenities ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1D3599" />
              <Text style={styles.loadingText}>Loading amenities...</Text>
            </View>
          ) : homeError.amenities ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Error loading amenities: {homeError.amenities}</Text>
            </View>
          ) : (
            <View style={styles.cardGrid}>
              {amenities.length > 0 ? amenities.map((item: any, index: number) => (
                <View key={index} style={styles.amenityCard}>
                  <Image source={item.imageName ? getImageSource(item.imageName) : getImageSource('hotelspa')} style={styles.cardImage} />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardName}>{item.name}</Text>
                    <Text style={styles.cardDescription}>{item.description}</Text>
                  </View>
                </View>
              )) : staticAmenities.map((item, index) => (
                <View key={index} style={styles.amenityCard}>
                  <Image source={item.image} style={styles.cardImage} />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardName}>{item.name}</Text>
                    <Text style={styles.cardDescription}>{item.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => navigation.navigate('MyBookings')}
          >
            <Text style={styles.viewAllText}>View My Bookings</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rewardsSection}>
          <View style={styles.rewardsTextContainer}>
            <Text style={styles.rewardsTitle}>Join Our Rewards Program</Text>
            <Text style={styles.rewardsDescription}>Earn points every time you book a room or enjoy our amenities. Accumulate points and redeem them for exclusive discounts and special offers. Your loyalty deserves to be rewarded!</Text>
            <Text style={styles.rewardBullet}> Book & Earn Points</Text>
            <Text style={styles.rewardBullet}> Collect Rewards with Every Stay</Text>
            <Text style={styles.rewardBullet}> Redeem Discounts & Exclusive Perks</Text>

            <TouchableOpacity 
              style={styles.rewardsButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.rewardsButtonText}>View My Profile</Text>
            </TouchableOpacity>
          </View>
          <Image source={getImageSource('hotelrewards')} style={styles.rewardsImage} resizeMode="cover" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuButton: {
    padding: 5,
  },
  hamburgerContainer: {
    width: 25,
    height: 20,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: '100%',
    height: 3,
    backgroundColor: '#1D3599',
    borderRadius: 2,
  },
  headerLogoImage: {
    width: 120,
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  menuContainer: {
    width: width * 0.75,
    height: '100%',
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    marginBottom: 40,
  },
  menuTitle: {
    fontSize: 20,
    fontFamily: 'Helvetica Neue LT Std',
    color: '#1D3599',
    letterSpacing: 1,
  },
  closeText: {
    fontSize: 24,
    color: '#1D3599',
    fontWeight: '300',
  },
  menuItems: {
    paddingHorizontal: 25,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemText: {
    fontSize: 18,
    fontFamily: 'Helvetica Neue LT Std',
    color: '#333333',
  },
  menuDivider: {
    height: 40,
  },
  logoutMenuItem: {
    borderBottomWidth: 0,
    marginTop: 20,
  },
  logoutMenuItemText: {
    color: '#D32F2F',
    fontFamily: 'Helvetica Neue LT Std',
  },
  heroContainer: {
    height: 480,
    width: '100%',
  },
  heroBackground: {
    flex: 1,
    width: '100%',
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 15, 60, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  heroTitle: {
    fontSize: 44,
    fontFamily: 'Helvetica Neue LT Std',
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 3,
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: 'Helvetica Neue LT Std',
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  heroButton: {
    marginTop: 28,
    backgroundColor: '#1D3599',
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: '#1D3599',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  heroButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Helvetica Neue LT Std',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  aboutSection: {
    padding: 30,
    backgroundColor: '#FFFFFF',
  },
  aboutTextContainer: {
    marginBottom: 24,
  },
  aboutTitle: {
    fontSize: 26,
    fontFamily: 'Helvetica Neue LT Std',
    fontWeight: '700',
    color: '#1A1A1A',
    lineHeight: 34,
  },
  aboutDescription: {
    fontSize: 15,
    fontFamily: 'Helvetica Neue LT Std',
    fontWeight: '300',
    color: '#555555',
    marginTop: 16,
    lineHeight: 24,
  },
  learnMoreButton: {
    marginTop: 20,
    backgroundColor: '#1D3599',
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  learnMoreText: {
    color: '#FFFFFF',
    fontFamily: 'Helvetica Neue LT Std',
    fontWeight: '600',
    fontSize: 14,
  },
  aboutImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
  },
  section: {
    padding: 28,
    paddingTop: 44,
  },
  sectionTitle: {
    fontSize: 26,
    fontFamily: 'Helvetica Neue LT Std',
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 24,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  roomCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  amenityCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 170,
  },
  cardContent: {
    padding: 14,
  },
  cardName: {
    fontSize: 16,
    fontFamily: 'Helvetica Neue LT Std',
    fontWeight: '600',
    color: '#1A1A1A',
  },
  cardDescription: {
    fontSize: 13,
    fontFamily: 'Helvetica Neue LT Std',
    fontWeight: '300',
    color: '#666666',
    marginTop: 6,
    lineHeight: 18,
  },
  viewAllButton: {
    marginTop: 16,
    backgroundColor: '#1D3599',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#1D3599',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  viewAllText: {
    color: '#FFFFFF',
    fontFamily: 'Helvetica Neue LT Std',
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  rewardsSection: {
    padding: 30,
    paddingTop: 44,
    paddingBottom: 36,
    backgroundColor: '#F8F9FA',
  },
  rewardsTextContainer: {
    marginBottom: 24,
  },
  rewardsTitle: {
    fontSize: 26,
    fontFamily: 'Helvetica Neue LT Std',
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  rewardsDescription: {
    fontSize: 15,
    fontFamily: 'Helvetica Neue LT Std',
    fontWeight: '300',
    color: '#555555',
    lineHeight: 24,
    marginBottom: 16,
  },
  rewardBullet: {
    fontSize: 14,
    fontFamily: 'Helvetica Neue LT Std',
    fontWeight: '400',
    color: '#1D3599',
    marginBottom: 8,
  },
  rewardsButton: {
    marginTop: 20,
    backgroundColor: '#1D3599',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    alignSelf: 'flex-start',
    shadowColor: '#1D3599',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  rewardsButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Helvetica Neue LT Std',
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  rewardsImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Helvetica Neue LT Std',
    color: '#1D3599',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Helvetica Neue LT Std',
    color: '#D32F2F',
    textAlign: 'center',
  },
  ctaSection: {
    backgroundColor: '#1D3599',
    padding: 50,
    paddingTop: 60,
    alignItems: 'center',
    marginTop: 40,
  },
  ctaTitle: {
    fontSize: 26,
    fontFamily: 'Helvetica Neue LT Std',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  ctaSubtitle: {
    fontSize: 16,
    fontFamily: 'Helvetica Neue LT Std',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    opacity: 0.9,
  },
  ctaButton: {
    backgroundColor: '#F2B622',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Helvetica Neue LT Std',
  },
    bellButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellContainer: {
    position: 'relative',
    width: 26,
    height: 28,
    alignItems: 'center',
  },
  bellIconWrapper: {
    alignItems: 'center',
  },
  bellTop: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1A1A1A',
    marginBottom: 1,
  },
  bellBody: {
    width: 18,
    height: 14,
    borderRadius: 9,
    borderWidth: 2.5,
    borderColor: '#1A1A1A',
    borderBottomWidth: 0,
  },
  bellBottom: {
    width: 22,
    height: 3,
    backgroundColor: '#1A1A1A',
    borderRadius: 2,
    marginTop: 1,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#c62828',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});

export default HomeScreen;
