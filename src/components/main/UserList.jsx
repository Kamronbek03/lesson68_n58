import React, { useEffect, useState } from "react";
import "./UserList.css";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({
    id: "",
    name: "",
    username: "",
    email: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/users")
      .then((res) => {
        setUsers(
          res.data.filter((user) => user.name && user.username && user.email)
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const AddUser = async () => {
    if (user.name && user.username && user.email) {
      try {
        const res = await axios.post("http://localhost:3000/users", user);
        const data = await res.data;
        setUsers([...users, data]);
        setUser({
          id: "",
          name: "",
          username: "",
          email: "",
        });
      } catch (err) {
        console.log(err.message);
      }
    } else {
      alert("Please fill in all the fields.");
    }
  };

  const UpdateUser = async (id) => {
    if (user.name && user.username && user.email) {
      try {
        const res = await axios.put(`http://localhost:3000/users/${id}`, user);
        const data = await res.data;
        setUsers(users.map((usr) => (usr.id === id ? data : usr)));
        setUser({
          id: "",
          name: "",
          username: "",
          email: "",
        });
        setIsUpdating(false);
      } catch (err) {
        console.log(err.message);
      }
    } else {
      alert("Please fill in all the fields.");
    }
  };

  const CardDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateClick = (user) => {
    setUser(user);
    setIsUpdating(true);
  };

  return (
    <div className="container">
      <div className="cards">
        {users.map(
          (el) =>
            el.name &&
            el.username &&
            el.email && (
              <div className="form" key={el.id}>
                <span>name</span>
                <p className="input">{el.name}</p>
                <span>username</span>
                <p className="input">{el.username}</p>
                <span>email</span>
                <p className="input">{el.email}</p>
                <div className="btnname">
                  <button className="btn" onClick={() => CardDelete(el.id)}>
                    Delete
                  </button>
                  <button className="btn" onClick={() => handleUpdateClick(el)}>
                    Update
                  </button>
                </div>
              </div>
            )
        )}
      </div>
      <div className="user-form">
        <input
          type="text"
          name="id"
          placeholder="ID"
          value={user.id}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={user.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={user.username}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleInputChange}
          required
        />
        <button
          className="btn"
          onClick={isUpdating ? () => UpdateUser(user.id) : AddUser}
        >
          {isUpdating ? "Update User" : "Create User"}
        </button>
      </div>
    </div>
  );
};

export default UserList;
