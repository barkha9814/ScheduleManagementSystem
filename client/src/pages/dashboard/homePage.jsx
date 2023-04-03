import React, { useEffect, useState } from 'react'
import '../dashboard/homePage.scss'

const HomePage = () => {

  const [userCount, setUserCount] = useState(0);

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
      setUserCount(data.data.length)
    }
  }

  useEffect(() => {
    getAllUser()
  }, [])


  return (
    <div className='container-fluid'>
      <h1 className='mb-5'>Dashboard</h1>
      <div className='userDiv'>
        <small><p>Users</p></small>
        <b><p className='text-center'>{userCount}</p></b>
      </div>
    </div>
  )
}

export default HomePage