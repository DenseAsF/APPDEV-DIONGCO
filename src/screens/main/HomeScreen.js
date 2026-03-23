import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
  ActivityIndicator,
  TouchableWithoutFeedback,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../utils';
import {
  toggleMenu,
  setCurrentSlide,
  fetchRoomsRequest,
  fetchAmenitiesRequest,
  scrollToSection as scrollToSectionAction,
} from '../../app/actions/homeActions';
import { logoutRequest } from '../../app/actions/authActions';
import {
  selectMenuVisible,
  selectCurrentSlide,
  selectRooms,
  selectAmenities,
  selectSectionLayouts,
  selectHomeLoading,
  selectHomeError,
} from '../../app/selectors/homeSelectors';
import { selectIsAuthenticated, selectAuthLoading } from '../../app/selectors/authSelectors';

const { width, height } = Dimensions.get('window');

const HamburgerIcon = () => (
  <View pointerEvents="none" style={styles.hamburgerContainer}>
    <View style={styles.hamburgerLine} />
    <View style={styles.hamburgerLine} />
    <View style={styles.hamburgerLine} />
  </View>
);

const getImageSource = (imageName) => {
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

const renderSectionHeader = (title) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const HomeScreen = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const dispatch = useDispatch();

  // Redux state
  const menuVisible = useSelector(selectMenuVisible);
  const currentSlide = useSelector(selectCurrentSlide);
  const rooms = useSelector(selectRooms);
  const amenities = useSelector(selectAmenities);
  const sectionLayouts = useSelector(selectSectionLayouts);
  const homeLoading = useSelector(selectHomeLoading);
  const homeError = useSelector(selectHomeError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authLoading = useSelector(selectAuthLoading);

  const onSectionLayout = (name) => (event) => {
    const { y } = event.nativeEvent.layout;
    dispatch(scrollToSectionAction(name, y));
  };

  const handleMenuToggle = () => {
    dispatch(toggleMenu());
  };

  const handleLogout = () => {
    dispatch(logoutRequest());
  };

  // Handle navigation after logout
  React.useEffect(() => {
    if (!isAuthenticated && authLoading === false) {
      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.LOGIN }],
      });
    }
  }, [isAuthenticated, authLoading, navigation]);

  const scrollToSection = (name) => {
    const y = sectionLayouts[name];
    if (y !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y, animated: true });
    }
    dispatch(toggleMenu());
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
    { name: 'Bar', description: 'Unwind with cocktails and music at our stylish lounge bar.', image: getImageSource('hotelspa') },
  ];

  const staticRooms = [
    { name: 'Deluxe Room', description: 'Spacious and comfortable, perfect for relaxation.', image: getImageSource('hotelroom') },
    { name: 'Suite Room', description: 'Luxury suite with a private balcony and city view.', image: getImageSource('hotelroom') },
    { name: 'Standard Room', description: 'Cozy and affordable, ideal for short stays.', image: getImageSource('hotelroom') },
  ];

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchRoomsRequest());
    dispatch(fetchAmenitiesRequest());

    // Auto slide carousel
    const timer = setInterval(() => {
      const slides = ['hotelpatterned', 'hotelroom', 'diningroom', 'hotelspa'];
      const nextSlide = (currentSlide + 1) % slides.length;
      dispatch(setCurrentSlide(nextSlide));
    }, 5000);

    return () => clearInterval(timer);
  }, [dispatch, currentSlide]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={handleMenuToggle} 
          style={styles.menuButton}
          activeOpacity={0.7}
        >
          <HamburgerIcon />
        </TouchableOpacity>
        <Image 
          source={getImageSource('logo')} 
          style={styles.headerLogoImage} 
          resizeMode="contain"
        />
        <View style={{ width: 40 }} /> 
      </View>

      {/* Side Menu Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => dispatch(toggleMenu())}
      >
        <TouchableWithoutFeedback onPress={() => dispatch(toggleMenu())}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.menuContainer}>
                <View style={styles.menuHeader}>
                  <Text style={styles.menuTitle}>HOTEL DIONGCO</Text>
                  <TouchableOpacity onPress={() => dispatch(toggleMenu())}>
                    <Text style={styles.closeText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.menuItems}>
                  <TouchableOpacity 
                    style={styles.menuItem} 
                    onPress={() => {
                      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
                      dispatch(toggleMenu());
                    }}
                  >
                    <Text style={styles.menuItemText}>Home</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => scrollToSection('rooms')}
                  >
                    <Text style={styles.menuItemText}>Rooms</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => scrollToSection('amenities')}
                  >
                    <Text style={styles.menuItemText}>Amenities</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => scrollToSection('about')}
                  >
                    <Text style={styles.menuItemText}>About Us</Text>
                  </TouchableOpacity>

                  <View style={styles.menuDivider} />

                  <TouchableOpacity 
                    style={[styles.menuItem, styles.logoutMenuItem]} 
                    onPress={handleLogout}
                  >
                    <Text style={[styles.menuItemText, styles.logoutMenuItemText]}>Logout</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={getImageSource(slides[currentSlide].image)}
            style={styles.heroBackground}
          >
            <View style={styles.heroOverlay}>
              <Text style={styles.heroTitle}>HOTEL DIONGCO</Text>
              <Text style={styles.heroSubtitle}>Experience Luxury & Warmth</Text>
              <TouchableOpacity style={styles.heroButton}>
                <Text style={styles.heroButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        {/* About Section */}
        <View onLayout={onSectionLayout('about')} style={styles.aboutSection}>
          <View style={styles.aboutTextContainer}>
            <Text style={styles.aboutTitle}>
              Experience the perfect balance of luxury and warmth.
            </Text>
            <Text style={styles.aboutDescription}>
              Experience the perfect balance of luxury and warmth at Hotel Diongco. From elegant accommodations to world-class amenities, 
              every detail is designed for your comfort. Whether you're here for business, leisure, or a special occasion, 
              enjoy exceptional service, refined hospitality, and unforgettable moments in the heart of Dumaguete City.
            </Text>
            <TouchableOpacity style={styles.learnMoreButton}>
              <Text style={styles.learnMoreText}>Learn More</Text>
            </TouchableOpacity>
          </View>
          <Image 
            source={getImageSource('hotel')} 
            style={styles.aboutImage} 
            resizeMode="cover"
          />
        </View>

        {/* Rooms Section */}
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
              {rooms.length > 0 ? rooms.map((room, index) => (
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
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Rooms</Text>
          </TouchableOpacity>
        </View>

        {/* Amenities Section */}
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
              {amenities.length > 0 ? amenities.map((item, index) => (
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
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>Inquire About Services</Text>
          </TouchableOpacity>
        </View>

        {/* Rewards Section */}
        <View style={styles.rewardsSection}>
          <View style={styles.rewardsTextContainer}>
            <Text style={styles.rewardsTitle}>Join Our Rewards Program</Text>
            <Text style={styles.rewardsDescription}>
              Earn points every time you book a room or enjoy our amenities.  
              Accumulate points and redeem them for exclusive discounts and special offers.  
              Your loyalty deserves to be rewarded!
            </Text>
            <Text style={styles.rewardBullet}>✔ Book & Earn Points</Text>
            <Text style={styles.rewardBullet}>✔ Collect Rewards with Every Stay</Text>
            <Text style={styles.rewardBullet}>✔ Redeem Discounts & Exclusive Perks</Text>
            
            <TouchableOpacity style={styles.rewardsButton}>
              <Text style={styles.rewardsButtonText}>Start Earning Rewards</Text>
            </TouchableOpacity>
          </View>
          <Image 
            source={getImageSource('hotelrewards')} 
            style={styles.rewardsImage}
            resizeMode="cover"
          />
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
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
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
    fontFamily: 'Helvetica-Bold',
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
    fontFamily: 'Helvetica',
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
    fontFamily: 'Helvetica-Bold',
  },
  heroContainer: {
    height: 500,
    width: '100%',
  },
  heroBackground: {
    flex: 1,
    width: '100%',
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 20, 77, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  heroTitle: {
    fontSize: 48,
    fontFamily: 'Helvetica-Bold', // Using Helvetica-Bold instead of Cinzel if not available
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 2,
  },
  heroSubtitle: {
    fontSize: 18,
    fontFamily: 'Helvetica',
    color: '#FFFFFF',
    marginTop: 15,
    textAlign: 'center',
  },
  heroButton: {
    marginTop: 30,
    backgroundColor: '#1D3599',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  heroButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
  },
  aboutSection: {
    padding: 30,
    backgroundColor: '#FFFFFF',
  },
  aboutTextContainer: {
    marginBottom: 30,
  },
  aboutTitle: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    lineHeight: 34,
  },
  aboutDescription: {
    fontSize: 16,
    fontFamily: 'Helvetica',
    color: '#435591',
    marginTop: 20,
    lineHeight: 24,
  },
  learnMoreButton: {
    marginTop: 25,
    backgroundColor: '#1D3599',
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  learnMoreText: {
    color: '#FFFFFF',
    fontFamily: 'Helvetica-Bold',
  },
  aboutImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
  section: {
    padding: 25,
    paddingTop: 40,
  },
  sectionTitle: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    marginBottom: 30,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  roomCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  amenityCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 15,
  },
  cardName: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: '#435591',
    marginTop: 8,
    lineHeight: 20,
  },
  viewAllButton: {
    marginTop: 10,
    backgroundColor: '#1D3599',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewAllText: {
    color: '#FFFFFF',
    fontFamily: 'Helvetica-Bold',
    fontSize: 16,
  },
  rewardsSection: {
    padding: 30,
    paddingTop: 50,
    backgroundColor: '#FFFFFF',
  },
  rewardsTextContainer: {
    marginBottom: 30,
  },
  rewardsTitle: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    marginBottom: 20,
  },
  rewardsDescription: {
    fontSize: 16,
    fontFamily: 'Helvetica',
    color: '#435591',
    lineHeight: 24,
    marginBottom: 20,
  },
  rewardBullet: {
    fontSize: 15,
    fontFamily: 'Helvetica',
    color: '#435591',
    marginBottom: 8,
  },
  rewardsButton: {
    marginTop: 25,
    backgroundColor: '#1D3599',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  rewardsButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Helvetica-Bold',
    fontSize: 16,
  },
  rewardsImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
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
    fontFamily: 'Helvetica',
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
    fontFamily: 'Helvetica',
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
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  ctaSubtitle: {
    fontSize: 16,
    fontFamily: 'Helvetica',
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
    fontFamily: 'Helvetica-Bold',
  },
});

export default HomeScreen;