import React from "react";

import PopupForm from "./PopupForm";

const ModifyUser = ({ users, setUsers }) => {
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
                  <PopupForm
                    users={users}
                    setUsers={setUsers}
                    currentEmail={u.email}
                  />
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

export default ModifyUser;
