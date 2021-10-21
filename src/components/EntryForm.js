import React, { useState, useEffect } from "react"

export const EntryForm = ({ entry, moods, onFormSubmit, tags }) => {
    const [editMode, setEditMode] = useState(false)
    const [updatedEntry, setUpdatedEntry] = useState(entry)

    useEffect(() => {
        setUpdatedEntry(entry)
        if ('id' in entry) {
            setEditMode(true)
        }
        else {
            setEditMode(false)
        }
    }, [entry])

    const handleControlledInputChange = (event) => {
        /*
            When changing a state object or array, always create a new one
            and change state instead of modifying current one
        */
        const newEntry = Object.assign({}, updatedEntry)
        newEntry[event.target.name] = event.target.value
        setUpdatedEntry(newEntry)
    }

    console.log(updatedEntry)
    const handleCheckboxes = (event) => {
        console.log('edit mode', editMode)
        let newEntry = {}
        let value = parseInt(event.target.value)
        if (editMode) { // Edit mode = true
            newEntry = { ...updatedEntry }
            let tags = newEntry.tags
            const foundTag = () => newEntry.tags.find(tag => tag.id === value || tag === value)
            if (foundTag()) { // If the array contains the tag id in an object or as an integer.
                const index = tags.indexOf(foundTag())
                tags.splice(index, 1)
                console.log('Found tag id, deleting from current array')
            } else { // The tag id is not in the array
                tags.push(value)
                console.log('Adding new tag id')
            }
            newEntry.tags?.sort()
        } else { // Edit mode = false
            newEntry = Object.assign({}, updatedEntry)
            if (newEntry.tags) { // If tags property exists.
                if (newEntry.tags.includes(value)) {
                    const index = newEntry.tags.indexOf(value)
                    newEntry.tags.splice(index, 1)
                }
                else {
                    newEntry.tags.push(value)
                }
            }
            else { // If tags property doesn't exist, create one.
                newEntry.tags = []
                newEntry.tags.push(value)
            }
            newEntry.tags?.sort()
        }

        setUpdatedEntry(newEntry)
    }


    const constructNewEntry = () => {
        const copyEntry = { ...updatedEntry }
        if (!copyEntry.date) {
            copyEntry.date = Date(Date.now()).toLocaleString('en-us').split('GMT')[0]
        }
        onFormSubmit(copyEntry)
    }

    return (
        <article className="panel is-info">
            <h2 className="panel-heading">{editMode ? "Update Entry" : "Create Entry"}</h2>
            <div className="panel-block">
                <form style={{ width: "100%" }}>
                    <div className="field">
                        <label htmlFor="concept" className="label">Concept: </label>
                        <div className="control">
                            <input type="text" name="concept" required autoFocus className="input"
                                proptype="varchar"
                                placeholder="Concept"
                                value={updatedEntry.concept}
                                onChange={handleControlledInputChange}
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="entry" className="label">Entry: </label>
                        <div className="control">
                            <textarea
                                class="textarea"
                                name="entry"
                                value={updatedEntry.entry}
                                onChange={handleControlledInputChange}
                            ></textarea>
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="moodId" className="label">Mood: </label>
                        <div className="control">
                            <div className="select">
                                <select name="mood_id"
                                    proptype="int"
                                    value={updatedEntry.mood_id}
                                    onChange={handleControlledInputChange}>

                                    <option value="0">Select a mood</option>
                                    {moods.map(m => (
                                        <option key={m.id} value={parseInt(m.id)}>
                                            {m.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="tags" className="label">Tags: </label>
                        <div className="control">
                            {tags.map(tag => {
                                return <>
                                    <input type="checkbox" name="tags"
                                        value={tag.id}
                                        checked={
                                            editMode && updatedEntry.tags?.some(currTag => tag.id === currTag.id
                                                || tag.id === currTag)
                                                ? true :
                                                !editMode && updatedEntry.tags?.some(currTag => tag.id === currTag) ? true : false}
                                        onChange={handleCheckboxes} /> {tag.name}
                                </>
                            })}
                        </div>
                    </div>
                    <div className="field">
                        <div className="control">
                            <button type="submit"
                                onClick={evt => {
                                    evt.preventDefault()
                                    constructNewEntry()
                                }}
                                className="button is-link">
                                {editMode ? "Update" : "Save"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </article>
    )
}