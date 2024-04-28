import React, { useEffect, useState } from "react";
import text_logo from "../../assets/text-logo.png";
import { Link, useNavigate } from "react-router-dom";
import "./Login.scss";
import { useForm } from "../../hooks";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";

const initialState = {
  email: "",
  password: "",
};

const Login = () => {
  const [value, setValue] = useForm(initialState);
  const [showPass, setShowPass] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [showWrongMsg, setShowWrongMsg] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setShowBtn(value.password !== "");
  }, [value.password]);

  const togglePassword = () => {
    setShowPass(!showPass);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, value.email, value.password)
      .then(() => navigate("/"))
      .catch((err) => setShowWrongMsg(true));
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <img src={text_logo} alt="" />
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
            <label for="eamil">Email</label>
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
            <label for="password">Password</label>
            {showBtn && (
              <span className="showPass" onClick={() => togglePassword()}>
                {showPass ? "Hide" : "Show"}
              </span>
            )}
          </div>
          {showWrongMsg && (
            <h4 className="text-red-500">Wrong Email or Password</h4>
          )}
          <button className="btn">Log in</button>
        </form>
        <p>Forgot password?</p>
      </div>
      <div className="signup-section">
        <p>
          Don't have an account?{" "}
          <Link to={"/signup"}>
            <a> Sign Up</a>
          </Link>{" "}
        </p>
      </div>
    </div>
  );
};

export default Login;
