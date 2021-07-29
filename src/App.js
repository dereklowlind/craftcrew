import './App.css'
import Mainpage from './pages/Mainpage'
import CoursePage from './pages/CoursePage'
import HeaderBar from './molecules/HeaderBar'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'
import DrawerMenu from './molecules/DrawerMenu'
import Helmet from 'react-helmet'
import firebase from 'firebase'
import 'firebase/firestore';
import { useEffect, useState, useCallback, useRef } from 'react'
// import ReactGA from 'react-ga';
import Webcam from "react-webcam";


// Initialize Firebase
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
  const [lists, setLists] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [recentTitle, setRecentTitle] = useState("")
  const [recentId, setRecentId] = useState("")
  const [routeTrigger, setRouteTrigger] = useState(false)
  const [courseListLoading, setCourseListLoading] = useState(true)
  const [imgSrc, setImgSrc] = useState(null);

  
  //on component mount
  useEffect(() => {
    db.collection("Lists").onSnapshot((dataEntries) => {
      let rows = []
      dataEntries.forEach(doc => {
        if(doc.data().title === undefined) {
          return
        }
        if(doc.data().title === recentTitle) {
          setRecentId(doc.id)
        }
        rows.push({
          docId: doc.id,
          title: doc.data().title,
          subtitle: doc.data().description
        })
      })
      
      rows.sort(function(a, b) {
        return (a.title < b.title) ? -1 : 1
      })
      setLists(rows);
      setCourseListLoading(false)
    });
  }, [submitSuccess]);

  const triggerRender = () => {
    setRouteTrigger(!routeTrigger)
  }

  const updateFavList = (newTopic) => {

  }

  const webcamRef = useRef(null);
  
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    storage.ref('images/testimage').putString(imageSrc, 'data_url').then((snapshot) => {
      console.log('Uploaded image!');
    });
  }, [webcamRef, setImgSrc]);

  return (
    <div className="App">
      <Helmet>
        <title>Lurndit</title>
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;600;700;800&display=swap" rel="stylesheet"/>
      </Helmet>
      <Router>
        <HeaderBar lists={lists} triggerRender={triggerRender} db={db} setFavList={setFavList}
          isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn}
          openSigninDialog={openSigninDialog} setOpenSigninDialog={setOpenSigninDialog}
        />
        <div className="pageContainer">
          <DrawerMenu favList={favList} isSignedIn={isSignedIn} setOpenSigninDialog={setOpenSigninDialog}/>
            <Switch>
              <Route path="/course/:id" render={({ match }) => <CoursePage id={match.params.id} favList={favList} db={db} key={window.location.pathname} setFavList={setFavList} isSignedIn={isSignedIn} setOpenSigninDialog={setOpenSigninDialog}/>} /> 
              <Route path="/" render={(props) => (<Mainpage db={db} lists={lists} favList={favList} updateFavList={updateFavList} coursesLoading={courseListLoading} submitSuccess={submitSuccess} setSubmitSuccess={setSubmitSuccess} setRecentTitle={setRecentTitle} recentTitle={recentTitle} recentId={recentId} isSignedIn={isSignedIn} setOpenSigninDialog={setOpenSigninDialog}/>)}/>
            </Switch>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
            />
            <button onClick={capture}>Capture photo</button>
            {imgSrc && (
              <img
                src={imgSrc}
              />
            )}

        </div>
      </Router>
    </div>
  );
}

export default App;