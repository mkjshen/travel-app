import { useRef, useState } from "react";
import "./login.css";
import { Room, Close } from "@material-ui/icons";
import axios from "axios";

export default function Login({ setShowLogin, myStorage, setCurrentUser }) {
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const res = await axios.post("/users/login", user);
      myStorage.setItem("user", res.data.username)
      setCurrentUser(res.data.username)
      setShowLogin(false);
      setError(false);
    } catch (err) {
      setError(true);
    }
  };
  return (
    <div className="loginContainer">
      <div className="logo">
        <Room className="icon" />
        MobileMarker
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" ref={nameRef} />
        <input type="password" placeholder="Password" ref={passwordRef} />
        <button className="loginButton">Login</button>
        {error && <span className="failure">Error. Something went wrong.</span>}
      </form>
      <Close
        className="loginCancel"
        onClick={() => {
          setShowLogin(false);
        }}
      />
    </div>
  );
}
