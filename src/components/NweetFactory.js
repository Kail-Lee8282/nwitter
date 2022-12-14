import React from "react";
import { dbService, storageService } from "../fBase"
import { collection, addDoc} from "firebase/firestore";
import {ref, uploadString, getDownloadURL} from"firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const COL_NAME_NWEETS = "nweets";

const NweetFactory = ({userObj}) =>{
    
  const [nweet, setNweet] = React.useState("");
  const [attachment, setAttachment] = React.useState("");
  const inputUploadRef = React.useRef();

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = null;
    
    if (attachment !== "" && attachment !== undefined) {
      // file upload - firestorage
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentUrl = await getDownloadURL(response.ref);
    }

    const addNweet = {
      text:nweet,
      createAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl
    }
    
    // data upload - cloud firestore
      const docRef = await addDoc(collection(dbService, COL_NAME_NWEETS), addNweet);

      // console.log("Document written with id:", docRef.id);
      setNweet("");
      setAttachment("");
      inputUploadRef.current.value = "";
  };

  
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  
  const onFileChange = (event) =>{
    const {target:{files}} = event;
    const theFile = files[0];

    const reader = new FileReader();
    reader.onloadend = (finishedEvent) =>{
      const {currentTarget:{result}} = finishedEvent;
      setAttachment(result);
    }
    reader.readAsDataURL(theFile);

  }

  const onClearAttachment =()=>{
    setAttachment("");
    inputUploadRef.current.value = "";
  }

    return(
      <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label for="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        ref={inputUploadRef}
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />
      {attachment && (
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            style={{
              backgroundImage: attachment,
            }}
            alt="img"
          />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
    );
}

export default NweetFactory;