import { BrowserRouter, Routes, Route } from "react-router-dom";
import PomodoroPage from "./pages/PomodoroPage";
import FullscreenCountdown from "./pages/FullscreenCountdown";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<PomodoroPage />} />
        {/* Ruta de pantalla completa */}
        <Route path="/countdown" element={<FullscreenCountdown />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
