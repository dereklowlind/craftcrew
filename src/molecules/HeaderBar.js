import Auth from './Auth'
import {makeStyles} from '@material-ui/core/styles'
import TopSearchBar from './TopSearchBar'
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    headerContainer: {
        display: 'flex',
        justifyContent: 'center'
    },
    authContainer: {
        marginTop: '16px',
        marginLeft: '10px',
        marginRight: '10px'
    },
    title: {
        fontFamily: 'Rubik',
        fontWeight: 700,
        fontSize: '36px',
        color: 'blue',
        textDecoration: 'none',
    },
    titleContainer: {
        marginRight: '40px',
        marginTop: '20px',
        textAlign: 'left',
    }
}))

function HeaderBar(props) {
    const classes = useStyles();

    return(
    <div className={classes.headerContainer}>
        <div className={classes.titleContainer}>
            <Link to="/" className={classes.title}>
                Social beer
            </Link>
        </div>
        <TopSearchBar courseList={props.lists} triggerRender={props.triggerRender}/>
        {/* <div className={classes.authContainer}>
            <Auth db={props.db} setFavList={props.setFavList} 
                isSignedIn={props.isSignedIn} setIsSignedIn={props.setIsSignedIn}
                openSigninDialog={props.openSigninDialog} setOpenSigninDialog={props.setOpenSigninDialog}
            />
        </div> */}
    </div>
    )
}

export default HeaderBar;