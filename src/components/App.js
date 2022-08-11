import { useState,useEffect } from "react";
import AppRouter from "./AppRouter";
import { authService} from "../fBase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(()=>{
    
    // 로그인 상태 변경 이벤트
    onAuthStateChanged(authService, (user) => {
      if(user){
        setIsLoggedIn(true);
        setUserObj(user);
        // setUserObj({
        //   displayName:user.displayName,
        //   uid:user.uid,
        // });
      }else{
        setIsLoggedIn(false);
        setUserObj(null);
      }
      setInit(true);
    });
  },[]);

  const refreshUser = () =>{
    
    const user = authService.currentUser;
    console.log(user.displayName);
    // setUserObj({
    //   displayName:user.displayName,
    //   uid:user.uid,
    // });

    setUserObj(Object.assign({}, user));
  }
  return (
    <div>
      {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={/*isLoggedIn*/Boolean(userObj)} userObj={userObj} /> : "Initializing"}
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </div>
  );
}

export default App;
