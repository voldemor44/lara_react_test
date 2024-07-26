import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { useRef, useState } from "react";
import axiosClient from "../axios-client";
const Login = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [errors, setErrors] = useState(null);
    const { setUser, setToken } = useStateContext();
    const [message, setMessage] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        console.log(payload);
        axiosClient
            .post("/login", payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
                console.log(data);
                console.log(data.message);
                if (data.message) {
                    setMessage(data.message);
                }
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    // Affiche les erreurs de validation de données du formulaire
                    console.log(response.data.errors);
                    setErrors(response.data.errors);
                }
            });
    };

    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={submit}>
                    <h1 className="title">Login into your account</h1>
                    {errors && (
                        <div className="alert">
                            {Object.keys(errors).map((key) => {
                                return <p key={key}>{errors[key][0]}</p>;
                            })}
                        </div>
                    )}
                    {message && (
                        <div className="alert">
                            <p>{message}</p>
                        </div>
                    )}
                    <input ref={emailRef} type="email" placeholder="Email" />
                    <input
                        ref={passwordRef}
                        type="password"
                        placeholder="Password"
                    />
                    <button className="btn btn-block">Login</button>
                    <p className="message">
                        Not Registered ?
                        <Link to="/signup"> Create an account</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
