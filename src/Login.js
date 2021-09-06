import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";

function Login()
{
    const history = useHistory();
    var [userName, setUsername] = useState("");
    var [password, setPassword] = useState("");
    const handleUserName = (event) =>
    {
        setUsername(event.target.value);
    }
    const handlePassword = (event) =>
    {
        setPassword(event.target.value);
    }
    const login = () =>
    {
        Axios.post("http://localhost:4000/api/syllabus/login", {
            userName: userName,
            password: password
        })
        .then((result) => {
            if(result.status === 200) {
                const token = result.data[0].token;
                sessionStorage.setItem("token", token);
                console.log(token);
                history.push("/syllabus")
            }
        })
    }
    return (
		<div>
            <h1>Login</h1>
			<input type="text" name="userName" placeholder="Enter your username" onChange={handleUserName}/><br/>
			<input type="password" name="pwd" id="pwd" placeholder="Enter your password" onChange={handlePassword}/>
			<br></br><button onClick={login}>Login</button>
		</div>
    );
}

export default Login;