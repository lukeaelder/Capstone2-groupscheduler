import Dashboard from "./Dashboard";
import Navbar from "./Navbar";
import Group from "./Group";
import Signup from "./Signup";
import Login from "./Login"
import NewGroup from "./NewGroup";
import SchedulerApi from "./api";
import Chatroom from "./Chatroom";
import React, {useState, useEffect} from "react";
import UserContext from "./UserContext";
import jwt from "jsonwebtoken";
import useLocalStorage from "./useLocalStorage";
import {BrowserRouter, Switch, Redirect} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoggedOutRoute from "./LoggedOutRoute";
export const token_storage = "scheduler-token";

function App() {

  const [token, setToken] = useLocalStorage(token_storage);
  const [userGroups, setUserGroups] = useState([]);
  const [curUser, setCurUser] = useState(null);
  const [navHidden, setNavHidden] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(function loadUser(){
    async function getCurUser(){
      if (token) {
        let {username} = jwt.decode(token);
        try {
          SchedulerApi.token = token;
          let resUser = await SchedulerApi.getUser(username);
          setCurUser(resUser);
        } catch(err) {
          setCurUser(null)
        }
        try {
          let resGroups = await SchedulerApi.getGroups(username);
          if (resGroups.length) {
            setUserGroups(resGroups);
          }
        } catch(err) {
          setUserGroups(null);
        }
      }
      setUserLoaded(true);
    }
    setUserGroups(null)
    setUserLoaded(false);
    getCurUser();
  }, [token])

  const signup = async (inputData) => {
    try {
      let token = await SchedulerApi.signup(inputData);
      setToken(token);
      return {success: true};
    } catch (err) {
      return {success: false};
    }
  }

  const login = async (inputData) => {
    try {
      let token = await SchedulerApi.login(inputData);
      setToken(token);
      return { success: true};
    } catch (err) {
      return { success: false };
    }
  }

  const createGroup = async (inputData) => {
    try {
      await SchedulerApi.createGroup(inputData);
      await refreshGroups();
      return { success: true};
    } catch (err) {
      return { success: false };
    }
  }

  const getGroups = async (username) => {
    try {
      let groups = await SchedulerApi.getGroups(username);
      return groups;
    } catch (err) {
      return {success: false};
    }
  }

  const getGroup = async (inputData) => {
    try {
      let group = await SchedulerApi.getGroup(inputData);
      return group;
    } catch (err) {
      return false;
    }
  }

  const refreshGroups = async () => {
    let {username} = jwt.decode(token);
    let groups = await SchedulerApi.getGroups(username);
    if (groups.length) {
      setUserGroups(groups);
    } else {
      setUserGroups(null)
    }
  }

  const leaveGroup = async (inputData) => {
    try {
      await SchedulerApi.leaveGroup(inputData);
      await refreshGroups();
      return { success: true };
    } catch (err) {
      return {success: false};
    }
  }

  const addMember = async (inputData) => {
    try {
      await SchedulerApi.addMember(inputData);
      return {success: true};
    } catch (err) {
      return {success: false};
    }
  }

  const addAnnouncement = async (inputData) => {
    try {
      await SchedulerApi.addAnnouncement(inputData);
      return {success: true};
    } catch {
      return {success: false};
    }
  }

  const removeAnnouncement = async (inputData) => {
    try {
      await SchedulerApi.remAnnouncement(inputData);
      return {success: true};
    } catch {
      return {success: false};
    }
  }

  const addTodo = async (inputData) => {
    try {
      await SchedulerApi.addTodo(inputData);
      return {success: true};
    } catch {
      return {success: false};
    }
  }

  const changeTodo = async (inputData) => {
    try {
      await SchedulerApi.changeTodo(inputData);
      return {success: true};
    } catch {
      return {success: false};
    }
  }

  const logout = () => {
    setUserGroups(null);
    setCurUser(null);
    setToken(null);
  }

  return (
    <>
      <BrowserRouter>
        <UserContext.Provider value={{curUser, setCurUser, userGroups}}>
          <Navbar navHidden={navHidden} setNavHidden={setNavHidden} userLoaded={curUser} logout={logout}/>
          <div className={`${navHidden ? "closed" : "open"}-content-wrapper`}>
            <div className="main-content">
              <Switch>
                <LoggedOutRoute exact path="/signup">
                  <Signup signup={signup}/>
                </LoggedOutRoute>
                <LoggedOutRoute exact path="/login">
                  <Login login={login}/>
                </LoggedOutRoute>
                <ProtectedRoute exact path="/dashboard">
                  <Dashboard/>
                </ProtectedRoute>
                <ProtectedRoute exact path="/room/:roomID">
                  <Chatroom/>
                </ProtectedRoute>
                <ProtectedRoute exact path="/groups/new">
                  <NewGroup createGroup={createGroup}/>
                </ProtectedRoute>
                <ProtectedRoute exact path="/groups/:id">
                  <Group changeTodo={changeTodo} addTodoS={addTodo} getGroup={getGroup} leaveGroup={leaveGroup} addMember={addMember} addAnnouncement={addAnnouncement} removeAnnouncement={removeAnnouncement}/>
                </ProtectedRoute>
                <Redirect to="/login" />
              </Switch>
            </div>
          </div>
        </UserContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
