import { Route, Routes } from "react-router-dom";
import { Home } from "./components/Home";
import { NoteEdit } from "./components/NoteEdit";
import { TagCloud } from "./components/TagCloud";
import { SignIn } from "./components/SignIn";
import { SignUp } from "./components/SignUp";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route
          path="/signin"
          element={!isAuthenticated ? <SignIn /> : <Home />}
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignUp /> : <Home />}
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit"
          element={
            <ProtectedRoute>
              <NoteEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/note/:id"
          element={
            <ProtectedRoute>
              <NoteEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tag"
          element={
            <ProtectedRoute>
              <TagCloud />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
