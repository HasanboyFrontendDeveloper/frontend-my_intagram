import React, { useEffect, useState } from "react";
import "./Signup.scss";
import text_logo from "../../assets/text-logo.png";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { db, auth } from "../../firebase/config";
import { useForm } from "../../hooks";
import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore";
import { CircleCheckBig, CircleX } from "lucide-react";
import { FacebookAuthProvider } from "firebase/auth";

const initialState = {
  email: "",
  password: "",
  username: "",
  fullname: "", 
};

const Signup = () => {
  const [value, setValue] = useForm(initialState);
  const [showPass, setShowPass] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [wrongMsg, setWrongMsg] = useState("");
  const [accountsData, setAccountsData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    setShowBtn(value.password !== "");
  }, [value.password]);

  const togglePassword = () => {
    setShowPass(!showPass);
  };

  const accountsRef = collection(db, "accounts");

  const getAccounts = async () => {
    const res = await getDocs(accountsRef).then((data) =>
      data.docs.map((doc) => doc.data())
    );
    setAccountsData(res);
  };

  useEffect(() => {
    getAccounts();
  }, []);

  const isUsernameFree = () => {
    const a = accountsData.find((user) => user.username === value.username);
    return !a;
  };

  useEffect(() => {
    isUsernameFree();
  }, [value.username]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (value.password.length >= 8) {
      if (isUsernameFree()) {
        const username = value.username;
        const usersRef = doc(db, "users", username);
        const accountsRef = doc(db, "accounts", username);

        createUserWithEmailAndPassword(auth, value.email, value.password)
          .then(() => {
            updateProfile(auth?.currentUser, { displayName: value.username });
            const user = {
              email: value.email,
              username: value.username,
              fullname: value.fullname,
              userImg: null,
            };
            const userProfile = {
              ...user,
              bio: null,
              followersCount: 0,
              followingCount: 0,
              postCount: 0,
              userImg: null,
            };
            setDoc(accountsRef, user);
            setDoc(usersRef, userProfile);
            navigate("/");
          })
          .catch(() => setWrongMsg("Email is already taken"));
      } else {
        setWrongMsg("Username already taken");
      }
    } else {
      setWrongMsg("Password should be at least 8 characters");
    }
  };


  return (
    <div className="signup">
      <div className="signup-page">
        <img src={text_logo} alt="" />
        <h3 className="quote">
          Sign up to see photos and videos from your friends.
        </h3>
        <form onSubmit={submitHandler} className="inputs">
          <div className="form-group">
            <input
              type="text"
              placeholder=""
              id="email"
              value={value.email}
              onChange={setValue}
              required
            />
            <label htmlFor="eamil">Email</label>
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder=""
              id="fullname"
              value={value.fullname}
              onChange={setValue}
              required
            />
            <label htmlFor="fullname">Fullname</label>
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder=""
              id="username"
              value={value.username}
              onChange={setValue}
              required
            />
            <label htmlFor="username">Username</label>
            {value.username !== "" ? (
              isUsernameFree() ? (
                <CircleCheckBig className="check text-green-500" />
              ) : (
                <CircleX className="check text-red-500" />
              )
            ) : null}
          </div>
          <div className="form-group">
            <input
              type={showPass ? "text" : "password"}
              placeholder=""
              id="password"
              value={value.password}
              onChange={setValue}
              required
            />
            <label htmlFor="password">Password</label>
            {showBtn && (
              <span className="showPass" onClick={() => togglePassword()}>
                {showPass ? "Hide" : "Show"}
              </span>
            )}
          </div>
          {wrongMsg && <span className="text-red-500 m-0 p-0">{wrongMsg}</span>}
          <p>
            People who use our service may have uploaded your contact
            information to Instagram.
            <a
              href="https://www.facebook.com/help/instagram/261704639352628"
              target="_blank"
            >
              Learn More
            </a>
          </p>
          <button className="btn">Sign up</button>
        </form>
      </div>
      <div className="login-section">
        Have an account?{" "}
        <Link to={"/login"}>
          <a>Log in</a>
        </Link>
      </div>
    </div>
  );
};

export default Signup;
