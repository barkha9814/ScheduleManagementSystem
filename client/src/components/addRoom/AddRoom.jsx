import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const AddRoom = () => {

    const navigate = useNavigate()

    const [formValues, setFormValues] = useState({ roomId: "", roomName: ""});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };


    const handleSubmit =  (e) => {
        e.preventDefault();
        const { roomId, roomName} = formValues;
        if(roomId !== "" && roomName !== ""){
            createRoom( roomId, roomName)
        }else{
            console.log("Please fill all the Fields");
        }
    
        
    }

    const createRoom = async ( roomId, roomName) => {
        const res = await fetch("/api/v1/room/add-room", {
            method: "POST",
            headers: { 
                    'Accept': 'application/json',
                    "Content-Type": "application/json" 
                },
            body: JSON.stringify({  roomId, roomName })
        });
    
        if(res.success === false){
            console.log(res.data);
            return null
        }
        else{
            const data = await res.json();
            console.log("Room Added Succesfully", data.data);
            navigate("/room",{state: 'success'});
        }
    }

    return (
        <>
            <div className='form-container container-fluid'>
                <div className="row">
                    <h1 className='mb-4'>Add Room</h1>
                    <form  className='form' noValidate onSubmit={(event) => handleSubmit(event)}>
                        <div className="form-group w-50 mb-3">
                            <label htmlFor="roomId">Room Id</label>
                            <input type="text" className="form-control"  name="roomId" id="roomId" aria-label="roomId" placeholder="Enter Room ID" 
                            value={formValues.roomId}
                            onChange={(e) => handleChange(e)} />
                        </div>
                        <div className="form-group w-50  mb-3">
                            <label htmlFor="roomName">Room Name</label>
                            <input type="text" className="form-control" name="roomName" id="roomName" aria-label="roomName" placeholder="Enter Room Name" 
                            value={formValues.roomName}
                            onChange={(e) => handleChange(e)}/>
                        </div>
                        <button type="submit" className="btn btn-success">Add Room</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default AddRoom