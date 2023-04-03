import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const UpdateUser = () => {
    const location = useLocation()
    let userData = location.state

    const navigate = useNavigate()

    const [formValues, setFormValues] = useState({ userName: userData.user.data.userName, userEmail: userData.user.data.userEmail});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };


    const handleSubmit =  (e) => {
        e.preventDefault();
        const { userName, userEmail} = formValues;
        if(userName !== "" && userEmail !== ""){
            updateUser(userName, userEmail)
        }else{
            console.log("Please fill all the Fields");
        }
    
        
    }

    const updateUser = async (userName, userEmail) => {
        let userId = userData &&  userData.user &&  userData.user.data &&  userData.user.data.userId
        const res = await fetch(`/api/v1/users/${userId}`, {
            method: "PUT",
            headers: { 
                    'Accept': 'application/json',
                    "Content-Type": "application/json" 
                },
            body: JSON.stringify({userName, userEmail })
        });
        if(res.success === false){
            console.log(res.data);
            return null
        }
        else{
            const data = await res.json()
            console.log("user Updated ", data.data)
            navigate("/user",{state: 'success'});
        }
    }

    return (
        <>
            <div className='form-container container-fluid'>
                <div className="row">
                    <h1 className='mb-4'>Update User</h1>
                    <form  className='form' noValidate onSubmit={(event) => handleSubmit(event)}>
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
                        <button type="submit" className="btn btn-success">Update User</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default UpdateUser