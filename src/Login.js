import React from "react";
import { auth, db } from "./shared/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDocs, where, query, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Login() {
  const emailRef = React.useRef(null);
  const passwordRef = React.useRef(null);
  const navigate = useNavigate();

  const loginFB = async () => {
    if (emailRef.current.value === "" || passwordRef.current.value === "") {
      alert("아이디와 비밀번호를 입력해주세요!");
      return false;
    }

    if (
      emailRef.current.value.includes("@") === false ||
      emailRef.current.value.split("@")[0].length < 1 ||
      emailRef.current.value.split("@")[1].includes(".") === false ||
      emailRef.current.value.split("@")[1].split(".")[0].length < 1 ||
      emailRef.current.value.split("@")[1].split(".")[1].length < 2
    ) {
      alert("아이디는 이메일 형식입니다!");
      return false;
    }
    const user = await signInWithEmailAndPassword(
      auth,
      emailRef.current.value,
      passwordRef.current.value
    ).then(
      function (value) {
        navigate("/");
      },
      function (reason) {
        alert("아이디와 비밀번호를 확인해주세요!");
      }
    );
    console.log(user);

    const user_docs = await getDocs(
      query(collection(db, "users"), where("userId", "==", user.user.email))
    );
    user_docs.forEach((u) => {
      console.log(u.data());
    });
  };

  return (
    <div>
      아이디(이메일) : <input type="text" ref={emailRef} /> <br />
      비밀번호 : <input type="password" ref={passwordRef} /> <br />
      <button onClick={loginFB}>로그인하기</button>
    </div>
  );
}

export default Login;
