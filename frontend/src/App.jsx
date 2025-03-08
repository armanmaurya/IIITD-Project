import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import ResultPage from "./ResultPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/results" element={<ResultPage />} />
      </Routes>
    </div>
  );
}

export default App;
