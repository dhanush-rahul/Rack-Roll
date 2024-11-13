import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from '../screens/HomeScreen';
import TournamentScreen from '../screens/TournamentScreen';
import PlayerScreen from '../screens/PlayerScreen';
import CreateAccountScreen from '../screens/SignupScreen';
import SigninScreen from '../screens/SigninScreen';

const AppNavigator = createStackNavigator(
    {
        Home: HomeScreen,
        SignIn: SigninScreen,
        CreateAccount: CreateAccountScreen,
        Tournament: TournamentScreen,
        Player: PlayerScreen,
    },
    {
        initialRouteName: 'Home',
    }
);

export default createAppContainer(AppNavigator);
