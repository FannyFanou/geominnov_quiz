import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

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

import './index.css'; 

function App() {
  useEffect(() => {
    const preloadQuestions = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/assign_questions`);

        //const response = await fetch(`http://127.0.0.1:8000/api/assign_questions`);
        const data = await response.json();
        localStorage.setItem("quizQuestions", JSON.stringify(data.questions)); // Stocke les questions dans localStorage
        console.log("Questions préchargées en arrière-plan !");
      } catch (error) {
        console.error("Erreur lors du préchargement des questions:", error.message);
      }
    };
  
    const savedQuestions = localStorage.getItem("quizQuestions");
    if (!savedQuestions) {
      preloadQuestions(); // Lance le préchargement uniquement si les questions ne sont pas encore stockées
    } else {
      console.log("Questions déjà présentes dans localStorage");
    }
  }, []); // Ce useEffect s'exécute une seule fois, au chargement initial de l'application
  

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
        <Route path="/sources" element={<Sources />} />

        <Route path="/questions" element={<AdminPanel />} />
        <Route path="/create-question" element={<QuestionForm />} />
        <Route path="/edit-question/:id" element={<EditQuestion />} />
        <Route path="/participants" element={<ParticipantsList />} />

        <Route path="/login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
