import React from 'react'
import {Table, TableBody, TableCell,TableContainer, TableRow, Paper } from '@material-ui/core'
import { Link } from 'react-router-dom'
function MainPageTable(props){
    if(props.lists === []){
        return <div></div>
    }
    return(
        <div>
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
            <TableBody>
            {props.lists.map((list) => (
            <TableRow key={list.docId} >
                <TableCell align="left">
                <Link to={`/list/${list.docId}/`}>
                {list.title}
                </Link>
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
            </Table>
        </TableContainer>
        </div>
    )
}
export default MainPageTable