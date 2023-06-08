import React from "react";
import { useSelector } from "react-redux";

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { selectTags } from "../store/tagsSlice";

import "./styles.css";


export default function Tag() { 
    const tags = useSelector(selectTags);
    const tagOptions = Object.keys(tags).map(tag => ({label: tag}))
    return (
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={tagOptions}
            renderInput={(params) => <TextField {...params} label="tag" />}
            autoHighlight={true}
            className="tag-input"
            size="small"
            onKeyDown={()=>{console.log("---1---")}}
        />
    )
}
