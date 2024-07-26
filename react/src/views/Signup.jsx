import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

const Signup = () => {
    // Store input value
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const c_passwordRef = useRef();
    const [errors, setErrors] = useState(null);
    const { setUser, setToken } = useStateContext();

    const submit = (e) => {
        e.preventDefault();
        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: c_passwordRef.current.value,
        };

        // {data} destructuration of res.data
        console.log(payload);
        axiosClient
            .post("/signup", payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
                console.log(data);
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
                    <h1 className="title">Signup for free</h1>
                    {errors && (
                        <div className="alert">
                            {Object.keys(errors).map((key) => {
                                return <p key={key}>{errors[key][0]}</p>;
                            })}
                        </div>
                    )}
                    <input ref={nameRef} type="text" placeholder="Full Name" />
                    <input
                        ref={emailRef}
                        type="email"
                        placeholder="Email Adress"
                    />
                    <input
                        ref={passwordRef}
                        type="password"
                        placeholder="Password"
                    />
                    <input
                        ref={c_passwordRef}
                        type="password"
                        placeholder="Password Confirmation"
                    />
                    <button className="btn btn-block">Signup</button>
                    <p className="message">
                        Already Registered ?<Link to="/login"> Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
