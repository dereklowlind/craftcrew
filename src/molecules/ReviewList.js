import React, {useState} from 'react'
import { 
    Accordion, AccordionSummary, AccordionDetails, Button, TextField,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@material-ui/core'
import firebase from 'firebase'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import {makeStyles} from '@material-ui/core/styles'
import Rating from '@material-ui/lab/Rating';
import { Link } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { useAuthState } from 'react-firebase-hooks/auth'

const useStyles = makeStyles((theme) => ({
    accordion: {
        marginLeft: '50px',
        marginRight: '50px',
        marginTop: '30px',
        fontFamily: "'Rubik'",
    },
    accordianTitle: {
        fontWeight: 600,
        fontSize: 32,
        marginTop: '30px',
        position: 'relative'
    },
    expanded:{
        marginTop:'30px'
    },
    details:{
        display: "block",
        textAlign: "left"
    },
    reviewContainer: {
        // display: "flex",
        marginTop: '10px',
        borderTop: '1px solid #B9B9B9',
        // justifyContent: "flex-start",
        textAlign: "left",
        // borderRadius: '8px',
        padding:'17px',
        fontColor: '#696969',
    },
    reviewTitle:{
        fontFamily: 'Circular Std',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '25px'
    },
    reviewDesc:{
        fontFamily: 'Arial',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '20px'
    },
    deleteButton: {
        position:  'absolute',
        right: '50px'
    }
}))

function ReviewList(props){  
    // const [open, setOpen] = useState(false); 
    const [user, loading, error] = useAuthState(firebase.auth())
    const classes = useStyles()
    
    const handleReviewDelete = (id, title) => {
        const proceed = window.confirm("Delete your review: " + title + "?")
        if(proceed) {
            props.deleteReview(id)
        } else {
            console.log("cancelled")
        }
    }
    
    const onDragEnd = (result) => {
        props.onDragEnd(result)
    }

    
    // console.log("in showreviewtable", props.reviews);
    if(props.reviews === []){
        return <div>No reviews found</div>
    }

    function Review({review, index}) {
        let userUid;
        if(user !== null){
            userUid = user.uid;
        }else{
            userUid = "not signed in"
        }

        return(
            <Draggable draggableId={review.docId} index={index} isDragDisabled={!props.isSignedIn}>
                {provided => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={classes.reviewContainer}>
                                {/* <DragIndicatorIcon fontSize="inherit" style={{colour: "#E5E5E5"}}/> */}
                                <div>{review.creatorName.split(" ")[0]}</div>
                                <Rating name="review stars" value={review.reviewStars} readOnly  />
                                <div className={classes.reviewTitle}>{review.title}</div>
                                <div className={classes.reviewDesc}>{review.desc}</div>
                                <div>
                                    {review.creatorID == userUid &&
                                        <Button variant='outlined'color='secondary' className={classes.deleteButton} onClick={() => {handleReviewDelete(review.docId, review.title)}}>
                                            Delete
                                        </Button> 
                                    }
                                </div>
                                
                    </div>
                )}
            </Draggable>
        )
    }

    const accordianList = props.reviews.map((review, index) => (
        <Review review={review} key={index} index={index}/>
    ))
    
    return(
        <div>
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="ReviewList">
                {provided => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        {accordianList}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
        </div>

    )

}
export default ReviewList