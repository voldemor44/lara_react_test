import { Outlet, Navigate, Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect } from "react";
import axiosClient from "../axios-client";

const DefaultLayout = () => {
    const { user, token, notification, setUser, setToken } = useStateContext();

    const logout = (e) => {
        e.preventDefault();
        console.log(user);
        axiosClient.post("/logout").then(() => {
            setUser({});
            setToken(null);
        });
    };

    if (!token) {
        return <Navigate to="/login" />;
    }

    // Récuperer les informations de l'utilisateur authentifié
    useEffect(() => {
        axiosClient.get("/user").then(({ data }) => {
            setUser(data);
        });
    }, []);

    return (
        <div id="defaultLayout">
            <aside>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/users">Users</Link>
            </aside>
            <div className="content">
                <header>
                    <div>Header</div>
                    <div>
                        {user.name}
                        <a onClick={logout} className="btn-logout">
                            Logout
                        </a>
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>
            </div>

            {notification && <div className="notification">{notification}</div>}
        </div>
    );
};

export default DefaultLayout;
