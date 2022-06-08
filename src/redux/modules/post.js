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
} from "firebase/firestore";
import { async } from "@firebase/util";

// Actions
const LOAD = "post/LOAD";
const CREATE = "post/CREATE";

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
    const this_id = Math.max(...id_list) + 1;
    const docRef = await setDoc(doc(db, "post", `a${this_id}`), {
      ...post,
    });
    dispatch(createPost(post));
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
    // do reducer stuff
    default:
      return state;
  }
}
