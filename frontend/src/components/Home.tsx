import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { NotesGrid } from "./NotesGrid";

export const Home = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div style={{ padding: "2rem" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          borderBottom: "1px solid #eee",
          paddingBottom: "1rem",
        }}
      >
        <h1>NotesVault</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span>Welcome, {user?.username}!</span>
          <button
            onClick={handleLogout}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <nav style={{ marginBottom: "2rem" }}>
        <Link
          to="/edit"
          style={{
            marginRight: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
          }}
        >
          Create Note
        </Link>
        <Link
          to="/tag"
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#28a745",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
          }}
        >
          View Tags
        </Link>
      </nav>

      <main>
        <NotesGrid />
      </main>
    </div>
  );
};
