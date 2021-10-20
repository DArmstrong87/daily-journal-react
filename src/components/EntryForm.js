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
        const newEntry = Object.assign({}, updatedEntry)
        if (newEntry.tags) {
            if (newEntry.tags.includes(parseInt(event.target.value))) {
                const index = newEntry.tags.indexOf(parseInt(event.target.value))
                newEntry.tags.splice(index, 1)
            }
            else {
                newEntry.tags.push(parseInt(event.target.value))
            }
        }
        else {
            newEntry.tags = []
            newEntry.tags.push(parseInt(event.target.value))
        }
        newEntry.tags.sort()
        setUpdatedEntry(newEntry)

    }


    const constructNewEntry = () => {
        const copyEntry = { ...updatedEntry }
        // copyEntry.mood_id = parseInt(copyEntry.moodId)
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
