import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Details from "./pages/MangaDetails";
import Reader from "./pages/Reader";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/manga/:id" element={<Details />} />
        <Route path="/read/:chapterId" element={<Reader />} />
      </Routes>
    </Router>
  );
}

export default App;
