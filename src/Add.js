import React, { useState } from "react";
import styled from "styled-components";
import { storage, db } from "./shared/firebase";
import { useDispatch, useSelector } from "react-redux";
import { createPostFB } from "./redux/modules/post";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs, where, query } from "firebase/firestore";

function Add(props) {
  const fileLinkRef = React.useRef(null);
  const [imageSrc, setImageSrc] = useState(
    "https://cdn.icon-icons.com/icons2/2348/PNG/512/image_picture_icon_143003.png"
  );
  const [imageState, setImageState] = useState(null);
  const [textState, setTextState] = useState("");
  const [radioState, setRadioState] = useState("left");
  const reader = new FileReader();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!props.is_login) {
      navigate("/pleaselogin");
    }
  }, [props.is_login]);

  const radioChange = (e) => {
    if (e.target.value === "left") {
      setRadioState("left");
    }
    if (e.target.value === "right") {
      setRadioState("right");
    }
    if (e.target.value === "full") {
      setRadioState("full");
    }
  };

  const preview = (e) => {
    setImageState(e.target.files[0]);
    reader.readAsDataURL(e.target.files[0]);
    return new Promise((resolve) => {
      reader.onload = () => {
        setImageSrc(reader.result);
        resolve();
      };
    });
  };

  const textPreview = (e) => {
    setTextState(e.target.value);
  };

  const uploadFB = async () => {
    if (
      textState === "" ||
      imageSrc ===
        "https://cdn.icon-icons.com/icons2/2348/PNG/512/image_picture_icon_143003.png"
    ) {
      alert("사진과 글을 올려주세요!");
      return false;
    }
    let userNickname = "";
    const today = new Date();
    const time =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate() +
      " " +
      today.getHours() +
      ":" +
      today.getMinutes() +
      ":" +
      today.getSeconds();
    const uploadedFile = await uploadBytes(
      ref(storage, `posts/${time}`),
      imageState
    );
    const fileUrl = await getDownloadURL(uploadedFile.ref);
    fileLinkRef.current = { url: fileUrl };
    console.log(fileLinkRef.current.url);

    const userInfo = await getDocs(
      query(
        collection(db, "users"),
        where("userId", "==", props.auth.currentUser.email)
      )
    ).then((user_docs) => {
      user_docs.forEach((doc) => {
        userNickname = doc.data().nickname;
      });
    });

    const myInput = {
      imageUrl: fileUrl,
      imageStyle: radioState,
      text: textState,
      userEmail: props.auth.currentUser.email,
      userNickname: userNickname,
      time: time,
      likes: [],
      comments: [],
    };
    dispatch(createPostFB(myInput));
    navigate("/");
  };

  return (
    <FullCover>
      <Cover>
        이미지 선택: <input type="file" accept="image/*" onChange={preview} />
        <br />
        <RadioCover onChange={radioChange}>
          이미지 위치:
          <LeftInput
            type="radio"
            name="sort"
            value="left"
            id="left"
            defaultChecked
          />
          <label htmlFor="left">왼쪽</label>
          <FullInput type="radio" name="sort" value="full" id="full" />
          <label htmlFor="full">중앙</label>
          <RightInput type="radio" name="sort" value="right" id="right" />
          <label htmlFor="right">오른쪽</label>
        </RadioCover>
        <PreviewCoverLeft
          style={{
            display: radioState === "left" ? "" : "none",
          }}
        >
          <PreviewImgLeft id="previewImg" src={imageSrc} />
          <PreviewTextCoverLeft>
            <PreviewTextLeft>{textState}</PreviewTextLeft>
          </PreviewTextCoverLeft>
        </PreviewCoverLeft>
        <PreviewCoverRight
          style={{
            display: radioState === "right" ? "" : "none",
          }}
        >
          <PreviewTextCoverRight>
            <PreviewTextRight>{textState}</PreviewTextRight>
          </PreviewTextCoverRight>
          <PreviewImgRight id="previewImg" src={imageSrc} />
        </PreviewCoverRight>
        <PreviewCoverFull
          style={{
            display: radioState === "full" ? "" : "none",
          }}
        >
          <PreviewImgFull id="previewImg" src={imageSrc} />
          <PreviewTextCoverFull>
            <PreviewTextFull>{textState}</PreviewTextFull>
          </PreviewTextCoverFull>
        </PreviewCoverFull>
        <br />
        텍스트 입력 (최대 100글자)
        <br />
        <TextInput maxLength={100} onChange={textPreview} /> <br />
        <UploadBtn onClick={uploadFB}>포스트 업로드</UploadBtn>
      </Cover>
    </FullCover>
  );
}

const FullCover = styled.div``;

const Cover = styled.div`
  width: 100%;
  height: 100%;
  max-width: 500px;
  margin: auto;
  text-align: center;
`;

const RadioCover = styled.div`
  margin: 20px 0px;
`;

const LeftInput = styled.input`
  width: 20px;
  height: 20px;
`;

const RightInput = styled.input`
  width: 20px;
  height: 20px;
`;

const FullInput = styled.input`
  width: 20px;
  height: 20px;
`;

const PreviewCoverLeft = styled.div`
  margin: 20px auto 0px auto;
  width: 440px;
  height: 440px;
  position: relative;
  display: flex;
  border: 2px solid deepskyblue;
  border-radius: 20px;
  @media screen and (max-width: 500px) {
    width: calc(100% - 20px);
    height: calc(100vw - 20px);
  }
`;

const PreviewCoverRight = styled.div`
  margin: 20px auto 0px auto;
  width: 440px;
  height: 440px;
  position: relative;
  display: flex;
  border: 2px solid deepskyblue;
  border-radius: 20px;
  @media screen and (max-width: 500px) {
    width: calc(100% - 20px);
    height: calc(100vw - 20px);
  }
`;

const PreviewCoverFull = styled.div`
  margin: 20px auto 0px auto;
  width: 440px;
  height: 440px;
  position: relative;
  display: flex;
  border: 2px solid deepskyblue;
  border-radius: 20px;
  @media screen and (max-width: 500px) {
    width: calc(100% - 20px);
    height: calc(100vw - 20px);
  }
`;

const PreviewTextCoverLeft = styled.div`
  width: 200px;
  height: 400px;
  @media screen and (max-width: 500px) {
    width: calc((100% - 60px) / 2);
    height: calc(100vw - 60px);
  }
`;

const PreviewTextCoverRight = styled.div`
  width: 200px;
  height: 400px;
  @media screen and (max-width: 500px) {
    width: calc((100% - 60px) / 2);
    height: calc(100vw - 60px);
  }
`;

const PreviewTextCoverFull = styled.div`
  width: 400px;
  height: 100px;
  @media screen and (max-width: 500px) {
    width: calc(100% - 60px);
  }
`;

const PreviewTextLeft = styled.p`
  width: 200px;
  position: absolute;
  top: 50%;
  right: 0%;
  transform: translate(-20px, -50%);
  word-break: break-all;
  white-space: pre-line;
  @media screen and (max-width: 500px) {
    width: calc((100% - 60px) / 2);
  }
`;

const PreviewTextRight = styled.p`
  width: 200px;
  position: absolute;
  top: 50%;
  left: 0%;
  transform: translate(20px, -50%);
  word-break: break-all;
  white-space: pre-line;
  @media screen and (max-width: 500px) {
    width: calc((100% - 60px) / 2);
  }
`;

const PreviewTextFull = styled.p`
  width: 400px;
  position: absolute;
  bottom: 100px;
  left: 0%;
  transform: translate(20px, 100%);
  word-break: break-all;
  white-space: pre-line;
  @media screen and (max-width: 500px) {
    width: calc((100% - 60px));
  }
`;

const PreviewImgLeft = styled.img`
  max-width: 200px;
  max-height: 400px;
  position: absolute;
  top: 50%;
  left: 0%;
  transform: translate(20px, -50%);
  @media screen and (max-width: 500px) {
    max-width: calc((100vw - 60px) / 2);
    max-height: calc((100vw - 60px));
  }
`;

const PreviewImgRight = styled.img`
  max-width: 200px;
  max-height: 400px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(0%, -50%);
  @media screen and (max-width: 500px) {
    max-width: calc((100vw - 60px) / 2);
    max-height: calc((100vw - 60px));
  }
`;

const PreviewImgFull = styled.img`
  max-width: 300px;
  max-height: 300px;
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translate(-50%, 0%);
  @media screen and (max-width: 500px) {
    max-width: calc((100% - 100px) / 4 * 3);
    max-height: calc((100vw - 100px) / 4 * 3);
  }
`;

const TextInput = styled.textarea`
  width: 300px;
  height: 50px;
  border-radius: 10px;
  border: 2px solid deepskyblue;
  outline-color: deepskyblue;
`;

const UploadBtn = styled.button`
  background-color: deepskyblue;
  color: white;
  width: 300px;
  height: 30px;
  border-radius: 10px;
  border: none;
  font-size: 18px;
`;

export default Add;
