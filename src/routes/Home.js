import React, { useEffect, useState } from "react";
import { dbService } from "../fBase";
import { collection, onSnapshot } from "firebase/firestore";
import Nweet from "../components/Nweet";
import NweetFactory from "../components/NweetFactory";

const COL_NAME_NWEETS = "nweets";

function Home({userObj}) {
  const [nweets, setNweets] = useState([]);

//   const getNweets = async () => {
//     const dbNweets = await getDocs(collection(dbService, COL_NAME_NWEETS));
//     dbNweets.forEach((doc) => {
//       //console.log(`${doc.id} => ${doc.data()}`);
//       const nweetObj = {
//         ...doc.data(),
//         id: doc.id,
//       };
//       setNweets((prev) => [nweetObj, ...prev]);
//     });
//   };


  useEffect(() => {
    setNweets([]);
    //getNweets();
    const unsub = onSnapshot(collection(dbService, COL_NAME_NWEETS), (snapshot) =>{
        const nweetArr = snapshot.docs.map(doc=>({
            id:doc.id, ...doc.data(),
        }))

        setNweets(nweetArr);
    });
  }, []);

  


  return (
    <div className="container">
      <NweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
}
export default Home;
;