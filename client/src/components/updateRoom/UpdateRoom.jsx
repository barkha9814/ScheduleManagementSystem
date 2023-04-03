import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const UpdateRoom = () => {
    const location = useLocation()
    let roomData = location.state

    const navigate = useNavigate()

    const [formValues, setFormValues] = useState({ roomName: roomData.room.data.roomName});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };


    const handleSubmit =  (e) => {
        e.preventDefault();
        const { roomName} = formValues;
        if(roomName !== ""){
            updateUser(roomName)
        }else{
            console.log("Please fill all the Fields");
        }
    
        
    }

    const updateUser = async (roomName) => {
        let roomId = roomData &&  roomData.room &&  roomData.room.data &&  roomData.room.data.roomId
        const res = await fetch(`/api/v1/room/${roomId}`, {
            method: "PUT",
            headers: { 
                    'Accept': 'application/json',
                    "Content-Type": "application/json" 
                },
            body: JSON.stringify({roomName})
        });
        if(res.success === false){
            console.log(res.data);
            return null
        }
        else{
            const data = await res.json()
            console.log("Room Updated ", data.data)
            navigate("/room",{state: 'success'});
        }
    }

    return (
        <>
            <div className='form-container container-fluid'>
                <div className="row">
                    <h1 className='mb-4'>Update Room</h1>
                    <form  className='form' noValidate onSubmit={(event) => handleSubmit(event)}>
                        <div className="form-group w-50  mb-3">
                            <label htmlFor="roomName">Room Name</label>
                            <input type="text" className="form-control" name="roomName" id="roomName" aria-label="roomName" placeholder="Enter username" 
                            value={formValues.roomName}
                            onChange={(e) => handleChange(e)}/>
                        </div>
                        <button type="submit" className="btn btn-success">Update Room</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default UpdateRoom