import { BrowserRouter, Routes, Route } from "react-router-dom";
import PomodoroPage from "./pages/PomodoroPage/PomodoroPage";
import FullscreenCountdown from "./pages/FullscreenCountdown";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PomodoroPage />} />
        <Route path="/countdown" element={<FullscreenCountdown />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
