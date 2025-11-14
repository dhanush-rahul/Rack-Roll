import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

const tournamentStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0c1612',
  },

  container: {
    flex: 1,
    backgroundColor: '#0c1612',
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
    color: '#ffffff',
  },

  menuIcon: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },

  menuLine: {
    height: 2,
    backgroundColor: '#ffffff',
    borderRadius: 1,
  },

  headerBottomRow: {
    marginTop: 8,
  },

  subTitle: {
    fontSize: 16,
    color: '#ccc',
  },

  // CARD
  cardWrapper: {
    marginBottom: 16,
  },

  card: {
    backgroundColor: '#182824',
    borderRadius: 16,
    overflow: 'hidden',
  },

  neonBorder: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderWidth: 1.2,
    borderColor: '#1fffac',
    borderRadius: 18,
    opacity: 0.12,
  },

  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },

  cardText: {
    flex: 1,
    paddingRight: 10,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },

  cardDate: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
  },

  miniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  miniStat: {
    fontSize: 13,
    color: '#ccc',
  },

  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#222',
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
    backgroundColor: '#0c1612',
    overflow: 'hidden',
    elevation: 6,
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
    color: '#ffffff',
    marginBottom: 6,
  },

  expandedDate: {
    fontSize: 15,
    color: '#aaa',
    marginBottom: 10,
  },

  statsBlock: {
    marginVertical: 10,
    gap: 6,
  },

  statText: {
    fontSize: 14,
    color: '#ccc',
  },

  registerButton: {
    marginTop: 12,
    paddingVertical: 12,
    backgroundColor: '#1fffac',
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
