import './App.scss';
import 'boxicons/css/boxicons.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/homePage';
import User from './pages/userPage';
import Room from './pages/roompage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<AppLayout />}>
                    <Route index element={<Home />} />
                    <Route path='/user' element={<User />} />
                    <Route path='/room' element={<Room />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;