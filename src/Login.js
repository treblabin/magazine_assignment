import React from "react";
import { auth, db } from "./shared/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDocs, where, query, collection } from "firebase/firestore";

function Login() {
  const emailRef = React.useRef(null);
  const passwordRef = React.useRef(null);

  const loginFB = async () => {
    const user = await signInWithEmailAndPassword(
      auth,
      emailRef.current.value,
      passwordRef.current.value
    );
    console.log(user);

    const user_docs = await getDocs(
      query(collection(db, "users"), where("user_id", "==", user.user.email))
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
