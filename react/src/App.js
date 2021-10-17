import "./App.css";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import DeleteUser from "./components/DeleteUser";
import BlockUnblock from "./components/BlockUnblock";
import ModifyUser from "./components/ModifyUser";
import DeletePost from "./components/DeletePost";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUsers } from "./data/repository";

function App() {
  const [users, setUsers] = useState(null);

  //useEffect hook to sync users with database
  useEffect(() => {
    const loadUsers = async () => {
      const currentUsers = await getUsers();
      setUsers(currentUsers);
    };
    loadUsers();
  }, []);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Navbar />
            <Dashboard />
          </Route>
          <Route exact path="/delete-user">
            <Navbar />
            <DeleteUser users={users} setUsers={setUsers} />
          </Route>
          <Route exact path="/block-unblock-user">
            <Navbar />
            <BlockUnblock users={users} setUsers={setUsers} />
          </Route>
          <Route exact path="/modify-user-details">
            <Navbar />
            <ModifyUser users={users} setUsers={setUsers} />
          </Route>
          <Route exact path="/delete-post">
            <Navbar />
            <DeletePost users={users} setUsers={setUsers} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
