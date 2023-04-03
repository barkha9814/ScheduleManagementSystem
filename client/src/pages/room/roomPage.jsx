import React, { useEffect, useState } from 'react'
import '../room/roomPage.scss'
import { Link, useNavigate } from 'react-router-dom'

function RoomPage() {
  const navigate = useNavigate();

  const [roomData, setRoomData] = useState([]);
  const [deletedRoom, setDeletedRoom] = useState([]);

  const cols = [
    {colName: 'Id'},
    {colName: 'Room ID'},
    {colName: 'Room Name'},
  ]

  const getRoomByID = async (roomId) => {
    const res = await fetch(`/api/v1/room/${roomId}`, {
      method: "GET",
      headers: { 
              'Accept': 'application/json',
          },
    });

    const data = await res.json()
    if(data.success === false){
        console.log(data.message);
        return null
    }else{
        return data
    }
  }

  const deleteRoom = async (e, data) => {
    e.preventDefault()
    const room = await getRoomByID(data.roomId)
    if(room && room.data && Object.keys(room.data).length !== 0){
      const res = await fetch(`/api/v1/room/${room.data.roomId}`, {
        method: "DELETE",
        headers: { 
                'Accept': 'application/json',
            },
      });
      if(room.success === false){
        console.log(room.message);
        return null
      }
      else{
        const data = await res.json()
        console.log("room Deleted ", data.data)
        setDeletedRoom(data.data)
      }
    }
  }

  const updateRoom = async (e, data) => {
    e.preventDefault()
    const room = await getRoomByID(data.roomId)
    if(room && room.data && Object.keys(room.data).length !== 0){
      navigate("/room/updateroom", {state: {room: room}})
    }
  }

  const getAllRoom = async () => {
    const res = await fetch("/api/v1/room/get-all-rooms", {
      method: "GET",
      headers: { 
              'Accept': 'application/json',
          },
    });

    if(res.success === false){
      console.log(res.data);
    }else{
      const data = await res.json()
      setRoomData(data.data)
    }
  }

  useEffect(() => {
    getAllRoom()
  }, [deletedRoom])

  return (
    <>
      <h1 className='mb-5'>Room Page</h1>
      <button className='AddBtn mb-4'><Link to='/room/addroom'>Add Room</Link></button>
      <table className='userTable text-black'>
        <thead className='text-center'>
            <tr>
              {cols && Array.isArray(cols) && cols.map((col, index) => (
                <th
                  key={index}
                  className='tableHeading'
                  >
                  {col.colName}
                </th>
              ))}
              <th colSpan={2} className='tableHeading'>Action</th>
            </tr>
        </thead>
        <tbody>
        {
          roomData && Array.isArray(roomData) && roomData.length > 0?
            roomData.map((room, index) => {
                  return (
                  <tr key={index}>
                    {
                      Object.keys(room).map((cell, key) => {
                        return(
                          <td key={key}
                            className='tableData'
                            >
                              {
                                cell === "_id" ?(index + 1) : room[cell]
                              }
                            </td>
                          )
                      })
                    }
                    <td className='tableData'><button className='deleteBtn' onClick={(e) => deleteRoom(e, room)}><i className='bx bx-message-square-x'></i></button></td>
                    <td className='tableData'><button className='updateBtn' onClick={(e) => updateRoom(e, room)}><i className='bx bx-edit-alt'></i></button></td>
                  </tr>
            )}
          ):
          <tr className='text-center text-white'>
            <td colSpan={6}>No Rooms to display</td>
          </tr>
          }
        </tbody>
      </table>
    </>
  )
}

export default RoomPage