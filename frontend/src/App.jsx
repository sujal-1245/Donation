import { BrowserRouter, Routes, Route } from "react-router-dom";
import PaymentForm from "./PaymentForm";
import SuccessPage from "./SuccessPage";
import FailurePage from "./FailurePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PaymentForm />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/failure" element={<FailurePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
