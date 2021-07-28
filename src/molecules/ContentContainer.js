import React from 'react'
import {makeStyles, useTheme} from '@material-ui/core/styles'
const useStyles = makeStyles((theme) => ({
    contentModule :{
        border: '1px solid #B9B9B9',
        borderRadius: '8px',
        padding: '16px',
        
      }
    
  }));
function ContentContainer(props){
    const classes = useStyles();
    return(
        <div style={{
          
            display: 'inline-block',
            border: '1px solid #B9B9B9',
            borderRadius: '8px',
            padding: '16px',}}>
            This is the topic content.
        </div>
    )
}
export default ContentContainer