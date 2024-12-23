import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../authContext";
import axios from "axios";
import "../styles/login.scss";

function Login({ type }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const urls = {
    "admin": "http://localhost:7700/api/admin/login",
    "user": "http://localhost:7700/api/user/login"  // Updated to match your backend route
  };

  const landings = {
    "admin": "/admin/dashboard",
    "user": "/home"
  };

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    
    try {
      // Use the correct URL based on type
      const res = await axios.post(urls[type], credentials, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`${type} login successful, response:`, res.data);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      
      // Use the correct landing page based on type
      navigate(landings[type]);
    } catch (err) {
      console.error("Login error:", err);
      dispatch({ 
        type: "LOGIN_FAILURE", 
        payload: err.response?.data?.message || "Login failed"
      });
    }
  };

  return (
    <div className="login">
      <div className="loginCard">
        <div className="center">
          <h1>Login {type}!</h1>
          <form onSubmit={handleClick}>
            <div className="txt_field">
              <input
                type="text"
                id="username"
                onChange={handleChange}
                required
              />
              <span></span>
              <label>Username</label>
            </div>
            <div className="txt_field">
              <input
                type="password"
                id="password"
                onChange={handleChange}
                required
              />
              <span></span>
              <label>Password</label>
            </div>
            {error && <span className="error">{error}</span>}
            <button 
              disabled={loading} 
              type="submit" 
              className="button"
            >
              Login
            </button>
          </form>
          <div className="signup_link">
            <p>
              New here?{" "}
              <Link to={type === "admin" ? "/adminRegister" : "/userRegister"}>
                Register
              </Link>
            </p>
            <p>
              <Link to="/landing">Return to Landing Page</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;