import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { loadPostFB } from "./redux/modules/post";
import { collection, getDocs, where, query } from "firebase/firestore";
import { async } from "@firebase/util";
import { db } from "./shared/firebase";

function Main() {
  const dispatch = useDispatch();

  const data = useSelector((state) => state.post.list);
  const ReversedData = data.map((datas) => datas).reverse();
  const [userImageState, setUserImageState] = useState([]);
  const getUserImages = ReversedData.forEach(async (e) => {
    const temp_image = await getDocs(
      query(collection(db, "users"), where("userId", "==", e.userEmail))
    ).then((user_docs) => {
      user_docs.forEach((doc) => {
        setUserImageState([...userImageState, doc.data().profilePic]);
      });
    });
  });

  React.useEffect(() => {
    dispatch(loadPostFB());
  }, []);

  return (
    <div>
      <Cover>
        {ReversedData.map((n, i) => {
          if (n.imageStyle === "left") {
            return (
              <PostCover key={n.id}>
                <UserIdCover>
                  <UserImage src={userImageState[i]} />
                  <UserId>{n.userNickname}</UserId>
                </UserIdCover>
                <ImgLeft src={n.imageUrl} />
                <TextCoverLeft>
                  <TextLeft>{n.text}</TextLeft>
                </TextCoverLeft>
                <Comments>댓글 {n.comments.length}개</Comments>
                <Likes>좋아요 {n.likes.length}개</Likes>
              </PostCover>
            );
          }
        })}
      </Cover>
    </div>
  );
}

const Cover = styled.div`
  width: 100%;
  height: 100%;
  max-width: 500px;
  margin: auto;
  text-align: center;
`;

const PostCover = styled.div`
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

const UserIdCover = styled.div`
  display: flex;
`;

const UserImage = styled.img`
  width: 20px;
  height: 20px;
  margin: 20px 0px 0px 20px;
`;

const UserId = styled.p`
  margin-left: 20px;
`;

const ImgLeft = styled.img`
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

const TextCoverLeft = styled.div`
  width: 200px;
  height: 400px;
  @media screen and (max-width: 500px) {
    width: calc((100% - 60px) / 2);
    height: calc(100vw - 60px);
  }
`;

const TextLeft = styled.p`
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

const Comments = styled.p`
  position: absolute;
  bottom: 0%;
  left: 20px;
`;

const Likes = styled.p`
  position: absolute;
  bottom: 0%;
  right: 20px;
`;

export default Main;
