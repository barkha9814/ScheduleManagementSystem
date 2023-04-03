import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const AddUser = () => {

    const navigate = useNavigate()

    const [formValues, setFormValues] = useState({ userId: "", userName: "", userEmail: ""});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };


    const handleSubmit =  (e) => {
        e.preventDefault();
        const { userId, userName, userEmail} = formValues;
        if(userId !== "" && userName !== "" && userEmail !== ""){
            createUser(userId, userName, userEmail)
        }else{
            console.log("Please fill all the Fields");
        }
    
        
    }

    const createUser = async (userId, userName, userEmail) => {
        const res = await fetch("/api/v1/users/add-user", {
            method: "POST",
            headers: { 
                    'Accept': 'application/json',
                    "Content-Type": "application/json" 
                },
            body: JSON.stringify({ userId, userName, userEmail })
        });
    
        if(res.status === 200){
            const data = await res.json();
            console.log("User Added Succesfully", data.data);
            navigate("/user",{state: 'success'});
        }
        else{
            console.log("Failed to add user");
        }
    }

    return (
        <>
            <div className='form-container container-fluid'>
                <div className="row">
                    <h1 className='mb-4'>Add User</h1>
                    <form  className='form' noValidate onSubmit={(event) => handleSubmit(event)}>
                        <div className="form-group w-50 mb-3">
                            <label htmlFor="userId">Name</label>
                            <input type="text" className="form-control"  name="userId" id="userId" aria-label="userId" placeholder="Enter name" 
                            value={formValues.userId}
                            onChange={(e) => handleChange(e)} />
                        </div>
                        <div className="form-group w-50  mb-3">
                            <label htmlFor="userName">UserName</label>
                            <input type="text" className="form-control" name="userName" id="userName" aria-label="userName" placeholder="Enter username" 
                            value={formValues.userName}
                            onChange={(e) => handleChange(e)}/>
                        </div>
                        <div className="form-group w-50 mb-3">
                            <label htmlFor="userEmail">Email address</label>
                            <input type="userEmail" className="form-control" name="userEmail" id="userEmail" aria-label="userEmail" placeholder="Enter email"
                            value={formValues.userEmail}
                            onChange={(e) => handleChange(e)} />
                            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                        <button type="submit" className="btn btn-success">Add User</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default AddUser