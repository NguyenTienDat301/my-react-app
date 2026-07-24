import { BrowserRouter, Routes, Route } from "react-router-dom";

import ThiDua from "./pages/ThiDua";
import WeekList from "./pages/WeekList";
import WeekDetail from "./pages/WeekDetail";
import UnitDetail from "./pages/UnitDetail";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ThiDua />} />

        <Route path="/weeks" element={<WeekList />} />

        <Route path="/weeks/:weekId" element={<WeekDetail />} />

        <Route
          path="/weeks/:weekId/unit/:scoreId"
          element={<UnitDetail />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;