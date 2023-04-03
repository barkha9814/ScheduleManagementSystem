import './App.scss';
import 'boxicons/css/boxicons.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/dashboard/homePage';
import User from './pages/user/userPage';
import Room from './pages/room/roomPage';
import AddUser from './components/addUser/addUser';
import UpdateUser from './components/updateUser/UpdateUser';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<AppLayout />}>
                    <Route index element={<Home />} />
                    <Route path='/user' element={<User />} />
                    <Route path='/user/adduser' element={<AddUser />} />
                    <Route path='/user/updateuser' element={<UpdateUser />} />
                    <Route path='/room' element={<Room />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;