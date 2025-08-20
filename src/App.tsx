import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import CandidateManagement from "./pages/CandidateManagement";
import Dashboard from "./pages/Dashboard";
import InterviewAnalysis from "./pages/InterviewAnalysis";
import InterviewConducting from "./pages/InterviewConducting";
import InterviewReports from "./pages/InterviewReports";
import InterviewSchedule from "./pages/InterviewSchedule";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/candidates" element={<CandidateManagement />} />
        <Route path="/interviews" element={<InterviewSchedule />} />
        <Route path="/interview/:id" element={<InterviewConducting />} />
        <Route path="/reports" element={<InterviewReports />} />
        <Route path="/analysis" element={<InterviewAnalysis />} />
      </Routes>
    </Layout>
  );
}

export default App;
