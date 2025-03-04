import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import StudyDeck from "./pages/studyDeck";
import EditDeck from "./pages/editdeck";

// Protected Routes
import PrivateRoute from "./PrivateRoute";
import AuthProvider from "./config/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
            <Route path="study/:deckId" element={<PrivateRoute><StudyDeck/></PrivateRoute>} />
            <Route path = "edit-deck/:deckID" element = {<PrivateRoute><EditDeck/></PrivateRoute>} />
            <Route path="*" element={<h1>Not Found</h1>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
