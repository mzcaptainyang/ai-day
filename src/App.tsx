import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import AIInterviewQuestions from "./pages/AIInterviewQuestions";
import CandidateManagement from "./pages/CandidateManagement";
import Dashboard from "./pages/Dashboard";
import InterviewAnalysis from "./pages/InterviewAnalysis";
import InterviewConducting from "./pages/InterviewConducting";
import InterviewReports from "./pages/InterviewReports";
import InterviewSchedule from "./pages/InterviewSchedule";
import ProjectHighlights from "./pages/ProjectHighlights";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/highlights" replace />} />
        <Route path="/highlights" element={<ProjectHighlights />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/candidates" element={<CandidateManagement />} />
        <Route path="/interviews" element={<InterviewSchedule />} />
        <Route path="/ai-questions" element={<AIInterviewQuestions />} />
        <Route path="/interview/:id" element={<InterviewConducting />} />
        <Route path="/reports" element={<InterviewReports />} />
        <Route path="/analysis" element={<InterviewAnalysis />} />
      </Routes>
    </Layout>
  );
}

export default App;
