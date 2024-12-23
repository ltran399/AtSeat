import {
    BrowserRouter, Routes,
    Route, Navigate
} from "react-router-dom"
import { useContext } from "react";
import { AuthContext } from "./authContext";
import AdminLanding from "./pages/AdminLanding"
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Restaurant from "./pages/Restaurant";
import Reservations from "./pages/Reservations";

function App() {
    const { user } = useContext(AuthContext);

    const ProtectedRoute = ({ children, redirectTo }) => {
        if (!user) {  // Simplified check for user
            return <Navigate to={redirectTo} />;
        }
        if (user.isAdmin) {  // Separate check for admin
            return <Navigate to="/admin/dashboard" />;
        }
        return children;
    };

    const AdminProtectedRoute = ({ children, redirectTo }) => {
        const { user } = useContext(AuthContext);
        console.log("Protected Route - User Data:", user); // Debug log
        
        if (!user || !user.isAdmin) {
            console.log("Redirecting - No user or not admin"); // Debug log
            return <Navigate to={redirectTo} />;
        }
        return children;
    };

    return (
        <BrowserRouter>
    <Routes>
        <Route path="/" element={
            <ProtectedRoute redirectTo="/userLogin">
                <Home />
            </ProtectedRoute>
        } />
        <Route path="/landing" element={<Landing />} />
        <Route path="/adminLogin" element={<Login type="admin" />} />
        <Route path="/restaurant/:id" element={
            <ProtectedRoute redirectTo="/userLogin">
                <Restaurant type="user"/>
                <Restaurant />
            </ProtectedRoute>
        } />
        <Route path="/reservations" element={
            <ProtectedRoute redirectTo="/userLogin">
                <Reservations />
            </ProtectedRoute>
        } />
        <Route path="/adminRegister" element={<Register type="admin" />} />
        <Route path="/userLogin" element={<Login type="user" />} />
        <Route path="/userRegister" element={<Register type="user" />} />
        <Route path="/admin/dashboard" element={
            <AdminProtectedRoute redirectTo="/adminLogin">
                <AdminLanding />
            </AdminProtectedRoute>
        } />
        {/* Add the missing /admin/reservations route */}
        <Route path="/admin/reservations" element={
            <AdminProtectedRoute redirectTo="/adminLogin">
                <Reservations />
            </AdminProtectedRoute>
        } />
    </Routes>
        </BrowserRouter>
)};

export default App;
