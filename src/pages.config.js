/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AddContact from './pages/AddContact';
import AdminUsers from './pages/AdminUsers';
import AllContacts from './pages/AllContacts';
import ExhibitionDetail from './pages/ExhibitionDetail';
import Exhibitions from './pages/Exhibitions';
import Home from './pages/Home';
import ImportContacts from './pages/ImportContacts';
import ImportExport from './pages/ImportExport';
import MyCard from './pages/MyCard';
import NewExhibition from './pages/NewExhibition';
import ScanCard from './pages/ScanCard';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AddContact": AddContact,
    "AdminUsers": AdminUsers,
    "AllContacts": AllContacts,
    "ExhibitionDetail": ExhibitionDetail,
    "Exhibitions": Exhibitions,
    "Home": Home,
    "ImportContacts": ImportContacts,
    "ImportExport": ImportExport,
    "MyCard": MyCard,
    "NewExhibition": NewExhibition,
    "ScanCard": ScanCard,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};