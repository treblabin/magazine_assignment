import React from "react";
import { auth, db } from "./shared/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

function Signup() {
  const emailRef = React.useRef(null);
  const passwordRef = React.useRef(null);
  const nicknameRef = React.useRef(null);

  const signupFB = async () => {
    if (
      emailRef.current.value === "" ||
      nicknameRef.current.value === "" ||
      passwordRef.current.value === ""
    ) {
      alert("아이디, 닉네임, 비밀번호를 채워주세요!");
      return false;
    }
    if (
      emailRef.current.value.includes("@") === false ||
      emailRef.current.value.split("@")[0].length < 1 ||
      emailRef.current.value.split("@")[1].includes(".") === false ||
      emailRef.current.value.split("@")[1].split(".")[0].length < 1 ||
      emailRef.current.value.split("@")[1].split(".")[1].length < 2
    ) {
      alert("아이디는 이메일 형태입니다!");
      return false;
    }
    if (passwordRef.current.value.length < 6) {
      alert("비밀번호는 6자리 이상입니다!");
      return false;
    }
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
