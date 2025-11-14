import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');

const tournamentStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
    paddingTop: 8,
  },

  // HEADER
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },

  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },

  menuIcon: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },

  menuLine: {
    height: 2,
    backgroundColor: Colors.textPrimary,
    borderRadius: 1,
  },

  headerBottomRow: {
    marginTop: 8,
  },

  subTitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },

  // CARD
  cardWrapper: {
    marginBottom: 16,
  },

  cardWrapperCompact: {
    marginBottom: 16,
    marginRight: 6, // Only reduce width from the right
  },

  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },

  accentStripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    zIndex: 2,
  },

  neonGlow: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderWidth: 1.5,
    borderRadius: 16,
    opacity: 0.4,
  },

  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 18,
    paddingVertical: 20, // Much more vertical padding for tall cards
    paddingLeft: 22, // Extra space for accent stripe
  },

  cardContentCompact: {
    paddingVertical: 10, // Very compact
  },

  cardText: {
    flex: 1,
    paddingRight: 12,
    justifyContent: 'center',
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  statusIcon: {
    fontSize: 12,
    marginRight: 8,
    lineHeight: 12,
  },

  statusLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  locationName: {
    fontSize: 19,
    fontWeight: '700',
    color: Colors.neonGreen,
    marginBottom: 5,
    letterSpacing: 0.3,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  miniStat: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },

  statDivider: {
    fontSize: 13,
    color: Colors.textMuted,
    marginHorizontal: 8,
  },

  cardDate: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '400',
  },

  miniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#0f1814',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 255, 159, 0.2)',
  },

  // EXPANDED OVERLAY
  modalContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },

  backdrop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#000',
  },

  overlayCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  expandedCard: {
    width: width - 48,
    borderRadius: 16,
    backgroundColor: Colors.cardBackground,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },

  expandedImage: {
    width: '100%',
    height: 180,
  },

  expandedContent: {
    padding: 16,
  },

  expandedTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 6,
  },

  expandedDate: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 10,
  },

  statsBlock: {
    marginVertical: 10,
    gap: 6,
  },

  statText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },

  registerButton: {
    marginTop: 12,
    paddingVertical: 12,
    backgroundColor: Colors.neonGreen,
    borderRadius: 10,
    alignItems: 'center',
  },

  registerText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 16,
  },
});

export default tournamentStyles;
