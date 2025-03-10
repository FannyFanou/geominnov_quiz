import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Intro from "./pages/Intro";
import Quiz from "./pages/Quiz";
import Score from "./pages/Score";
import ThankYou from "./pages/ThankYou";
import EmailForm from "./pages/EmailForm";
import AlmostThere from "./pages/AlmostThere";
import AdminPanel from "./admin/AdminPanel";
import QuestionForm from "./admin/QuestionForm";
import EditQuestion from "./admin/EditQuestion";
import ParticipantsList from "./admin/Participants";
import AdminLogin from "./admin/AdminLogin";
import Sources from "./pages/Source";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/intro" element={<Intro />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/email" element={<EmailForm />} />
        <Route path="/results" element={<Score />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/almost-there" element={<AlmostThere />} />
        <Route path="/sources" element={<Sources/>} />



        <Route path="/questions" element={<AdminPanel/>} />
        <Route path="/create-question" element={<QuestionForm/>} />
        <Route path="/edit-question/:id" element={<EditQuestion/>} />
        <Route path="/participants" element={<ParticipantsList/>} />


        <Route path="/login" element={<AdminLogin/>} />



        

        
      </Routes>
    </Router>
  );
}

export default App;
