import React, {useEffect, useState} from 'react'
import {Grid, TextField} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import '../css/search.scss'

const useStyles = makeStyles((theme) => ({
    searchTextArea: {
        width: '750px'
    },
    searchTextAreaMobile: {
        width: '100%',
    },
    textAreaFont: {
        fontSize: '24pt',
        fontFamily: "'Rubik'",
        fontWeight: 600
    },
    textAreaFontMobile: {
        fontSize: '16pt',
        fontFamily: "'Rubik'",
        fontWeight: 600,
        marginTop: '10px'
    }
    
}))
function DrinkSearch(props) {

    const [searchTerm, setSearchTerm] = useState("")
    const [isMobile, setMobile] = useState(window.innerWidth < 800)

    const classes = useStyles()

    useEffect(() => {
        function handleResize() {
            setMobile(window.innerWidth < 800)
        }
        window.addEventListener('resize', handleResize)
    }, [])
    
    const updateSearch = (event) => {
        setSearchTerm(event.target.value)
    }

    // var regex = new RegExp('^' + searchTerm.toLowerCase().split(" ").join(""))
    var regex = new RegExp(searchTerm.toLowerCase().split(" ").join(""))

    var filteredResults = []

    const maxResults = (isMobile ? 10 : 9)

    for(var i=0; i < props.lists.length; i++) {
        var lower = (props.lists[i].title + props.lists[i].subtitle).toLowerCase().split(" ").join("")
        // console.log(lower);
        const foundLower = regex.test(lower)
        if(foundLower) {
            filteredResults.push([props.lists[i].docId, props.lists[i].title, props.lists[i].subtitle])
        }

        if(filteredResults.length === maxResults) {
            break
        }
    }

    filteredResults.sort(function(a, b){
        return (a[1] < b[1]) ? -1 : 1
    })

    const rowFraction = (isMobile ? 12 : 4)

    const courseClick = (index) => {
        console.log(index)
    }

    var displayResults = filteredResults.map((result, index) => {
        return (
            <Grid item xs={rowFraction} key={index}>
                <Link to={'/drink/' + result[0]} style={{ textDecoration: 'none' }}>
                    <div className="searchResult" onClick={()=>courseClick(index)}>
                        <div className="searchText">
                            <div className="searchTerm">
                                {result[1]}
                            </div>
                            <div className="searchDescription">
                                {result[2]}
                            </div>
                        </div>    
                    </div>
                </Link>
            </Grid>
        )
    })
    
    var isEmpty = filteredResults.length === 0
    
    var sizeText = isMobile ? classes.textAreaFontMobile : classes.textAreaFont

    return (
        <div className="searchCourseContainer">
            <div className="searchBoxContainer">
                <TextField 
                    className={isMobile ? classes.searchTextAreaMobile : classes.searchTextArea} 
                    InputProps={{
                        classes: {
                          input: sizeText
                        }
                    }}
                    onChange={updateSearch} 
                    placeholder="Search for drinks..." type='text'/>
            </div>
            <div className="searchResultContainer">
                {isEmpty ? 
                    (
                        <div>no results! :(</div>
                    ) 
                    : 
                    (
                        <Grid container spacing={3}>
                            {displayResults}
                        </Grid>
                    )
                }
                 
            </div>
        </div>
    )
}

export default DrinkSearch