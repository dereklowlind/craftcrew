import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import 'firebase/firestore';
import {Button, TextField, Tooltip} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import Rating from '@material-ui/lab/Rating';
import ReviewList from '../molecules/ReviewList'
import BookmarkIcon from '@material-ui/icons/Bookmark'
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import CircularProgress from '@material-ui/core/CircularProgress';
import {useAuthState} from 'react-firebase-hooks/auth'
import {Link} from 'react-router-dom'
import '../css/drinkpage.scss'


const useStyles = makeStyles((theme) => ({
  reviewTitleTextArea: {
    width: '400px',
    [theme.breakpoints.down('sm')]: {width: '80%'}
  },
  textTitleAreaFont: {
    fontSize: '16pt',
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 600
  },
  reviewDescTextArea: {
    width: '400px',
    [theme.breakpoints.down('sm')]: {width: '80%'}
  },
  textDescAreaFont: {
    fontSize: '12pt',
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 400
  },
  favStarIcon: {
    marginLeft: '5px',
    marginBottom:'-7px',
    color: '#ff6d75',
  },
  favButton: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 600,
    color: 'gray'

  }
}))

function newReview(db, title, desc, docId, numReview, user, reviewStars){
  console.log(numReview)
    db.collection(`Drinks/${docId}/reviews`).add({
      datetime: new Date(),
      title: title,
      desc: desc,
      position: numReview,
      creatorId: user.uid,
      creatorName: user.displayName,
      reviewStars: reviewStars
    })
    .then(function() {
      console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  }

  
function addToFavList(db, drinkId, drinkBrand, drinkName, props){

  db.collection(`UserList`).doc(firebase.auth().currentUser.uid).collection('favouritesList').add({
    drinkId: props.id,
    brand: drinkBrand,
    name: drinkName,
    datetime: new Date()
  })
  .then(function() {
    const newList = [...props.favList]
    const insert = {
      datetime: new Date(),
      drinkId: drinkId,
      brand: drinkBrand,
      name: drinkName,
    }
    newList.push(insert)
    props.setFavList(newList)
    console.log("Document successfully written!");
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
  });
}

function removeFromFavList(db, props) {

  //delete from db, needs error handling
  var deleteDrinkQuery = db.collection(`UserList/${firebase.auth().currentUser.uid}/favouritesList`).where('drinkId', '==', props.id)
  
  deleteDrinkQuery.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      doc.ref.delete()
    })
  })

  //delete locally without having to reload the page
  var newList = [...props.favList]
  newList = newList.filter(element => element.drinkId!==props.id)
  props.setFavList(newList)

}

// function sortDate(list) {
//   list.sort(function(a,b) {
//     return new Date(a.timeStamp) - new Date(b.timeStamp)
//   })
//   return list
// }

function sortField(list) {
  list.sort(function(a,b) {
    return b.position - a.position
  })
  return list
}

// function updatePositions(db, rows, id) {

//   db.collection("Drinks").doc(id).set({
//     useForcedOrder: true
//   }, {merge: true})

//   for(var i = 0; i < rows.length; i++) {
//     console.log(rows[i].docId)
//     console.log(rows[i].title)
//     db.collection("Drinks").doc(id).collection("reviews").doc(rows[i].docId).set({
//       position: i
//     }, {merge: true}).catch(function(error) {
//       console.log("Error setting new positions.")
//     })
//   }
// }

function autoSave(db, reviews, id) {
  db.collection("Drinks").doc(id).set({
    useForcedOrder: true
  }, {merge: true})

  for(var i = 0; i < reviews.length; i++) {
    console.log(reviews[i].docId)
    console.log(reviews[i].title)
    db.collection("Drinks").doc(id).collection("reviews").doc(reviews[i].docId).set({
      position: (reviews.length - i - 1)
    }, {merge: true}).catch(function(error) {
      console.log("Error setting new positions.")
    })
  }
}

function DrinkPage(props){
    const db = props.db;
    const [photoUrl, setPhotoUrl] = useState("");
    const [drinkBrand, setDrinkBrand] = useState("")
    const [drinkName, setDrinkName] = useState("")
    const [pageLoading, setLoading] = useState(true)
    const [reviews, setReviews] = useState([]);
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewDesc, setReviewDesc] = useState("");
    const [updated, setUpdated] = useState(false)
    const [maxError, setMaxError] = useState(false)
    const [favorite, setFavorite] = useState(false)
    const [courseOwner, setCourseOwner] = useState("")
    const [user, loading, error] = useAuthState(firebase.auth())
    const [forceOrder, setForceOrder] = (useState(false))
    const [docError, setDocError] = useState("none")
    const [reviewStars, setReviewStars] = useState(null);
    const classes = useStyles()

    useEffect(() => {
      console.log("saving!")
      autoSave(props.db, reviews, props.id)
    }, [updated])

    useEffect(() => {
      if (!favorite) {
        if (props.favList.length > 0) {
          for(var i = 0; i < props.favList.length; i++) {
            if (props.favList[i].drinkId === props.id) {
              setFavorite(true)
              break
            }
          }
        }
      }
    }, [props.favList])

    useEffect(() => {      
      db.collection('Drinks').doc(props.id).get().then(function(doc) {
        const docData = doc.data()
        if (docData.brand == undefined) {
          setDocError("notFound")
        }
        if(docData.photoUrl) {
          setPhotoUrl(docData.photoUrl)
        }
        setDrinkBrand(docData.brand)
        setCourseOwner(docData.creatorId)
        if(docData.name) {
          setDrinkName(docData.name)
        }

        console.log(docData.useForcedOrder)
        var localForceOrdering = (docData.useForcedOrder!==undefined) ? true : false

        if (localForceOrdering===true) {
          localForceOrdering = (docData.useForcedOrder) ? true : false
          setForceOrder(localForceOrdering)
        }
        
        if(docError=="none") {
          db.collection(`Drinks/${props.id}/reviews`).onSnapshot((dataEntries) => {
            let rows = []
            dataEntries.forEach(doc => {
              const timeStamp = doc.data().datetime.toDate().toString()
              rows.push({
                docId: doc.id,
                timeStamp: timeStamp,
                title: doc.data().title,
                desc: doc.data().desc,
                resources: doc.data().resources,
                position: doc.data().position,
                creatorID: doc.data().creatorId,
                creatorName: doc.data().creatorName,
                reviewStars: doc.data().reviewStars
              })
            }); // data entries for each
            if(rows.length > 1) {
                rows = sortField(rows)
            }
            
            setReviews(rows);
            setLoading(false);
          });
        }
      }).catch(function(error){
        console.log(error)
        setDocError("notFound")
        setLoading(false)
      })
       // db collect reviews
    }, [props.id]); // when id in link /courses/:id changes it causes a "reload" of the page

    const getContent = (id) => {
      console.log(id)
    }

    const handleCourseDelete = () => {
      const proceed = openConfirmation();
      if(proceed) {
        setLoading(true)
        removeFromFavList(db, props)
        // db.collection('Drinks').doc(props.id).collection('reviews').get().then(function(querySnapshot) {
        db.collection(`Drinks/${props.id}/reviews`).get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            doc.ref.delete()
          })
        })
        db.collection('Drinks').doc(props.id).delete().then(function(){
        // db.collection(`Drinks/${props.id}`).delete().then(function(){
          console.log("Delete success.")
          setDocError("deleted")
          setLoading(false)
        }).catch(function(error) {
          console.warn(error)
        })
      }
    }

    const deleteReview = (id) => {
      
      const newList = reviews.filter((element) => {
        return element.id != id
      })
      setReviews(newList)

      // db.collection('Drinks').doc(props.id).collection('reviews').doc(id).delete()
      db.collection(`Drinks/${props.id}/reviews`).doc(id).delete()

    }

    const handleSubmit = e => {
      e.preventDefault();

      if (!props.isSignedIn) {
        props.setOpenSigninDialog(true)
        return
      }

      if (reviewTitle === "") {
        setMaxError(true)
        return
      }
      newReview(db, reviewTitle, reviewDesc, props.id, reviews.length, user, reviewStars);
      setReviewTitle("");
      setReviewDesc("");
      setReviewStars(null);
      setMaxError(false)
    }

    const reorder = (list, startIndex, endIndex) => {
      console.log(list)
      const result = [...list]
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      console.log(result)
      result.forEach((element, index)=> {
        element.position = (result.length-index-1)
      })
      console.log(result)

      return result
    }

    const onDragEnd = (result) => {
      
      if (!result.destination) {
        return;
      }
  
      if (result.destination.index === result.source.index) {
        return;
      }
      setForceOrder(true)

      const rows = reorder(
        reviews,
        result.source.index,
        result.destination.index
      );

      setReviews(rows);
      setUpdated(!updated);
      //putting this function here breaks dnd, so maybe just let it end
      // updatePositions(props.db, rows, props.id)

    }

    const handleAddToFavList = () => {
      if(firebase.auth().currentUser){ // check if uid is null
        if(favorite) {
          alert("Already in favorites list!")
        } else {
          addToFavList(db, props.id, drinkBrand, drinkName, props)
        }
      }else{
        alert("please sign in to add to favourites")
      } 
    }

    const handleRemoveFromFavList = () => {
      if(firebase.auth().currentUser) {
        if (favorite) {
          removeFromFavList(db, props)
          setFavorite(false)
        } else {
          alert("this is not a favorite")
        }
      }
    }

    const openConfirmation = () =>{
      return window.confirm("Are you sure you want to delete this drink?")
    }

    if(docError=="notFound") {
      return (
        <div className="drinkPage">
          <div className="drinkHeader">
            <div className="drinkTitles">
              <div className="drinkTitle">
                {"404 Not Found"}
              </div>
              <div className="drinkSubtitle">
                {"We couldn't find what you were looking for, or it doesn't exist!"}
              </div>
            </div>
          </div>
        </div>
      )
    } else if (docError=="deleted") {
      return(
        <div className="drinkPage">
          <div className="drinkHeader">
            <div className="drinkTitles">
              <div className="drinkTitle">
                {"Resource deleted"}
              </div>
              <div className="drinkSubtitle">
                <Link to="/">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return(
      <div>
      {(pageLoading===true) ?
        (
          <div className="loadingPage">
            <CircularProgress/>
          </div>
        )
        :
        (
          <div className="drinkPage">
            
            <div className="drinkHeader">
              <div className="drinkTitles">
                <div className="drinkTitle">
                  {drinkBrand}
                </div>
                <div className="drinkSubtitle">
                  {drinkName}
                </div>
              </div>

              {firebase.auth().currentUser!=null && 
                ( !favorite ?
                  (<div className="favouriteIndicator" onClick={handleAddToFavList}>
                      <Tooltip title={<div style={{fontSize: "20px", padding: "5px"}}>Add to favourites</div>} 
                        placement="right" arrow
                      >
                        <BookmarkBorderIcon className={classes.favStarIcon} />
                      </Tooltip>
                  </div>)
                  :
                  (
                    <div className="favouriteIndicator" onClick={handleRemoveFromFavList}>
                      <Tooltip title={<div style={{fontSize: "20px", padding: "5px"}}>Remove from favourites</div>} 
                        placement="right" arrow
                      >
                        <BookmarkIcon className={classes.favStarIcon}/>
                      </Tooltip>
                    </div>
                  )
                )
              }
              
            </div>
            <img src={photoUrl} />
          <div className="drinkButtons">
            <form onSubmit={handleSubmit} className="drinkButtons">
            <Rating name="review stars" value={reviewStars} onChange={(event, value) => { setReviewStars(value)}}  />
              <TextField 
                placeholder="Review Title" 
                error={maxError}
                className={classes.reviewTitleTextArea} 
                value={reviewTitle} 
                InputProps={{
                  classes: {
                    input: classes.textTitleAreaFont
                  }
                }}
                onChange={(e) => {
                  if(e.target.value.length > 30) {
                    setMaxError(true)
                  } else if (maxError) {
                    setMaxError(false)
                    setReviewTitle(e.target.value)
                  } else {
                    setReviewTitle(e.target.value)
                  }
                }}/>
                <TextField 
                placeholder="Review Description" 
                error={maxError}
                className={classes.reviewDescTextArea} 
                value={reviewDesc} 
                InputProps={{
                  classes: {
                    input: classes.textDescAreaFont
                  }
                }}
                onChange={(e) => {
                  if(e.target.value.length > 30) {
                    setMaxError(true)
                  } else if (maxError) {
                    setMaxError(false)
                    setReviewDesc(e.target.value)
                  } else {
                    setReviewDesc(e.target.value)
                  }
                }}/>
              <Button variant="outlined" type='submit'
                // style={{marginLeft: '2px'}}
              >Add Review</Button>
              {user &&
              <div>
                {(user.uid === courseOwner) &&
                <Button variant="outlined" color="secondary" onClick={handleCourseDelete}>
                  Delete Drink Entry
                </Button>
                }
              </div>
              }
            </form>
          </div>

          <ReviewList 
            db={db} 
            reviews={reviews} 
            isSignedIn={props.isSignedIn}
            setOpenSigninDialog={props.setOpenSigninDialog}
            deleteReview={deleteReview}
            docId={props.id} 
            // switchTopic={getContent}
            onDragEnd={onDragEnd}
          />
        </div>
        )
      }
      </div>    
    )
}


export default DrinkPage
