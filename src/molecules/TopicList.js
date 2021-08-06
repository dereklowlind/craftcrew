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
import PreviewCard from './PreviewCard'
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
    resourceContainer: {
        // display: "flex",
        marginTop: '10px',
        borderTop: '1px solid #B9B9B9',
        // justifyContent: "flex-start",
        textAlign: "left",
        // borderRadius: '8px',
        padding:'17px',
        fontColor: '#696969',
    },
    resourceTitle:{
        fontFamily: 'Circular Std',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '25px'
    },
    resourceDesc:{
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

function TopicList(props){  
    const [open, setOpen] = useState(false); 
    const [resourceTitle, setResourceTitle] = useState("");
    const [resourceDesc, setResourceDesc] = useState("");
    const [resourceUrl, setResourceUrl] = useState(""); 
    const [resourceTopicId, setResourceTopicId] = useState("");
    const [user, loading, error] = useAuthState(firebase.auth())
    
    const classes = useStyles()

    const handleAddResource = () => {
        setOpen(false);
        props.newResource(props.db, props.docId, resourceTopicId, resourceTitle, resourceDesc, resourceUrl, user.uid, user.displayName);
        setResourceTitle("");
        setResourceDesc("");
        setResourceUrl("");
        setResourceTopicId("");
    }

    const handleDeleteResource = (resourceInfo, topicID) => {
        const proceed = window.confirm("Delete your resource: " + resourceInfo.title + "?")
        if(proceed) {
            props.deleteResource(resourceInfo, topicID)
        } else {
            console.log("cancelled")
        }    
    }
    
    const handleTopicDelete = (id, title) => {
        const proceed = window.confirm("Delete your topic: " + title + "?")
        if(proceed) {
            props.deleteTopic(id)
        } else {
            console.log("cancelled")
        }
    }
    
    const onDragEnd = (result) => {
        props.onDragEnd(result)
    }

    // const openInNewTab = (url) => {
    //     const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    //     if (newWindow) newWindow.opener = null
    //   }
    
    // console.log("in showtopictable", props.topics);
    if(props.topics === []){
        return <div>No topics found</div>
    }

    function Topic({topic, index}) {
        let userUid;
        if(user !== null){
            userUid = user.uid;
        }else{
            userUid = "not signed in"
        }

        return(
            <Draggable draggableId={topic.docId} index={index} isDragDisabled={!props.isSignedIn}>
                {provided => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={classes.resourceContainer}>
                                {/* <DragIndicatorIcon fontSize="inherit" style={{colour: "#E5E5E5"}}/> */}
                                <div>{topic.creatorName.split(" ")[0]}</div>
                                <Rating name="comment stars" value={topic.commentStars} readOnly  />
                                <div className={classes.resourceTitle}>{topic.title}</div>
                                <div className={classes.resourceDesc}>{topic.desc}</div>
                                <div>
                                    {topic.creatorID == userUid &&
                                        <Button variant='outlined'color='secondary' className={classes.deleteButton} onClick={() => {handleTopicDelete(topic.docId, topic.title)}}>
                                            Delete
                                        </Button> 
                                    }
                                </div>
                                
                    </div>
                )}
            </Draggable>
        )
    }

    const accordianList = props.topics.map((topic, index) => (
        <Topic topic={topic} key={index} index={index}/>
    ))
    
    return(
        <div>
        <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add Resource</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Please enter the new resource below
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="title"
                label="Title"
                fullWidth
                value={resourceTitle} onChange={(e) => setResourceTitle(e.target.value)}
            />
            <TextField
                margin="dense"
                id="description"
                label="Description"
                fullWidth
                value={resourceDesc} onChange={(e) => setResourceDesc(e.target.value)}
            />
            <TextField
                margin="dense"
                id="url"
                label="URL"
                type="url"
                fullWidth
                value={resourceUrl} onChange={(e) => setResourceUrl(e.target.value)}
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={(e) => {
                setOpen(false);
                setResourceTitle("");
                setResourceDesc("");
                setResourceUrl("");
                setResourceTopicId("");
            }} color="primary">
                Cancel
            </Button>
            <Button onClick={handleAddResource} color="primary">
                Add
            </Button>
            </DialogActions>
        </Dialog>
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="topiclist">
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
export default TopicList