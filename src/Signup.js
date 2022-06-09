import React, { useState } from "react";
import { auth, db } from "./shared/firebase";
import { useDispatch } from "react-redux";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, getDocs, where, query } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function Signup() {
  const emailRef = React.useRef(null);
  const passwordRef = React.useRef(null);
  const nicknameRef = React.useRef(null);
  const passwordCheckRef = React.useRef(null);

  const [passwordLengthState, setPasswordLengthState] = useState(0);
  const [passwordCheckLengthState, setPasswordCheckLengthState] = useState(0);
  const [passwordState, setPasswordState] = useState(null);
  const [passwordCheckState, setPasswordCheckState] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  window.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      signupFB();
    }
    if (passwordRef.current !== null) {
      dispatch(setPasswordLengthState(passwordRef.current.value.length));
    }
  });

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
    if (document.getElementById("nickname").readOnly === false) {
      alert("닉네임 중복확인을 해주세요!");
      return false;
    }
    if (passwordRef.current.value.length < 6) {
      alert("비밀번호는 6자리 이상입니다!");
      return false;
    }
    if (passwordRef.current.value !== passwordCheckRef.current.value) {
      alert("비밀번호와 비밀번호 확인이 다릅니다!");
      return false;
    }
    const userID = emailRef.current.value;
    const userNickname = nicknameRef.current.value;
    const user = await createUserWithEmailAndPassword(
      auth,
      emailRef.current.value,
      passwordRef.current.value
    )
      .then((userCredential) => {
        console.log(userCredential.user);
        navigate("/");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          alert("이미 사용 중인 이메일입니다!");
          return false;
        }
        alert(error.code + "에러입니다. 관리자에게 문의해주세요.");
      });

    const user_doc = await addDoc(collection(db, "users"), {
      userId: userID,
      nickname: userNickname,
      profilePic:
        "https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png",
      notification: [],
    });
  };

  const checkNickname = async () => {
    if (nicknameRef.current.value === "") {
      alert("닉네임을 채워주세요!");
      return false;
    }
    await getDocs(
      query(
        collection(db, "users"),
        where("nickname", "==", nicknameRef.current.value)
      )
    ).then((user_docs) => {
      console.log(user_docs._snapshot.docChanges.length);
      if (user_docs._snapshot.docChanges.length === 0) {
        alert("사용 가능한 닉네임입니다!");
        document.getElementById("nickname").readOnly = true;
        document.getElementById("checkNickname").style.display = "none";
        document.getElementById("changeNickname").style.display = "";
        document.getElementById("nickname").style.background = "#ddd";
      } else {
        alert("이미 사용 중인 닉네임입니다!");
      }
    });
  };

  const changeNickname = () => {
    document.getElementById("nickname").readOnly = false;
    document.getElementById("checkNickname").style.display = "";
    document.getElementById("changeNickname").style.display = "none";
    document.getElementById("nickname").style.background = "transparent";
  };

  return (
    <div>
      <GiveMargin />
      <Cover>
        <div />
        <Title>회원가입</Title>
        <div />
        <div />
        아이디(이메일) :
        <div />
        <div />
        <MyInput type="text" ref={emailRef} />
        <div />
        <div />
        닉네임 :
        <div />
        <div />
        <MyInput type="text" id="nickname" ref={nicknameRef} />
        <NicknameBtn onClick={checkNickname} id="checkNickname">
          중복체크
        </NicknameBtn>
        <NicknameBtn
          onClick={changeNickname}
          id="changeNickname"
          style={{ display: "none" }}
        >
          수정하기
        </NicknameBtn>
        <div />
        비밀번호 :
        <div />
        <div />
        <MyInput type="password" ref={passwordRef} />
        <PasswordBtn
          style={{ backgroundColor: passwordLengthState > 5 ? "green" : "red" }}
        >
          {passwordLengthState > 5 ? "유효" : "무효"}
        </PasswordBtn>
        <div />
        비밀번호 확인 :
        <div />
        <div />
        <MyInput type="password" ref={passwordCheckRef} />
        <div />
        <div />
        <SignBtn onClick={signupFB}>회원가입하기</SignBtn>
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
  display: grid;
  grid-template-columns: 2fr 4fr 2fr;
  gap: 0px 10px;
  padding: 20px;
`;

const Title = styled.p`
  font-size: 20px;
  font-weight: bold;
`;

const MyInput = styled.input`
  height: 25px;
  outline-color: deepskyblue;
  border: 2px solid deepskyblue;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const NicknameBtn = styled.button`
  background-color: deepskyblue;
  color: white;
  height: 30px;
  border-radius: 10px;
  border: none;
  font-size: 15px;
  font-weight: bold;
  @media screen and (max-width: 380px) {
    font-size: 12px;
  }
  @media screen and (max-width: 350px) {
    font-size: 10px;
  }
`;

const PasswordBtn = styled.button`
  color: white;
  height: 30px;
  border-radius: 10px;
  border: none;
  font-size: 15px;
  font-weight: bold;
  @media screen and (max-width: 380px) {
    font-size: 12px;
  }
  @media screen and (max-width: 350px) {
    font-size: 10px;
  }
`;

const SignBtn = styled.button`
  margin-top: 30px;
  background-color: deepskyblue;
  color: white;
  height: 40px;
  border-radius: 10px;
  border: none;
  font-size: 15px;
  font-weight: bold;
`;

export default Signup;
