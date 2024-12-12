import { useEffect, useState } from "react";

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDesciption] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1);

    // Edit
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDesciption] = useState("");

    const apiUrl = "http://localhost:8000";

    const handleSubmit = () => {
        setError("");
        if (title.trim() !== "" && description.trim() !== "") {
            fetch(apiUrl + "/todos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, description }),
            })
                .then((res) => {
                    if (res.ok) {
                        setTodos([...todos, { title, description }]);
                        setTitle("");
                        setDesciption("");
                        setMessage("Item added successfully");
                        setTimeout(() => {
                            setMessage("");
                        }, 3000);
                    } else {
                        setError("Unable to create Todo item");
                    }
                })
                .catch(() => {
                    setError("Unable to create Todo item");
                });
        }
    };

    useEffect(() => {
        getItems();
    }, []);

    const getItems = () => {
        fetch(apiUrl + "/todos")
            .then((res) => res.json())
            .then((res) => {
                setTodos(res);
            });
    };

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDesciption(item.description);
    };

    const handleUpdate = () => {
        setError("");
        if (editTitle.trim() !== "" && editDescription.trim() !== "") {
            fetch(apiUrl + "/todos/" + editId, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: editTitle,
                    description: editDescription,
                }),
            })
                .then((res) => {
                    if (res.ok) {
                        const updatedTodos = todos.map((item) => {
                            if (item._id === editId) {
                                item.title = editTitle;
                                item.description = editDescription;
                            }
                            return item;
                        });

                        setTodos(updatedTodos);
                        setEditTitle("");
                        setEditDesciption("");
                        setMessage("Item updated successfully");
                        setTimeout(() => {
                            setMessage("");
                        }, 3000);

                        setEditId(-1);
                    } else {
                        setError("Unable to update Todo item");
                    }
                })
                .catch(() => {
                    setError("Unable to update Todo item");
                });
        }
    };

    const handleEditCancel = () => {
        setEditId(-1);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure want to delete?")) {
            fetch(apiUrl + "/todos/" + id, {
                method: "DELETE",
            }).then(() => {
                const updatedTodos = todos.filter((item) => item._id !== id);
                setTodos(updatedTodos);
            });
        }
    };

    return (
        <div className="container py-4">
            <div className="row bg-primary text-white py-3 rounded mb-4">
                <h1 className="text-center">To-Do App</h1>
            </div>

            {message && (
                <div className="alert alert-success" role="alert">
                    {message}
                </div>
            )}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div className="row mb-4">
                <div className="col-md-8 mx-auto">
                    <h3>Add Item</h3>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDesciption(e.target.value)}
                        />
                        <button className="btn btn-dark" onClick={handleSubmit}>
                            Add
                        </button>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-8 mx-auto">
                    <h3>Tasks</h3>
                    {todos.map((item) => (
                        <div
                            className="card mb-3"
                            key={item._id}
                        >
                            <div className="card-body d-flex justify-content-between">
                                <div>
                                    {editId === item._id ? (
                                        <>
                                            <input
                                                type="text"
                                                className="form-control mb-2"
                                                value={editTitle}
                                                onChange={(e) =>
                                                    setEditTitle(e.target.value)
                                                }
                                            />
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editDescription}
                                                onChange={(e) =>
                                                    setEditDesciption(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <h5 className="card-title">
                                                {item.title}
                                            </h5>
                                            <p className="card-text">
                                                {item.description}
                                            </p>
                                        </>
                                    )}
                                </div>
                                <div className="d-flex gap-2">
                                    {editId === item._id ? (
                                        <>
                                            <button
                                                className="btn btn-success"
                                                onClick={handleUpdate}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={handleEditCancel}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="btn btn-warning"
                                                onClick={() =>
                                                    handleEdit(item)
                                                }
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() =>
                                                    handleDelete(item._id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
