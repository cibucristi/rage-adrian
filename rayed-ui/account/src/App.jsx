import { useState } from "react";
import { FaRegCheckCircle, FaRegEnvelope, FaRegUser } from 'react-icons/fa';
import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";
import './App.scss';


function Account() {

    const [state, setState] = useState("login");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [checkpassword, setCheckpassword] = useState("");

    return (
        <div className="background">
            <div className="container">
                <div className="card">
                    <p className="title">{state === "login" ? "AUTHENTIFICATION" : "REGISTRATION"}</p>
                    <p className="subtitle">RAYED MULTIPLAYER</p>
                    <div className="section">
                        <div className="input-section">
                            <FaRegUser className="icon" />
                            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="input-section">
                            <AiOutlineLock className="icon" />
                            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        {state === "register" ?
                            <>
                                <div className="input-section">
                                    <FaRegEnvelope className="icon" />
                                    <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                                </div><div className="input-section">
                                    <FaRegCheckCircle className="icon" />
                                    <input type="password" placeholder="Confirm Password" onChange={(e) => setCheckpassword(e.target.value)} />
                                </div>
                            </> : null}
                    </div>
                    <div className="buttons">
                        <button className="btn" onClick={
                            (e) => {

                                if (state === "register") if (checkpassword !== password) return mp.trigger("client::login_handler", 'password-check');
                                if (state === "login") mp.trigger("client::login_event", username, password);
                                else mp.trigger("client::register_event", username, email, password);
                            }
                        }>{state === "login" ? "SIGN IN" : "SIGN UP"}</button>
                        <p className="switch">{state === "login" ? "You dont have account?" : "You have account?"} <span className="click" onClick={() => state === "login" ? setState("register") : setState("login")}>Click here</span></p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Account;