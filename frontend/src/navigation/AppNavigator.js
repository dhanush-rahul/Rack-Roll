import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from '../screens/HomeScreen';
import TournamentScreen from '../screens/TournamentScreen';
import PlayerScreen from '../screens/PlayerScreen';
import SigninScreen from '../screens/SigninScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import Scoresheet from '../screens/Scoresheet';
import AddPlayerScreen from '../screens/AddPlayerScreen';

const AppNavigator = createStackNavigator(
    {
        HomeScreen: HomeScreen,
        SignIn: SigninScreen,
        CreateAccount: CreateAccountScreen,
        Tournament: TournamentScreen,
        Player: PlayerScreen,
        AddPlayerScreen: AddPlayerScreen,
        Scoresheet: Scoresheet,
    },
    {
        initialRouteName: 'HomeScreen',
    }
);

export default createAppContainer(AppNavigator);
