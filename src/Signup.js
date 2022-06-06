import React from "react";
import { auth, db } from "./shared/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

function Signup() {
  const emailRef = React.useRef(null);
  const passwordRef = React.useRef(null);
  const nicknameRef = React.useRef(null);

  const signupFB = async () => {
    const user = await createUserWithEmailAndPassword(
      auth,
      emailRef.current.value,
      passwordRef.current.value
    );

    const user_doc = await addDoc(collection(db, "users"), {
      user_id: user.user.email,
      nickname: nicknameRef.current.value,
    });
  };

  return (
    <div>
      아이디(이메일) : <input type="text" ref={emailRef} /> <br />
      닉네임 : <input type="text" ref={nicknameRef} /> <br />
      비밀번호 : <input type="password" ref={passwordRef} /> <br />
      <button onClick={signupFB}>회원가입하기</button>
    </div>
  );
}

export default Signup;
