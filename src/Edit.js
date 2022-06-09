import React, { useState } from "react";
import styled from "styled-components";
import { storage, db } from "./shared/firebase";
import { useDispatch, useSelector } from "react-redux";
import { createPostFB } from "./redux/modules/post";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";
import { collection, addDoc, getDocs, where, query } from "firebase/firestore";

function Edit(props) {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const data = useSelector((state) => state.post.list);
  console.log(data);

  const [textState, setTextState] = useState("");
  const [radioState, setRadioState] = useState("");

  React.useEffect(() => {
    if (props.auth.currentUser === null) {
      navigate("/");
      alert("잘못된 접근입니다!");
    }
  }, [props.auth.currentUser]);

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

  const textPreview = (e) => {
    setTextState(e.target.value);
  };

  return (
    <FullCover>
      {data.map((n, i) => {
        if (n.id === params.postId) {
          return (
            <Cover key={i}>
              <RadioCover onChange={radioChange}>
                이미지 위치:
                <LeftInput
                  type="radio"
                  name="sort"
                  value="left"
                  id="left"
                  defaultChecked={n.imageStyle === "left" ? true : false}
                />
                <label htmlFor="left">왼쪽</label>
                <FullInput
                  type="radio"
                  name="sort"
                  value="full"
                  id="full"
                  defaultChecked={n.imageStyle === "full" ? true : false}
                />
                <label htmlFor="full">중앙</label>
                <RightInput
                  type="radio"
                  name="sort"
                  value="right"
                  id="right"
                  defaultChecked={n.imageStyle === "right" ? true : false}
                />
                <label htmlFor="right">오른쪽</label>
              </RadioCover>
              <PreviewCoverLeft
                style={{
                  display: n.imageStyle === "left" ? "" : "none",
                }}
              >
                <PreviewImgLeft id="previewImg" src={n.imageUrl} />
                <PreviewTextCoverLeft>
                  <PreviewTextLeft>{n.text}</PreviewTextLeft>
                </PreviewTextCoverLeft>
              </PreviewCoverLeft>
              <PreviewCoverRight
                style={{
                  display: n.imageStyle === "right" ? "" : "none",
                }}
              >
                <PreviewTextCoverRight>
                  <PreviewTextRight>{n.text}</PreviewTextRight>
                </PreviewTextCoverRight>
                <PreviewImgRight id="previewImg" src={n.imageUrl} />
              </PreviewCoverRight>
              <PreviewCoverFull
                style={{
                  display: n.imageStyle === "full" ? "" : "none",
                }}
              >
                <PreviewImgFull id="previewImg" src={n.imageUrl} />
                <PreviewTextCoverFull>
                  <PreviewTextFull>{n.text}</PreviewTextFull>
                </PreviewTextCoverFull>
              </PreviewCoverFull>
              <br />
              텍스트 입력 (최대 100글자)
              <br />
              <TextInput
                maxLength={100}
                onChange={textPreview}
                defaultValue={n.text}
              />{" "}
              <br />
              <UploadBtn id="uploadBtn">포스트 수정</UploadBtn>
            </Cover>
          );
        }
      })}
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

export default Edit;
