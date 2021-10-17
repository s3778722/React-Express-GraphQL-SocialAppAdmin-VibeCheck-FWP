import React from "react";
import { deleteUser } from "../data/repository";

const DeleteUser = ({ users, setUsers }) => {
  //Handler for delete user
  const handleDelete = async (event) => {
    event.preventDefault();
    //Delete user from database with cascade
    await deleteUser(event.target.value);
    //Filter out the removed user
    const removeUser = users.filter((u) => u.email !== event.target.value);
    setUsers(removeUser);
  };

  return (
    <div className="bg">
      <h1 className="text-light p-5 fst-italic">ALL USERS</h1>

      <ol className="list-group list-group-numbered px-5">
        {users &&
          users.map((u) => {
            return (
              <li
                className="list-group-item bg-transparent text-white"
                key={u.email}
              >
                <span className="badge bg-info rounded-pill">{u.name}</span>
                <h2>{u.name}</h2>
                <h5>{u.email}</h5>
                <span className="badge bg-secondary rounded-pill">
                  {u.date}
                </span>
                <div className="mt-3">
                  <button
                    type="button"
                    className="btn btn-danger ps-4 pe-4"
                    value={u.email}
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
                <br />
                <br />
              </li>
            );
          })}
      </ol>
    </div>
  );
};

export default DeleteUser;
