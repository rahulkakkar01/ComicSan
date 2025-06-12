import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

import Details from "./pages/MangaDetails";
import Reader from "./pages/Reader";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/manga/:id" element={<Details />} />
        <Route path="/read/:id" element={<Reader />} />
      </Routes>
    </BrowserRouter>
  );
}
