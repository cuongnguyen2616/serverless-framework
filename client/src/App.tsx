import { BrowserRouter, Route, Routes } from "react-router-dom";
import "antd/dist/antd.css";
import Login from "./components/Login/Login";
import Verify from "./components/Verify/Verify";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/verify" element={<Verify />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
