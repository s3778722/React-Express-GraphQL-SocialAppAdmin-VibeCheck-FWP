import React from "react";
import { updateUserIsBlocked } from "../data/repository";

const BlockUnblock = ({ users, setUsers }) => {
  const handleBlock = async (event) => {
    event.preventDefault();
    //log the user out
    await updateUserIsBlocked(event.target.value, true);

    const newList = [...users];

    newList.forEach((u) => {
      if (u.email === event.target.value) {
        u.isBlocked = true;
      }
    });
    setUsers(newList);
  };

  const handleUnblock = async (event) => {
    event.preventDefault();
    //log the user out
    await updateUserIsBlocked(event.target.value, false);

    const newList = [...users];

    newList.forEach((u) => {
      if (u.email === event.target.value) {
        u.isBlocked = false;
      }
    });
    setUsers(newList);
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
                  {!u.isBlocked ? (
                    <button
                      type="button"
                      className="btn btn-danger ps-4 pe-4"
                      value={u.email}
                      onClick={handleBlock}
                    >
                      {" "}
                      Block
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-danger ps-4 pe-4"
                      value={u.email}
                      onClick={handleUnblock}
                    >
                      {" "}
                      Unblock
                    </button>
                  )}
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

export default BlockUnblock;
