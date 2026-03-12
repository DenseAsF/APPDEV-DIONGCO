import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const HomeScreen = () => {
  const renderSection = (title, items) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.grid}>
        {items.map((item, index) => (
          <TouchableOpacity key={index} style={styles.card}>
            <View style={styles.cardPlaceholder}>
              <Text style={styles.cardPlaceholderText}>{item.name.charAt(0)}</Text>
            </View>
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const rooms = [
    { name: 'Deluxe Room', description: 'Spacious and comfortable' },
    { name: 'Suite Room', description: 'Luxury with city view' },
    { name: 'Standard Room', description: 'Cozy and affordable' },
  ];

  const amenities = [
    { name: 'Spa', description: 'Relax and rejuvenate' },
    { name: 'Restaurant', description: 'World-class cuisine' },
    { name: 'Gym', description: 'Modern equipment' },
    { name: 'Pool', description: 'Infinity pool' },
    { name: 'Bar', description: 'Stylish lounge' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1D3599" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>HD</Text>
          </View>
          <Text style={styles.heroTitle}>Hotel Diongco</Text>
          <Text style={styles.heroSubtitle}>Experience Luxury & Warmth</Text>
          <TouchableOpacity style={styles.heroButton}>
            <Text style={styles.heroButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>Welcome to Hotel Diongco</Text>
          <Text style={styles.aboutDescription}>
            Experience the perfect balance of luxury and warmth at Hotel Diongco. 
            From elegant accommodations to world-class amenities, every detail is designed for your comfort.
          </Text>
        </View>

        {/* Rooms Section */}
        {renderSection('Our Rooms', rooms)}

        {/* Amenities Section */}
        {renderSection('Amenities & Services', amenities)}

        {/* Rewards Section */}
        <View style={styles.rewardsSection}>
          <Text style={styles.rewardsTitle}>Join Our Rewards Program</Text>
          <Text style={styles.rewardsDescription}>
            Earn points every time you book a room or enjoy our amenities.
            Accumulate points and redeem them for exclusive discounts and special offers.
          </Text>
          <TouchableOpacity style={styles.rewardsButton}>
            <Text style={styles.rewardsButtonText}>Start Earning Rewards</Text>
          </TouchableOpacity>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Experience Hotel Diongco?</Text>
          <Text style={styles.ctaDescription}>
            Book your stay today and start enjoying our luxury rooms and amenities.
          </Text>
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Book Now</Text>
          </TouchableOpacity>
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
  
  // Hero Section
  heroSection: {
    backgroundColor: '#1D3599',
    padding: 40,
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F2B622',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1D3599',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '300',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 24,
  },
  heroButton: {
    backgroundColor: '#F2B622',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  heroButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // About Section
  aboutSection: {
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  aboutTitle: {
    fontSize: 24,
    fontWeight: '300',
    color: '#1D3599',
    textAlign: 'center',
    marginBottom: 16,
  },
  aboutDescription: {
    fontSize: 14,
    color: '#435591',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Section Styles
  section: {
    padding: 20,
    backgroundColor: '#F8F9FA',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '300',
    color: '#1D3599',
    marginBottom: 20,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  cardPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E9ECEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardPlaceholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D3599',
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D3599',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 12,
    color: '#435591',
    textAlign: 'center',
    lineHeight: 16,
  },

  // Rewards Section
  rewardsSection: {
    padding: 20,
    backgroundColor: '#F8F9FA',
    marginTop: 10,
    alignItems: 'center',
  },
  rewardsTitle: {
    fontSize: 24,
    fontWeight: '300',
    color: '#1D3599',
    textAlign: 'center',
    marginBottom: 16,
  },
  rewardsDescription: {
    fontSize: 14,
    color: '#435591',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  rewardsButton: {
    backgroundColor: '#1D3599',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  rewardsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // CTA Section
  ctaSection: {
    backgroundColor: '#1D3599',
    padding: 40,
    alignItems: 'center',
    marginTop: 10,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '300',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  ctaButton: {
    backgroundColor: '#F2B622',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;