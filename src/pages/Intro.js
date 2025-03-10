import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser } from "react-icons/fa";

function Intro() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleStartQuiz = async () => {
    if (!name.trim()) {
      setError("Veuillez entrer votre nom.");
      return;
    }

    setLoading(true);
    setError("");

    try {

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/create_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();
      if (!response.ok || !data.user || !data.user.id) {
        throw new Error("Erreur lors de l'enregistrement.");
      }

      localStorage.setItem("userId", data.user.id);

      navigate("/quiz", { state: { userId: data.user.id } });
    } catch (err) {
      setError("Impossible d'enregistrer le nom.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-primary-light text-center p-6 animate-fade-in">
      <motion.h1
        className="text-3xl md:text-4xl font-extrabold text-primary-dark mb-4 drop-shadow-md"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Bienvenue dans l’expérience rénovation !
      </motion.h1>

      <motion.img
        src="/assets/GEOMINNOVQ7.jpg"
        alt="Maison"
        className="w-52 md:w-64 mb-6 rounded-lg shadow-lg"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      <div className="relative w-72 md:w-80">
        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Votre prénom..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 pl-10 rounded-lg text-lg bg-white border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition-all"
        />
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <motion.button
        onClick={handleStartQuiz}
        disabled={loading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`mt-6 px-8 py-3 text-lg font-semibold rounded-lg shadow-md transition-all duration-300 transform
          ${
            name
              ? "bg-secondary text-white hover:bg-secondary-dark"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
      >
        {loading ? "Chargement..." : "Commencer"}
      </motion.button>
    </div>
  );
}

export default Intro;