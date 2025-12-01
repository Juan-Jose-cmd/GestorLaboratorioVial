import Home from "../views/Home/Home";
import Login from "../views/Login/Login";
import Register from "../views/Register/Register";

export const PublicRoutes = [
    { path: "/", element: <Home /> },
    { path: '/login', element: <Login />},
    { path: '/register', element: <Register />}
];
