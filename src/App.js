import React from "react";
import Signup from "./Signup";
import NotFound from "./NotFound";
import Main from "./Main";
import Login from "./Login";
import Add from "./Add";
import Notification from "./Notification";
import PleaseLogin from "./PleaseLogin";
import Detail from "./Detail";
import { Routes, Route, Link } from "react-router-dom";
import { auth } from "./shared/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { loadPostFB } from "./redux/modules/post";
import styled from "styled-components";
import { AiFillHome, AiFillBell, AiOutlineExport } from "react-icons/ai";
import { BiPlus, BiChevronUp } from "react-icons/bi";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();

  const [is_login, setIsLogin] = React.useState(false);

  const loginCheck = async (user) => {
    if (user) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  };

  React.useEffect(() => {
    onAuthStateChanged(auth, loginCheck);
    dispatch(loadPostFB());
  }, []);

  console.log(auth.currentUser);
  return (
    <div className="App">
      <div>
        <Link
          to="/"
          style={{
            display: "contents",
          }}
        >
          <AiFillHome
            style={{
              width: "30px",
              height: "30px",
              color: "deepskyblue",
              margin: "30px 0px 0px 30px",
            }}
          />
        </Link>
        <Link
          to="/login"
          style={{
            display: "contents",
          }}
        >
          <UpButton
            style={{
              display: is_login === false ? "" : "none",
            }}
          >
            로그인
          </UpButton>
        </Link>
        <Link
          to="/signup"
          style={{
            display: "contents",
          }}
        >
          <UpButton
            style={{
              display: is_login === false ? "" : "none",
            }}
          >
            회원가입
          </UpButton>
        </Link>
        <UpButton
          style={{
            display: is_login === true ? "" : "none",
          }}
          onClick={() => {
            signOut(auth);
            alert("로그아웃 되었습니다.");
          }}
        >
          <AiOutlineExport
            style={{
              color: "white",
              width: "25px",
              height: "25px",
              borderRadius: "30px",
            }}
          />
        </UpButton>
        <Link
          to="/notification"
          style={{
            display: "contents",
          }}
        >
          <UpButton
            style={{
              display: is_login === true ? "" : "none",
            }}
          >
            <AiFillBell
              style={{
                color: "white",
                width: "25px",
                height: "25px",
                borderRadius: "30px",
              }}
            />
          </UpButton>
        </Link>
        <button
          style={{
            display: "contents",
          }}
          onClick={() => {
            window.scrollTo(0, 0);
          }}
        >
          <BiChevronUp
            style={{
              background: "deepskyblue",
              color: "white",
              width: "30px",
              height: "30px",
              borderRadius: "30px",
              position: "fixed",
              bottom: "30",
              left: "30",
            }}
          />
        </button>
        <Link
          to="/add"
          style={{
            display: "contents",
          }}
        >
          <BiPlus
            id="toAdd"
            style={{
              background: "deepskyblue",
              color: "white",
              width: "50px",
              height: "50px",
              borderRadius: "50px",
              position: "fixed",
              bottom: "30",
              right: "30",
            }}
          />
        </Link>
      </div>
      <Routes>
        <Route path="/" element={<Main is_login={is_login} auth={auth} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/add" element={<Add is_login={is_login} auth={auth} />} />
        <Route
          path="/detail/:postId"
          element={<Detail is_login={is_login} auth={auth} />}
        />
        <Route path="/pleaselogin" element={<PleaseLogin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

const UpButton = styled.button`
  width: 100px;
  height: 30px;
  color: white;
  background-color: deepskyblue;
  border-color: transparent;
  border-radius: 20px;
  float: right;
  margin: 30px 30px 0px 0px;
`;

export default App;
