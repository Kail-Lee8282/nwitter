import { getAuth, updateProfile } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useHref, useNavigate } from "react-router-dom";
import {collection, getDocs, query, where, orderBy} from "firebase/firestore";
import {dbService, authService} from "../fBase";

function Profile({refreshUser, userObj}){ 

    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    let navigate = useNavigate();

    const auth = getAuth();
    const onLogOutClick=()=>{
        auth.signOut().then(()=>{
            // logout success
            navigate("/");
        }).catch((err)=>{
            console.log("logout err", err.message);
        });
        
    }

    const getMyNweets = async () => {
      const nweets = await getDocs(
        query(
          collection(dbService, "nweets"),
          where("creatorId", "==", userObj.uid),
          orderBy("createAt","asc")
        )
      );
      nweets.forEach((doc) => {
        console.log(doc.data());
      });
    };

    useEffect(()=>{
        getMyNweets();
    },[]);

    const onSubmit = async(event)=>{
        event.preventDefault();
        if(userObj.displayName !== newDisplayName){
            await updateProfile(authService.currentUser, {displayName:newDisplayName});
            refreshUser();
        }
    }
    const onChange =(event) =>{
        const {target:{value}} = event;
        setNewDisplayName(value);
    }

    return (
        <div className="container">
        <form onSubmit={onSubmit} className="profileForm">
          <input
            onChange={onChange}
            type="text"
            autoFocus
            placeholder="Display name"
            value={newDisplayName}
            className="formInput"
          />
          <input
            type="submit"
            value="Update Profile"
            className="formBtn"
            style={{
              marginTop: 10,
            }}
          />
        </form>
        <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
          Log Out
        </span>
      </div>
        
    );
}
export default Profile;