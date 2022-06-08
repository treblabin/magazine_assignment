import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { loadPostFB, likePostFB, unLikePostFB } from "./redux/modules/post";
import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "./shared/firebase";
import { AiFillHeart } from "react-icons/ai";
import { Link } from "react-router-dom";

function Main(props) {
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

  const likePost = async (info) => {
    if (!props.is_login) {
      alert("좋아요를 위해서는 로그인을 해주세요!");
      return false;
    }
    const likeInfo = {
      id: info.id,
      userEmail: props.auth.currentUser.email,
    };
    if (info.likes.includes(props.auth.currentUser.email)) {
      dispatch(unLikePostFB(likeInfo));
    } else {
      dispatch(likePostFB(likeInfo));
    }
  };

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
                  <WrittenDate>{n.time}</WrittenDate>
                </UserIdCover>
                <Link to={`detail/${n.id}`} style={{ display: "contents" }}>
                  <ImgLeft src={n.imageUrl} />
                </Link>
                <Link to={`detail/${n.id}`} style={{ display: "contents" }}>
                  <TextCoverLeft>
                    <TextLeft>{n.text}</TextLeft>
                  </TextCoverLeft>
                </Link>
                <Comments>댓글 {n.comments.length}개</Comments>
                <Likes>좋아요 {n.likes.length}개</Likes>
                <AiFillHeart
                  onClick={() => {
                    const info = { id: n.id, likes: n.likes };
                    likePost(info);
                  }}
                  style={{
                    position: "absolute",
                    width: "20px",
                    height: "20px",
                    color: props.is_login
                      ? n.likes.includes(props.auth.currentUser.email)
                        ? "pink"
                        : "gray"
                      : "gray",
                    bottom: "15px",
                    right: "20px",
                  }}
                />
              </PostCover>
            );
          }
          if (n.imageStyle === "right") {
            return (
              <PostCover key={n.id}>
                <UserIdCover>
                  <UserImage src={userImageState[i]} />
                  <UserId>{n.userNickname}</UserId>
                  <WrittenDate>{n.time}</WrittenDate>
                </UserIdCover>
                <Link to={`detail/${n.id}`} style={{ display: "contents" }}>
                  <ImgRight src={n.imageUrl} />
                </Link>
                <Link to={`detail/${n.id}`} style={{ display: "contents" }}>
                  <TextCoverRight>
                    <TextRight>{n.text}</TextRight>
                  </TextCoverRight>
                </Link>
                <Comments>댓글 {n.comments.length}개</Comments>
                <Likes>좋아요 {n.likes.length}개</Likes>
                <AiFillHeart
                  onClick={() => {
                    const info = { id: n.id, likes: n.likes };
                    likePost(info);
                  }}
                  style={{
                    position: "absolute",
                    width: "20px",
                    height: "20px",
                    color: props.is_login
                      ? n.likes.includes(props.auth.currentUser.email)
                        ? "pink"
                        : "gray"
                      : "gray",
                    bottom: "15px",
                    right: "20px",
                  }}
                />
              </PostCover>
            );
          }
          if (n.imageStyle === "full") {
            return (
              <PostCover key={n.id}>
                <UserIdCover>
                  <UserImage src={userImageState[i]} />
                  <UserId>{n.userNickname}</UserId>
                  <WrittenDate>{n.time}</WrittenDate>
                </UserIdCover>
                <Link to={`detail/${n.id}`} style={{ display: "contents" }}>
                  <ImgFull src={n.imageUrl} />
                </Link>
                <Link to={`detail/${n.id}`} style={{ display: "contents" }}>
                  <TextCoverFull>
                    <TextFull>{n.text}</TextFull>
                  </TextCoverFull>
                </Link>
                <Comments>댓글 {n.comments.length}개</Comments>
                <Likes>좋아요 {n.likes.length}개</Likes>
                <AiFillHeart
                  onClick={() => {
                    const info = { id: n.id, likes: n.likes };
                    likePost(info);
                  }}
                  style={{
                    position: "absolute",
                    width: "20px",
                    height: "20px",
                    color: props.is_login
                      ? n.likes.includes(props.auth.currentUser.email)
                        ? "pink"
                        : "gray"
                      : "gray",
                    bottom: "15px",
                    right: "20px",
                  }}
                />
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

const WrittenDate = styled.p`
  width: 200px;
  text-align: right;
  margin-left: auto;
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
  color: black;
  @media screen and (max-width: 500px) {
    width: calc((100% - 60px) / 2);
  }
`;

const ImgRight = styled.img`
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

const TextCoverRight = styled.div`
  width: 200px;
  height: 400px;
  @media screen and (max-width: 500px) {
    width: calc((100% - 60px) / 2);
    height: calc(100vw - 60px);
  }
`;

const TextRight = styled.p`
  width: 200px;
  position: absolute;
  top: 50%;
  left: 0%;
  transform: translate(20px, -50%);
  word-break: break-all;
  white-space: pre-line;
  color: black;
  @media screen and (max-width: 500px) {
    width: calc((100% - 60px) / 2);
  }
`;

const ImgFull = styled.img`
  max-width: 300px;
  max-height: 300px;
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translate(-50%, 0%);
  @media screen and (max-width: 500px) {
    max-width: calc((100% - 100px) / 4 * 3);
    max-height: calc((100vw - 100px) / 4 * 3);
  }
`;

const TextCoverFull = styled.div`
  width: 400px;
  height: 100px;
  @media screen and (max-width: 500px) {
    width: calc(100% - 60px);
  }
`;

const TextFull = styled.p`
  width: 400px;
  position: absolute;
  bottom: 100px;
  left: 0%;
  transform: translate(20px, 100%);
  word-break: break-all;
  white-space: pre-line;
  color: black;
  @media screen and (max-width: 500px) {
    width: calc((100% - 60px));
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
  right: 50px;
`;

export default Main;
