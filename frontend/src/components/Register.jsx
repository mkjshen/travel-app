import { useRef, useState } from "react";
import "./register.css";
import { Room, Close } from "@material-ui/icons";
import axios from "axios";

export default function Register({ setShowRegister }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await axios.post("/users/register", newUser);
      setError(false);
      setSuccess(true);
    } catch (err) {
      setError(true);
    }
  };
  return (
    <div className="registerContainer">
      <div className="logo">
        <Room className="icon" />
        MobileMarker
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" ref={nameRef} />
        <input type="email" placeholder="Email" ref={emailRef} />
        <input type="password" placeholder="Password" ref={passwordRef} />
        <button className="registerButton">Register</button>
        {success && (
          <span className="success">Successful. You can log in now!</span>
        )}
        {error && <span className="failure">Error. Something went wrong.</span>}
      </form>
      <Close
        className="registerCancel"
        onClick={() => {
          setShowRegister(false);
        }}
      />
    </div>
  );
}
