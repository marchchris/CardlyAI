import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Login from "./pages/login";
import Register from "./pages/register";

// Protected Routes
import PrivateRoute from "./PrivateRoute";
import AuthProvider from "./config/AuthProvider";

function App() {
  return (
<AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<h1>Home Page</h1>} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path = "dashboard" element={<PrivateRoute><h1>Welcome to Dashboard Lol</h1></PrivateRoute>} />

            <Route path="*" element={<h1>Not Found</h1>} />

          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
