import './App.css'
import Mainpage from './pages/Mainpage'
import DrinkPage from './pages/DrinkPage'
import HeaderBar from './molecules/HeaderBar'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'
import Helmet from 'react-helmet'
import firebase from 'firebase'
import 'firebase/firestore';
import { useEffect, useState, useCallback, useRef } from 'react'
// import ReactGA from 'react-ga';


// dev
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCT_G8I6t642bWM-Jo6Yg7QZTPKjdNpygo",
  authDomain: "testsocialbeer.firebaseapp.com",
  projectId: "testsocialbeer",
  storageBucket: "testsocialbeer.appspot.com",
  messagingSenderId: "681727518625",
  appId: "1:681727518625:web:febb3cd58dcfde77844de0",
  measurementId: "G-GT3WQXSDMW"
};

// prod
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAqagHPw3xN-LixcBsH1qLbcyvenSghdS0",
//   authDomain: "craftcrew-9b1b5.firebaseapp.com",
//   projectId: "craftcrew-9b1b5",
//   storageBucket: "craftcrew-9b1b5.appspot.com",
//   messagingSenderId: "356906712221",
//   appId: "1:356906712221:web:cba74631f07e696ba42874",
//   measurementId: "G-C0E2DYPG7Q"
// };

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const storage = firebase.storage();

function App() {
  // ReactGA.initialize('UA-177822253-1')
  // ReactGA.pageview(window.location.pathname + window.location.search)
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [openSigninDialog, setOpenSigninDialog] = useState(false);
  const [favList, setFavList] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [recentTitle, setRecentTitle] = useState("")
  const [recentId, setRecentId] = useState("")
  const [routeTrigger, setRouteTrigger] = useState(false)
  const [drinksLoading, setDrinksLoading] = useState(true)


  
  //on component mount
  useEffect(() => {
    db.collection("Drinks").onSnapshot((dataEntries) => {
      let rows = []
      dataEntries.forEach(doc => {
        if(doc.data().brand === undefined) {
          return
        }
        if(doc.data().brand === recentTitle) {
          setRecentId(doc.id)
        }
        rows.push({
          docId: doc.id,
          brand: doc.data().brand,
          name: doc.data().name
        })
      })
      
      rows.sort(function(a, b) {
        return (a.brand < b.brand) ? -1 : 1
      })
      setDrinks(rows);
      setDrinksLoading(false)
    });
  }, [submitSuccess]);

  const triggerRender = () => {
    setRouteTrigger(!routeTrigger)
  }

  const updateFavList = (newReview) => {

  }

  return (
    <div className="App">
      <Helmet>
        <title>Craft Crew</title>
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;600;700;800&display=swap" rel="stylesheet"/>
      </Helmet>
      <Router>
        <HeaderBar drinks={drinks} triggerRender={triggerRender} db={db} favList={favList} setFavList={setFavList}
          isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn}
          openSigninDialog={openSigninDialog} setOpenSigninDialog={setOpenSigninDialog}
        />
        <div className="pageContainer">
            <Switch>
              <Route path="/drink/:id" render={({ match }) => <DrinkPage id={match.params.id} favList={favList} db={db} key={window.location.pathname} setFavList={setFavList} isSignedIn={isSignedIn} setOpenSigninDialog={setOpenSigninDialog}/>} /> 
              <Route path="/" render={(props) => (<Mainpage db={db} storage={storage} drinks={drinks} favList={favList} updateFavList={updateFavList} drinksLoading={drinksLoading} submitSuccess={submitSuccess} setSubmitSuccess={setSubmitSuccess} setRecentTitle={setRecentTitle} recentTitle={recentTitle} recentId={recentId} isSignedIn={isSignedIn} setOpenSigninDialog={setOpenSigninDialog}/>)}/>
            </Switch>
            
        </div>
      </Router>
    </div>
  );
}

export default App;
