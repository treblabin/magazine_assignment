import { db } from "../../shared/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  where,
  query,
} from "firebase/firestore";
import { async } from "@firebase/util";
import { act } from "react-dom/test-utils";

// Actions
const LOAD = "post/LOAD";
const CREATE = "post/CREATE";
const LIKE = "post/LIKE";
const UNLIKE = "post/UNLIKE";
const COMMENT = "post/COMMENT";
const DELETE = "post/DELETE";

const initialState = {
  list: [],
};

// Action Creators
export function loadPost(post_list) {
  return { type: LOAD, post_list };
}

export function createPost(post) {
  return { type: CREATE, post };
}

export function likePost(post) {
  return { type: LIKE, post };
}

export function unLikePost(post) {
  return { type: UNLIKE, post };
}

export function commentPost(commentInfo) {
  return { type: COMMENT, commentInfo };
}

export function deletePost(postId) {
  return { type: DELETE, postId };
}

//middlewares

export const loadPostFB = () => {
  return async function (dispatch) {
    const post_data = await getDocs(collection(db, "post"));

    let post_list = [];

    post_data.forEach((doc) => {
      post_list.push({ ...doc.data(), id: doc.id });
    });
    dispatch(loadPost(post_list));
  };
};

export const createPostFB = (post) => {
  return async function (dispatch) {
    const post_data = await getDocs(collection(db, "post"));
    let id_list = [0];
    post_data.forEach((doc) => {
      const my_id = doc.id;
      id_list.push(+my_id.split("a")[1]);
    });
    const this_id = String(Math.max(...id_list) + 1).padStart(4, "0");
    const docRef = await setDoc(doc(db, "post", `a${this_id}`), {
      ...post,
    });
    const newPost = {
      id: "a" + this_id,
      imageUrl: post.imageUrl,
      imageStyle: post.imageStyle,
      text: post.text,
      userEmail: post.userEmail,
      userNickname: post.userNickname,
      time: post.time,
      likes: post.likes,
      comments: post.comments,
    };
    dispatch(createPost(newPost));
  };
};

export const likePostFB = (post) => {
  return async function (dispatch, getState) {
    const postList = getState().post.list;
    const postIndex = postList.findIndex((b) => {
      return b.id === post.id;
    });
    const indexAndEmail = {
      index: postIndex,
      email: post.userEmail,
    };
    dispatch(likePost(indexAndEmail));
    const docRef = doc(db, "post", post.id);
    await updateDoc(docRef, { likes: getState().post.list[postIndex].likes });
  };
};

export const unLikePostFB = (post) => {
  return async function (dispatch, getState) {
    const postList = getState().post.list;
    const postIndex = postList.findIndex((b) => {
      return b.id === post.id;
    });
    const indexAndEmail = {
      index: postIndex,
      email: post.userEmail,
    };
    dispatch(unLikePost(indexAndEmail));
    const docRef = doc(db, "post", post.id);
    await updateDoc(docRef, { likes: getState().post.list[postIndex].likes });
  };
};

export const commentPostFB = (commentInfo) => {
  return async function (dispatch, getState) {
    const postList = getState().post.list;
    let userNickname = "";
    const postIndex = postList.findIndex((b) => {
      return b.id === commentInfo.id;
    });
    await getDocs(
      query(
        collection(db, "users"),
        where("userId", "==", commentInfo.userEmail)
      )
    ).then((user_docs) => {
      user_docs.forEach((doc) => {
        userNickname = doc.data().nickname;
      });
    });
    const newCommentInfo = {
      index: postIndex,
      userEmail: commentInfo.userEmail,
      text: commentInfo.text,
      time: commentInfo.time,
      userNickname: userNickname,
    };
    dispatch(commentPost(newCommentInfo));
    const docRef = doc(db, "post", commentInfo.id);
    await updateDoc(docRef, {
      comments: getState().post.list[postIndex].comments,
    });
  };
};

export const deletePostFB = (postId) => {
  return async function (dispatch, getState) {
    dispatch(deletePost(postId));
    const docRef = doc(db, "post", postId);
    await deleteDoc(docRef);
  };
};

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case "post/LOAD": {
      return { list: action.post_list };
    }
    case "post/CREATE": {
      const new_post_list = [...state.list, action.post];
      return { list: new_post_list };
    }
    case "post/LIKE": {
      let temp_post_list = state.list;
      temp_post_list[action.post.index].likes = [
        ...state.list[action.post.index].likes,
        action.post.email,
      ];
      const new_post_list = temp_post_list;
      return { list: new_post_list };
    }
    case "post/UNLIKE": {
      let temp_post_list = state.list;
      temp_post_list[action.post.index].likes = state.list[
        action.post.index
      ].likes.filter((l) => {
        return l !== action.post.email;
      });
      const new_post_list = temp_post_list;
      return { list: new_post_list };
    }
    case "post/COMMENT": {
      let temp_post_list = state.list;
      const newPush = {
        userEmail: action.commentInfo.userEmail,
        userNickname: action.commentInfo.userNickname,
        text: action.commentInfo.text,
        time: action.commentInfo.time,
      };
      temp_post_list[action.commentInfo.index].comments.push(newPush);
      const new_post_list = temp_post_list;
      return { list: new_post_list };
    }
    case "post/DELETE": {
      const new_post_list = state.list.filter((l) => {
        return l.id !== action.postId;
      });
      return { list: new_post_list };
    }
    // do reducer stuff
    default:
      return state;
  }
}
