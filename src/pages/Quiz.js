import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Quiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId || localStorage.getItem("userId");
  console.log(userId);
  const [timeLeft, setTimeLeft] = useState(20); // Temps limite en secondes
  const [isTimerActive, setIsTimerActive] = useState(true);


  useEffect(() => {
    if (timeLeft === 0) {
      console.log("⏳ Temps écoulé, passage à la question suivante !");
      setIsTimerActive(false); // Désactive le timer temporairement
      handleNextQuestion();
    }
  }, [timeLeft]); 
  

  useEffect(() => {
    if (!userId) {
      console.log("⚠️ Aucun userId trouvé, retour à la page d'accueil !");
      navigate("/");
    }
  }, [userId, navigate]);
  
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.go(1);
    };
  }, []);

  useEffect(() => {
    if (!isTimerActive || timeLeft <= 0) return;
  
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000); // Décrémente chaque seconde
  
    return () => clearInterval(timer);
  }, [isTimerActive, timeLeft]);
  
  
  useEffect(() => {
    document.addEventListener("contextmenu", (e) => e.preventDefault());
    return () => document.removeEventListener("contextmenu", (e) => e.preventDefault());
  }, []);
  
  useEffect(() => {
    if (location.state?.userId) {
      localStorage.setItem("userId", location.state.userId);
    }
  }, [location.state?.userId]);

  const fromAlmostThere = location.state?.fromAlmostThere || localStorage.getItem("fromAlmostThere") === "true";
  const resumedIndex = location.state?.resumedIndex || (fromAlmostThere ? 3 : 0);

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(location.state?.score || 0);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [userOpenAnswer, setUserOpenAnswer] = useState("");

  useEffect(() => {
    const savedQuestions = localStorage.getItem("quizQuestions");
    if (savedQuestions) {
      console.log("📥 Chargement des questions depuis localStorage !");
      setQuestions(JSON.parse(savedQuestions)); // Récupère les questions stockées
      setLoading(false);
    } else {
      const fetchQuestions = async () => {
        try {

          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/assign_questions`);
          const data = await response.json();
          setQuestions(data.questions);
          localStorage.setItem("quizQuestions", JSON.stringify(data.questions)); // Stocke les questions pour plus tard
        } catch (error) {
          console.error("❌ Erreur :", error.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchQuestions(); // Si elles ne sont pas en cache, fais la requête
    }
  }, []); // Ce useEffect s'exécute une seule fois lors du chargement du composant Quiz
  
  useEffect(() => {
    const savedIndex = localStorage.getItem("savedQuestionIndex");

    if (fromAlmostThere && savedIndex) {
      console.log("✅ Retour au quiz après AlmostThere !");
      setCurrentQuestionIndex(parseInt(savedIndex, 10));
      localStorage.removeItem("savedQuestionIndex");
    } else if (location.state?.resumedIndex !== undefined) {
      console.log("🎯 Reprise après EmailForm !");
      setCurrentQuestionIndex(location.state.resumedIndex);
    }
  }, []);

  useEffect(() => {
    console.log("🟢 Index mis à jour :", currentQuestionIndex);
  }, [currentQuestionIndex]);

  useEffect(() => {
    const blockDevTools = (event) => {
      if (event.ctrlKey && event.shiftKey && event.keyCode === 73) { // Ctrl + Shift + I
        event.preventDefault();
      }
      if (event.ctrlKey && event.keyCode === 85) { // Ctrl + U (View source)
        event.preventDefault();
      }
    };
  
    document.addEventListener("keydown", blockDevTools);
    return () => document.removeEventListener("keydown", blockDevTools);
  }, []);
  

  const handleAnswerClick = async (choiceId) => {
    setSelectedAnswerId(choiceId);
    setFeedback("");
  
    const currentQuestion = questions[currentQuestionIndex];
    const questionId = currentQuestion?.id;
  
    if (!userId || !questionId || !choiceId) {
      console.error("❌ Erreur : Infos manquantes !");
      return;
    }
  
    // // Vérifier si la question a déjà une réponse stockée
    const savedAnswers = JSON.parse(localStorage.getItem("userAnswers")) || {};
    if (savedAnswers[questionId]) {
      setFeedback("⚠️ Vous avez déjà répondu à cette question !");
      return;
   }
  
    try {
      console.log({ userId, questionId, choiceId });

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/correct_answer`, {
        //const response = await fetch(`http://127.0.0.1:8000/api/correct_answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, question_id: questionId, choice_id: choiceId }),
      });
  
      const data = await response.json();
      setFeedback(data.message);
  
      if (data.message.includes("Bonne réponse")) {
        setScore((prevScore) => prevScore + 1);
      }
  
      // Sauvegarder la réponse dans localStorage pour éviter la triche
      savedAnswers[questionId] = choiceId;
      localStorage.setItem("userAnswers", JSON.stringify(savedAnswers));
  
    } catch (error) {
      console.error("❌ Erreur d'envoi :", error.message);
    }
  };
  
  const handleOpenQuestionSubmit = async () => {
    if (!userOpenAnswer.trim()) return;
  
    const currentQuestion = questions[currentQuestionIndex];
    const questionId = currentQuestion?.id;
  
    // Vérifier si l'utilisateur a déjà répondu à cette question
    const savedAnswers = JSON.parse(localStorage.getItem("userAnswers")) || {};
    if (savedAnswers[questionId]) {
      setFeedback("⚠️ Vous avez déjà répondu à cette question !");
      return;
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/correct_answer`, {
        //const response = await fetch(`http://127.0.0.1:8000/api/correct_answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, question_id: questionId, user_answer: userOpenAnswer }),
      });
  
      const data = await response.json();
      setFeedback(data.message);
  
      if (data.is_correct) {
        setScore((prevScore) => prevScore + 1);
      }
  
      // // Sauvegarder la réponse pour empêcher de répondre à nouveau
      // savedAnswers[questionId] = userOpenAnswer;
      // localStorage.setItem("userAnswers", JSON.stringify(savedAnswers));
  
    } catch (error) {
      console.error("❌ Erreur d'envoi :", error.message);
    }
  };
  
  const handleNextQuestion = () => {
    setFeedback("");
    setSelectedAnswerId(null);
    setUserOpenAnswer("");
  
    const nextIndex = currentQuestionIndex + 1;
  
    if (nextIndex < questions.length) {
      if (nextIndex === 3) {
        localStorage.setItem("savedQuestionIndex", 3);
        navigate("/almost-there", { state: { score, resumedIndex: 3 } });
      } else if (nextIndex === 4) {
        navigate("/email", { state: { score, resumedIndex: 4 } });
      } else {
        setCurrentQuestionIndex(nextIndex);
        setTimeLeft(20); // 🔄 Réinitialisation du timer
        setIsTimerActive(true);
      }
    } else {
      console.log("🏁 Fin du quiz ! Nettoyage du cache et redirection...");
  
      // 🔥 Suppression du cache AVANT la redirection
      localStorage.removeItem("savedQuestionIndex"); // Ou d'autres clés
  
      // 🚀 Redirection vers les résultats
      navigate("/results", { state: { score, sources: questions.map(q => q.source).filter(Boolean) } });
    }
  };
  
  
  

  if (loading) return <p>Chargement des questions...</p>;
  if (questions.length === 0) return <p>Aucune question disponible.</p>;
  if (!questions[currentQuestionIndex]) return <p>Chargement de la question...</p>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-primary-light p-6 text-center">
        <div className="text-lg font-bold text-red-600 mt-4">
  ⏳ Temps restant : {timeLeft} secondes
</div>

      <h2 className="text-3xl font-extrabold text-monochrome-dark mb-6">
        {currentQuestion.question_text}
      </h2>

      {currentQuestion.is_open_question ? (
        <div className="w-full max-w-lg">
          <input
            type="text"
            placeholder="Votre réponse..."
            value={userOpenAnswer}
            onChange={(e) => setUserOpenAnswer(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg text-center"
            disabled={feedback !== ""}
          />
          <button
            onClick={handleOpenQuestionSubmit}
            className="mt-4 px-6 py-3 bg-secondary text-white font-bold rounded-lg shadow-md transition-all duration-300"
            disabled={feedback !== ""}
          >
            Valider
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
          {currentQuestion.choices?.map((choice) => (
            <button
              key={choice.id}
              onClick={() => handleAnswerClick(choice.id)}
              className={`w-full h-20 flex items-center justify-center rounded-lg text-lg font-semibold transition-all duration-300 shadow-md
                ${
                  selectedAnswerId
                    ? choice.id === currentQuestion.correct_choice_id
                      ? "bg-green-500 text-white border-2 border-green-700"
                      : "bg-red-500 text-white border-2 border-red-700"
                    : "bg-white border-2 border-gray-300 hover:bg-gray-200"
                }`}
              disabled={selectedAnswerId !== null}
            >
              {choice.choice_text}
            </button>
          ))}
        </div>
      )}

      {feedback && (
        <div className="mt-6 p-4 rounded-md text-lg font-bold shadow-md transition-all duration-300 bg-gray-100 border border-gray-500 text-gray-700">
          {feedback}
        </div>
      )}

      {(selectedAnswerId || userOpenAnswer) && (
        <button
          onClick={handleNextQuestion}
          className="mt-8 px-6 py-3 bg-secondary text-white font-bold rounded-lg shadow-md transition-all duration-300"
        >
          SUIVANT
        </button>
      )}
    </div>
  );
}

export default Quiz;
