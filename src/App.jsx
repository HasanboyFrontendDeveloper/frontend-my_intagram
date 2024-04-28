import { Navigate, Route, Routes } from "react-router-dom";
import { Home, Signup, Login, Profile } from "./components";
import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase/config";
import { Typography } from "@material-tailwind/react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllAccountsStart,
  getAllAccountsSuccess,
  getContentFailure,
  getContentStart,
  getContentSuccess,
  getContentsData,
  getFollowing,
  getProfileFailure,
  getProfileStart,
  getProfileSuccess,
} from "./slice/profileSlice";

function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { profile, reloadProfile, contents } = useSelector((state) => state.profile);

  useEffect(() => {
    setIsLoading(true);
    const findout = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLogged(true);
      } else {
        setIsLogged(false);
      }
      setIsLoading(false);
    });

    return findout;
  }, [auth]);

  const dispatch = useDispatch();

  const accountsRef = collection(db, "accounts");

  const getAccounts = async () => {
    dispatch(getAllAccountsStart());
    const res = await getDocs(accountsRef).then((data) =>
      data.docs.map((doc) => doc.data())
    );
    dispatch(getAllAccountsSuccess(res));
  };

  const username = auth?.currentUser?.displayName;

  const getProfileData = async () => {
    setIsLoading(true);
    dispatch(getProfileStart());
    try {
      const usersRef = doc(db, "users", username);
      const data = await getDoc(usersRef).then((data) => data.data());
      dispatch(getProfileSuccess(data));
    } catch (error) {
      dispatch(getProfileFailure(error));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (reloadProfile || username) {
      getProfileData();
    }
  }, [reloadProfile, username]);

  useEffect(() => {
    getAccounts();
  }, []);

  const getContent = async () => {
    dispatch(getContentStart());
    try {
      let contents = [];

      const promises = profile?.following.map(async (username) => {
        const userRef = doc(db, "users", username);
        const userData = await getDoc(userRef);
        const user = userData.data();
        if (user && user.posts) {
          contents.push(...user.posts);
        }
      });

      await Promise.all(promises);

      dispatch(getContentSuccess(contents));

    } catch (error) {
      dispatch(getContentFailure(error.message));
    }
  };


  useEffect(() => {
    if (profile?.following) {
      getContent();
    }
  }, [profile?.following]);

  const getContentData = async () => {
    try {
      let content = [];

      const promises = contents.map(async (post) => {
        const userRef = doc(db, "posts", post);
        const postsShot = await getDoc(userRef);
        const postsData = postsShot.data();
        if (postsData) {
          content.push(postsData);
        }
      });


      await Promise.all(promises);
      dispatch(getContentsData(content));
    } catch (error) {
      // alert('Error getting the posts');
      console.error('Getting post error', error);
    }
  }


  useEffect(() => {
    if (contents) {
      getContentData()
    }
  }, [contents]);

  return (
    <>
      {isLoading ? (
        <Typography color="white" className="text-center">
          Loading...
        </Typography>
      ) : (
        <Routes>
          <Route
            path="/login"
            element={isLogged ? <Navigate to={"/"} /> : <Login />}
          />
          <Route
            path="/signup"
            element={isLogged ? <Navigate to={"/"} /> : <Signup />}
          />
          <Route
            path="/"
            element={isLogged ? <Home /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/:username"
            element={isLogged ? <Profile /> : <Navigate to={"/login"} />}
          />
        </Routes>
      )}
    </>
  );
}

export default App;
