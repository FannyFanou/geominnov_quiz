import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function EmailForm() {

    
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


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
  
  // 🔥 Récupérer l'userId depuis le localStorage (s'il existe)
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/add_email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, user_id: userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'enregistrement.");
      }

      console.log("✅ E-mail enregistré avec succès :", data);

      // 🔥 Met à jour l'userId si l'API en renvoie un nouveau
      if (data.user_id) {
        localStorage.setItem("userId", data.user_id);
        setUserId(data.user_id);
      }

      // 🔄 Redirection vers le Quiz
      navigate("/quiz", { state: { fromEmailForm: true, userId: data.user_id || userId, resumedIndex: 4 } });

    } catch (err) {
      console.error("❌ Erreur :", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-primary-light p-6 text-center">
      {/* Titre */}
      <h2 className="text-3xl font-bold text-monochrome-dark mb-4">
        Entrez votre e-mail
      </h2>

      {/* Sous-titre explicatif */}
      <p className="text-lg text-white mb-6">
        Renseignez votre adresse e-mail pour continuer.
      </p>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
        {/* Champ email */}
        <input
          type="email"
          placeholder="Votre e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 border-2 border-gray-300 rounded-lg w-full text-center text-lg 
                     focus:outline-none focus:ring-2 focus:ring-primary-light"
          required
        />

        {/* Affichage des erreurs */}
        {error && <p className="text-red-600 font-semibold">{error}</p>}

        {/* Bouton valider */}
        <button
          type="submit"
          className="px-6 py-3 text-lg font-semibold rounded-xl shadow-md 
                     bg-secondary text-white transition-all duration-300"
          disabled={loading}
        >
          {loading ? "Envoi en cours..." : "Valider"}
        </button>
      </form>
    </div>
  );
}

export default EmailForm;
