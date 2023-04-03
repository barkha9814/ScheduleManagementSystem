import React, { useEffect, useState } from 'react'
import '../user/userPage.scss'
import { Link, useNavigate } from 'react-router-dom'


const UserPage = () => {

  const navigate = useNavigate();

  const [userData, setUserData] = useState([]);
  const [deletedUser, setDeletedUser] = useState([]);

  const cols = [
    {colName: 'ID'},
    {colName: 'Name'},
    {colName: 'UserName'},
    {colName: 'Email'},
  ]

  const getUserByID = async (userId) => {
    const res = await fetch(`/api/v1/users/${userId}`, {
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

  const deleteUser = async (e, data) => {
    e.preventDefault()
    const user = await getUserByID(data.userId)
    if(user && user.data && Object.keys(user.data).length !== 0){
      const res = await fetch(`/api/v1/users/${user.data.userId}`, {
        method: "DELETE",
        headers: { 
                'Accept': 'application/json',
            },
      });
      if(user.success === false){
        console.log(user.message);
        return null
      }
      else{
        const data = await res.json()
        console.log("user Deleted ", data.data)
        setDeletedUser(data.data)
      }
    }
  }

  const updateUser = async (e, data) => {
    e.preventDefault()
    const user = await getUserByID(data.userId)
    if(user && user.data && Object.keys(user.data).length !== 0){
      navigate("/user/updateuser", {state: {user: user}})
    }
  }

  const getAllUser = async () => {
    const res = await fetch("/api/v1/users/get-all-users", {
      method: "GET",
      headers: { 
              'Accept': 'application/json',
          },
    });

    if(res.success === false){
      console.log(res.data);
    }else{
      const data = await res.json()
      setUserData(data.data)
    }
  }

  useEffect(() => {
    getAllUser()
  }, [deletedUser])

  return (
    <>
      <h1 className='mb-5'>User Page</h1>
      <button className='AddBtn mb-4'><Link to='/user/adduser'>Add User</Link></button>
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
          userData && Array.isArray(userData) && userData.length > 0?
            userData.map((user, index) => {
                  return (
                  <tr key={index}>
                    {
                      Object.keys(user).map((cell, key) => {
                        return(
                          <td key={key}
                            className='tableData'
                            >
                              {
                                cell === "_id" ?(index + 1) : user[cell]
                              }
                            </td>
                          )
                      })
                    }
                    <td className='tableData'><button className='deleteBtn' onClick={(e) => deleteUser(e, user)}><i className='bx bx-message-square-x'></i></button></td>
                    <td className='tableData'><button className='updateBtn' onClick={(e) => updateUser(e, user)}><i className='bx bx-edit-alt'></i></button></td>
                  </tr>
            )}
          ):
          <tr className='text-center text-white'>
            <td colSpan={6}>No User to display</td>
          </tr>
          }
        </tbody>
      </table>
    </>
  )
}

export default UserPage