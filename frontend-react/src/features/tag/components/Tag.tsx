import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ClearIcon from '@mui/icons-material/Clear';

import { AppDispatch } from "store";
import { uuid } from "lib";

import { selectTags, addTag, deleteTag } from "../store/tagsSlice";

import "./styles.css";


const uid = uuid();

type TagProps = {
    onTagChange: (tag: string) => void,
    value: string,
}

export default function Tag(props: TagProps) {
    const dispatch: AppDispatch = useDispatch();
    const inputValue = props.value;
    const inputValueRef = useRef<string>(inputValue);
    inputValueRef.current = inputValue;
    const tags = useSelector(selectTags);
    const tagOptions = Object.keys(tags).map(tag => ({ label: tag }));

    function handleNewLabel() {
        dispatch(addTag(inputValueRef.current));
    }

    function handleDeleteTag(tagString: string) {
        dispatch(deleteTag(tagString));
    }

    function handleInputChange(
        event: React.SyntheticEvent<Element, Event>,
        newInputValue: string
    )  {
        if (newInputValue !== uid) {
            props.onTagChange(newInputValue);
        }
    }

    function handleChange(
        event: React.SyntheticEvent<Element, Event>,
        newValue: { label: string } | string | null
    ) {
        if (newValue === null) {
            return
        }
        let value: string;
        if (typeof newValue === "string") {
            value = newValue
        } else {
            value = newValue.label;
        }
        if (value === uid) {
            handleNewLabel()
            value = inputValueRef.current;
        }
        value = value.trim();
        props.onTagChange(value);
    }

    function customFilter(
        options: { label: string }[],
        { inputValue }: { inputValue: string }
    ) {
        inputValue = inputValue.trim().toLowerCase();
        let exists = false;
        const filtered = options.filter(option => {
            if (option.label.toLowerCase() === inputValue) {
                exists = true;
                return true;
            }
            return option.label.toLowerCase().includes(inputValue)
        });
        if (exists === false) {
            filtered.push({label: uid})
        }
        return filtered.length === 0 ?
            [{ label: uid }] :
            filtered
    }

    function renderOption(
        props: React.HTMLAttributes<HTMLLIElement>,
        option: { label: string }
    ) {
        if (option.label === uid) {
            return (inputValue !== "" ?
                <li {...props} onClick={handleNewLabel}>
                    + new tag
                </li> :
                <li {...props} className="tag-no-labels">
                    <p>No tags</p>
                </li>

            );
        }
        return (
            <li {...props}>
                <p className="tag-option">
                    {option.label}
                </p>
                <ClearIcon
                    onClick={(e) => {
                        handleDeleteTag(option.label);
                        e.stopPropagation();
                    }}
                />
            </li>
        );
    }

    return (
        <div className="tag-container">
            <Autocomplete
                className="tag-input"
                size="small"
                disablePortal
                autoHighlight={true}
                freeSolo={true}
                selectOnFocus={true}
                options={tagOptions}
                inputValue={inputValue}
                onInputChange={handleInputChange}
                onChange={handleChange}
                renderInput={(params) => (
                    <TextField {...params} label="tag" placeholder="work/project/report"/>
                )}
                renderOption={renderOption}
                filterOptions={customFilter}
                isOptionEqualToValue={
                    (option, value) => {
                        if (value.label === uid) {
                            return true
                        }
                        return option.label === value.label
                    }
                }
            />
        </div>
    )
}
