import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Results() {
  const navigate = useNavigate();
  const location = useLocation();


  // Récupération correcte de userId (depuis localStorage)
  const userId = localStorage.getItem("userId");

  const [leaderboard, setLeaderboard] = useState([]);
  const [userScore, setUserScore] = useState(0); // Score de l'utilisateur
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sources = location.state?.sources || [];


  useEffect(() => {
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
  
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
  
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/score`) // API des scores
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des scores");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Données reçues :", data); // Debugging

        // Vérification du format de réponse
        if (!data || !data.message || !Array.isArray(data.message)) {
          throw new Error("Format des données incorrect !");
        }

        // Liste des joueurs depuis l'API
        const usersArray = data.message;

        // Trouver le score de l'utilisateur connecté
        const currentUser = usersArray.find((player) => player.id == userId);
        if (currentUser) {
          setUserScore(currentUser.score); // Mettre à jour le score affiché
        }

        // Modifier le nom de l'utilisateur connecté pour "Vous"
        const updatedLeaderboard = usersArray.map((player) =>
          player.id == userId ? { ...player, username: "Vous" } : player
        );

        // Trier par score (du plus grand au plus petit)
        updatedLeaderboard.sort((a, b) => b.score - a.score);

        console.log("Leaderboard mis à jour :", updatedLeaderboard);

        setLeaderboard(updatedLeaderboard);
      })
      .catch((err) => {
        console.error("Erreur API :", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

//   useEffect(() => {
//     if (userId) {
//       fetch(`http://127.0.0.1:8000/api/send-email/${userId}`, { 
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           if (data.message) {
//             console.log("✅ E-mail envoyé avec succès !");
//           } else {
//             console.error("❌ Erreur lors de l'envoi de l'e-mail :", data.error);
//           }
//         })
//         .catch((error) => console.error("❌ Erreur réseau :", error));
//     }
//   }, [userId]);

  const getMessage = () => {
    if (userScore === 5) return "Félicitations ! Vous avez relevé le défi, si vous êtes prêts à relever d’autres défis, faites appel à GEOMINNOV";
    if (userScore >= 3) return "Bravo ! Vous avez relevé le défi, si vous êtes prêts à relever d’autres défis, faites appel à GEOMINNOV ";
    return "Pas de panique ! Rome ne s’est pas construite en un jour, si vous êtes prêts à relever d’autres défis, faites appel à GEOMINNOV";
  };

  if (loading) return <p className="text-xl font-bold">⏳ Chargement des scores...</p>;
  if (error) return <p className="text-xl text-red-500">{error}</p>;

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-primary-light p-6 text-center animate-fade-in">
      <img src="/assets/image.png" alt="Trophée" className="w-24 mb-4 drop-shadow-lg" />

      <h2 className="text-3xl font-bold text-primary-dark mb-4">
        Votre Score : <span className="text-accent-yellow">{userScore}/5</span>
      </h2>

      {/* Tableau des scores avec scroll si nécessaire */}
      <div className="border-2 border-primary-dark w-72 rounded-lg shadow-lg bg-white overflow-hidden">
        <div className="flex justify-between p-3 bg-primary-dark text-white font-bold">
          <span>NOM</span>
          <span>SCORE</span>
        </div>
        <div className="max-h-60 overflow-y-auto">
          {leaderboard.map((player, index) => (
            <div
              key={index}
              className={`flex justify-between p-3 border-b border-gray-300 text-lg 
                          ${player.id == userId ? "bg-accent-yellow text-primary-dark font-bold" : "bg-white text-gray-800"}`}
            >
              <span>{player.username}</span>
              <span>{player.score}/5</span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 text-xl font-semibold text-gray-800">{getMessage()}</p>

      <button
        onClick={() => navigate("/sources", { state: { sources } })}

        className="mt-6 px-6 py-3 bg-secondary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-all duration-300"
      >
        Continuer
      </button>
      Voir les sources des réponses
    </div>
  );
}

export default Results;
