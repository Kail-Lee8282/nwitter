import { HashRouter, Route, Routes } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Navigation from "./Navigation";

const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
  return (
    <HashRouter basename={process.env.PUBLIC_URL}>
      {isLoggedIn && <Navigation userObj={userObj} />}
      <div
          style={{
            maxWidth: 890,
            width: "100%",
            margin: "0 auto",
            marginTop: 80,
            display: "flex",
            justifyContent: "center",
          }}
        >
      <Routes>
          {isLoggedIn ? (
            <Route exact path="/" element={<Home userObj={userObj} />} />
          ) : (
            <Route exact path="/" element={<Auth></Auth>} />
          )}
          <Route
            path="/profile"
            element={<Profile refreshUser={refreshUser} userObj={userObj} />}
          />
      </Routes>
      </div>
    </HashRouter>
  );
};

export default AppRouter;
