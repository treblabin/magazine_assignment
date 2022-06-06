import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Signup from "./Signup";
import NotFound from "./NotFound";
import Main from "./Main";
import Login from "./Login";
import { auth } from "./shared/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

function App() {
  const [is_login, setIsLogin] = React.useState(false);

  const loginCheck = async (user) => {
    if (user) {
      setIsLogin(true);
      alert("환영합니다!");
    } else {
      setIsLogin(false);
    }
  };
  React.useEffect(() => {
    onAuthStateChanged(auth, loginCheck);
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
          <button>메인페이지</button>
        </Link>
        <Link
          to="/signup"
          style={{
            display: "contents",
          }}
        >
          <button>회원가입</button>
        </Link>
        <Link
          to="/login"
          style={{
            display: "contents",
          }}
        >
          <button>로그인</button>
        </Link>
        <button
          onClick={() => {
            signOut(auth);
            alert("로그아웃 되었습니다.");
          }}
        >
          로그아웃
        </button>
      </div>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
