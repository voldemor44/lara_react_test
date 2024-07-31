import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getUsers(currentPage);
    }, [currentPage]);

    const getUsers = (page) => {
        setLoading(true);
        axiosClient
            .get(`/users?page=${page}`)
            .then((res) => {
                const { data, meta } = res.data;
                setLoading(false);
                setUsers(data);

                setCurrentPage(meta.current_page);
                setTotalPages(meta.last_page);

                console.log({ data, meta });
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const deleteUser = (user) => {
        if (!window.confirm("Are you sure you want to delete this user ?")) {
            return;
        }

        axiosClient.delete(`/users/${user.id}`).then(() => {
            // TODO show notification
            getUsers();
        });
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1>Users</h1>
                <Link to="/users/new" className="btn-add">
                    Add new
                </Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Create Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    {loading && (
                        <tbody>
                            <tr>
                                <td colSpan={"5"} className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        </tbody>
                    )}
                    {!loading && (
                        <tbody>
                            {users.map((user) => {
                                return (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.created_at}</td>
                                        <td>
                                            <Link
                                                className="btn-edit"
                                                to={"/users/" + user.id}
                                            >
                                                Edit
                                            </Link>
                                            &nbsp;
                                            <button
                                                onClick={(ev) => {
                                                    deleteUser(user);
                                                }}
                                                className="btn-delete"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    )}
                </table>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                {currentPage > 1 ? (
                    <button onClick={handlePreviousPage} className="btn-add">
                        Previous
                    </button>
                ) : (
                    <p
                        style={{ backgroundColor: "transparent" }}
                        className="btn-add"
                    ></p>
                )}
                {currentPage == totalPages ? (
                    <p
                        style={{ backgroundColor: "transparent" }}
                        className="btn-add"
                    ></p>
                ) : (
                    <button onClick={handleNextPage} className="btn-add">
                        Next
                    </button>
                )}
            </div>
        </div>
    );
};

export default Users;
