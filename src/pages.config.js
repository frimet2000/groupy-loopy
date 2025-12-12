import Home from './pages/Home';
import CreateTrip from './pages/CreateTrip';
import TripDetails from './pages/TripDetails';
import MyTrips from './pages/MyTrips';
import AIRecommendations from './pages/AIRecommendations';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "CreateTrip": CreateTrip,
    "TripDetails": TripDetails,
    "MyTrips": MyTrips,
    "AIRecommendations": AIRecommendations,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};