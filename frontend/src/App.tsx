import { Route, Routes } from "react-router";
import { Home } from "./components/Home";
import { NoteEdit } from "./components/NoteEdit";
import { TagCloud } from "./components/TagCloud";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit" element={<NoteEdit />} />
        <Route path="/tag" element={<TagCloud />} />
      </Routes>
    </>
  );
}

export default App;
