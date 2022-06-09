import React from "react";
import { auth, db } from "./shared/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDocs, where, query, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function Login() {
  const emailRef = React.useRef(null);
  const passwordRef = React.useRef(null);
  const navigate = useNavigate();

  window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      loginFB();
    }
  });

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
      <GiveMargin />
      <Cover>
        <Title>로그인</Title>
        아이디(이메일) : <br />
        <MyInput type="text" ref={emailRef} /> <br />
        비밀번호 : <br />
        <MyInput type="password" ref={passwordRef} /> <br />
        <LoginBtn onClick={loginFB}>로그인하기</LoginBtn>
      </Cover>
    </div>
  );
}

const GiveMargin = styled.div`
  height: 10vh;
`;

const Cover = styled.div`
  width: calc((100vw - 40px));
  height: 100%;
  max-width: 500px;
  margin: auto;
  text-align: center;
`;

const Title = styled.p`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5vh;
`;

const MyInput = styled.input`
  height: 25px;
  outline-color: deepskyblue;
  border: 2px solid deepskyblue;
  border-radius: 10px;
  margin: 10px auto 20px auto;
`;

const LoginBtn = styled.button`
  margin-top: 30px;
  background-color: deepskyblue;
  color: white;
  height: 40px;
  width: 150px;
  border-radius: 10px;
  border: none;
  font-size: 15px;
  font-weight: bold;
`;

export default Login;
