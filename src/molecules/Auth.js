// Import FirebaseAuth and firebase.
import React, { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import {
  Button, Dialog, DialogContent, 
  DialogTitle, DialogActions, 
  } from '@material-ui/core';

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // firebase.auth.FacebookAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

function Auth(props) {
    const isSignedIn = props.isSignedIn;
    const setIsSignedIn = props.setIsSignedIn;
    const open = props.openSigninDialog;
    const setOpen = props.setOpenSigninDialog;
    // openSigninDialog={openSigninDialog} setOpenSigninDialog={setOpenSigninDialog}
    const [pwdResetHelp, setPwdResetHelp] = useState(false);
    // Listen to the Firebase Auth state and set the local state.
    useEffect(() => {
      const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
        setIsSignedIn(!!user);
        setOpen(false);
        if(user){
          props.db.collection(`UserList/${user.uid}/favouritesList`).get().then(function(querySnapshot) {
            const newList = []
            querySnapshot.forEach(doc => {
              newList.push(doc.data())
            });
            props.setFavList(newList)
          })
        }else{
          props.setFavList([]);
        }
      });
      return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
    }, []);

    const signinDialog = (
      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Signin/Signup</DialogTitle>
        <DialogContent>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
          <Button color="primary" size="small"
            onClick={() => setPwdResetHelp(true)}
          >How to reset email password</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={(e) => {setOpen(false)}} color="primary">
                Cancel
          </Button>
        </DialogActions>
      </Dialog>
    )

    const pwdResetHelpDialog = (
      <Dialog open={pwdResetHelp} onClose={() => setPwdResetHelp(false)} aria-labelledby="form-dialog-title" fullWidth={true} maxWidth={'md'}>
        <DialogTitle id="form-dialog-title">Signin/Signup</DialogTitle>
        <DialogContent>
          <img src="/how_to_reset_password.png" alt="password reset help image"/>
        </DialogContent>
        <DialogActions>
          <Button onClick={(e) => {setPwdResetHelp(false)}} color="primary">
                Close
          </Button>
        </DialogActions>
      </Dialog>
    )

    if (!isSignedIn) {
      return (
        <div>
          {signinDialog}
          {pwdResetHelpDialog}
          {/* <Button variant="outlined" onClick={() => setOpen(true)}>Sign in/up</Button> */}
        </div>
      );
    }
    return (
      <div>
        {/* <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p> */}
        {/* <Button variant="outlined" onClick={() => firebase.auth().signOut()}>Sign-out</Button> */}
      </div>
    );
}

export default Auth;