import React, { useState } from "react";
import { dbService, storageService } from "../fBase";
import { deleteDoc, updateDoc, doc } from "firebase/firestore";
import {ref, deleteObject } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const COL_NAME_NWEETS = "nweets";

function Nweet({ nweetObj, isOwner }) {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      // Delete Doc
      await deleteDoc(doc(dbService, COL_NAME_NWEETS, nweetObj.id));
      await deleteObject(ref(storageService, nweetObj.attachmentUrl));

    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit= async(event)=>{
    event.preventDefault();
    await updateDoc(doc(dbService,COL_NAME_NWEETS, nweetObj.id),{
        text:newNweet,
    })
    setEditing(false);

  }
  const onChange=(event)=>{
    const {target:{value}} = event;
    setNewNweet(value);
  }
  return (
    <div className="nweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
            <input
              type="text"
              placeholder="Edit your nweet"
              value={newNweet}
              required
              autoFocus
              onChange={onChange}
              className="formInput"
            />
            <input type="submit" value="Update Nweet" className="formBtn" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} alt="img"/>}
          {isOwner && (
            <div class="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Nweet;
