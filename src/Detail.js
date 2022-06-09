import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import {
  likePostFB,
  unLikePostFB,
  commentPostFB,
  deletePostFB,
} from "./redux/modules/post";
import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "./shared/firebase";
import { AiFillHeart } from "react-icons/ai";
import { Link, useNavigate, useParams } from "react-router-dom";

function Detail(props) {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const commentRef = React.useRef(null);

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
    if (userImageState.length === ReversedData.length) {
      return false;
    }
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

  const postComment = async () => {
    if (!props.is_login) {
      alert("댓글 작성을 위해서는 로그인을 해주세요!");
      return false;
    }
    if (commentRef.current.value === "") {
      alert("댓글을 작성해주세요!");
      return false;
    }
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

    const commentInfo = {
      id: params.postId,
      userEmail: props.auth.currentUser.email,
      text: commentRef.current.value,
      time: time,
    };
    document.getElementById("commentInput").value = null;
    dispatch(commentPostFB(commentInfo));
  };

  const deleteThis = (postId) => {
    dispatch(deletePostFB(postId));
    navigate("/");
  };

  return (
    <div>
      <Cover>
        {ReversedData.map((n, i) => {
          if (n.id === params.postId) {
            if (n.imageStyle === "left") {
              return (
                <div key={n.id + "post"}>
                  <PostCover>
                    <UserIdCover>
                      <UserImage src={userImageState[i]} />
                      <UserId>{n.userNickname}</UserId>
                      <WrittenDate>{n.time}</WrittenDate>
                    </UserIdCover>
                    <ImgLeft src={n.imageUrl} />
                    <TextCoverLeft>
                      <TextLeft>{n.text}</TextLeft>
                    </TextCoverLeft>
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
                        color:
                          props.auth.currentUser !== null
                            ? n.likes.includes(props.auth.currentUser.email)
                              ? "pink"
                              : "gray"
                            : "gray",
                        bottom: "15px",
                        right: "20px",
                      }}
                    />
                  </PostCover>
                  {props.auth.currentUser !== null ? (
                    n.userEmail === props.auth.currentUser.email ? (
                      <EditCover>
                        <Link
                          to={`/edit/${n.id}`}
                          style={{ display: "contents" }}
                        >
                          <EditBtn>수정</EditBtn>
                        </Link>
                        <DeleteBtn
                          onClick={() => {
                            deleteThis(n.id);
                          }}
                        >
                          삭제
                        </DeleteBtn>
                      </EditCover>
                    ) : null
                  ) : null}
                  <CommentCover>
                    <CommentInput
                      type="text"
                      maxLength="50"
                      ref={commentRef}
                      id="commentInput"
                    />
                    <CommentBtn onClick={postComment}>댓글달기</CommentBtn>
                  </CommentCover>
                  {n.comments.map((c, d) => {
                    return (
                      <div key={n.id + "comment" + d}>
                        <CommentsCover>
                          <CommentNickname>{c.userNickname}</CommentNickname>
                          <CommentText>{c.text}</CommentText>
                        </CommentsCover>
                        <CommentTime>{c.time}</CommentTime>
                      </div>
                    );
                  })}
                </div>
              );
            }
            if (n.imageStyle === "right") {
              return (
                <div key={n.id + "post"}>
                  <PostCover>
                    <UserIdCover>
                      <UserImage src={userImageState[i]} />
                      <UserId>{n.userNickname}</UserId>
                      <WrittenDate>{n.time}</WrittenDate>
                    </UserIdCover>
                    <ImgRight src={n.imageUrl} />
                    <TextCoverRight>
                      <TextRight>{n.text}</TextRight>
                    </TextCoverRight>
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
                        color:
                          props.auth.currentUser !== null
                            ? n.likes.includes(props.auth.currentUser.email)
                              ? "pink"
                              : "gray"
                            : "gray",
                        bottom: "15px",
                        right: "20px",
                      }}
                    />
                  </PostCover>
                  {props.auth.currentUser !== null ? (
                    n.userEmail === props.auth.currentUser.email ? (
                      <EditCover>
                        <Link
                          to={`/edit/${n.id}`}
                          style={{ display: "contents" }}
                        >
                          <EditBtn>수정</EditBtn>
                        </Link>
                        <DeleteBtn
                          onClick={() => {
                            deleteThis(n.id);
                          }}
                        >
                          삭제
                        </DeleteBtn>
                      </EditCover>
                    ) : null
                  ) : null}
                  <CommentCover>
                    <CommentInput
                      type="text"
                      maxLength="50"
                      ref={commentRef}
                      id="commentInput"
                    />
                    <CommentBtn onClick={postComment}>댓글달기</CommentBtn>
                  </CommentCover>
                  {n.comments.map((c, d) => {
                    return (
                      <div key={n.id + "comment" + d}>
                        <CommentsCover>
                          <CommentNickname>{c.userNickname}</CommentNickname>
                          <CommentText>{c.text}</CommentText>
                        </CommentsCover>
                        <CommentTime>{c.time}</CommentTime>
                      </div>
                    );
                  })}
                </div>
              );
            }
            if (n.imageStyle === "full") {
              return (
                <div key={n.id + "post"}>
                  <PostCover>
                    <UserIdCover>
                      <UserImage src={userImageState[i]} />
                      <UserId>{n.userNickname}</UserId>
                      <WrittenDate>{n.time}</WrittenDate>
                    </UserIdCover>
                    <ImgFull src={n.imageUrl} />
                    <TextCoverFull>
                      <TextFull>{n.text}</TextFull>
                    </TextCoverFull>
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
                        color:
                          props.auth.currentUser !== null
                            ? n.likes.includes(props.auth.currentUser.email)
                              ? "pink"
                              : "gray"
                            : "gray",
                        bottom: "15px",
                        right: "20px",
                      }}
                    />
                  </PostCover>
                  {props.auth.currentUser !== null ? (
                    n.userEmail === props.auth.currentUser.email ? (
                      <EditCover>
                        <Link
                          to={`/edit/${n.id}`}
                          style={{ display: "contents" }}
                        >
                          <EditBtn>수정</EditBtn>
                        </Link>
                        <DeleteBtn
                          onClick={() => {
                            deleteThis(n.id);
                          }}
                        >
                          삭제
                        </DeleteBtn>
                      </EditCover>
                    ) : null
                  ) : null}
                  <CommentCover>
                    <CommentInput
                      type="text"
                      maxLength="50"
                      ref={commentRef}
                      id="commentInput"
                    />
                    <CommentBtn onClick={postComment}>댓글달기</CommentBtn>
                  </CommentCover>
                  {n.comments.map((c, d) => {
                    return (
                      <div key={n.id + "comment" + d}>
                        <CommentsCover>
                          <CommentNickname>{c.userNickname}</CommentNickname>
                          <CommentText>{c.text}</CommentText>
                        </CommentsCover>
                        <CommentTime>{c.time}</CommentTime>
                      </div>
                    );
                  })}
                </div>
              );
            }
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

const EditCover = styled.div`
  float: right;
  margin: 10px 30px 10px auto;
`;

const EditBtn = styled.button`
  background-color: deepskyblue;
  color: white;
  width: 50px;
  height: 25px;
  border-radius: 10px;
  border: none;
  font-size: 15px;
  margin-right: 10px;
`;

const DeleteBtn = styled.button`
  background-color: deepskyblue;
  color: white;
  width: 50px;
  height: 25px;
  border-radius: 10px;
  border: none;
  font-size: 15px;
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

const CommentCover = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin-top: 30px;
`;

const CommentInput = styled.input`
  width: 300px;
  height: 50px;
  border-radius: 10px;
  border: 2px solid deepskyblue;
  outline-color: deepskyblue;
  margin-right: 10px;
  @media screen and (max-width: 500px) {
    width: calc(100% - 80px);
  }
`;

const CommentBtn = styled.button`
  background-color: deepskyblue;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 10px;
  border: none;
  font-size: 15px;
`;

const CommentsCover = styled.div`
  width: 440px;
  display: flex;
  justify-content: left;
  align-items: center;
  flex-direction: row;
  margin-top: 10px;
  @media screen and (max-width: 500px) {
    width: calc(100% - 20px);
  }
`;

const CommentNickname = styled.p`
  margin: 0px 20px 0px 20px;
`;

const CommentText = styled.p``;

const CommentTime = styled.p`
  margin: 0px 0px 0px 20px;
  font-size: 10px;
  float: left;
`;

export default Detail;
