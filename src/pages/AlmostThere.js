import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function AlmostThere() {
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
  
  
  const handleContinue = () => {
    localStorage.setItem("fromAlmostThere", "true"); 
    localStorage.setItem("savedQuestionIndex", 3); // ✅ Sauvegarde l'index
    navigate("/quiz", { state: { fromAlmostThere: true, resumedIndex: 3 } });
  };
  

  return (
    <motion.div 
      className="h-screen flex flex-col items-center justify-center bg-primary-light p-6 text-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.h2 
        className="text-3xl font-bold text-monochrome-dark mb-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Vous y êtes presque !
      </motion.h2>

      <motion.p 
        className="text-lg text-white-100 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Encore deux questions et vous aurez terminé le quiz.<br />
        Bonne chance !
      </motion.p>

      <motion.button
        onClick={handleContinue}
        className="px-8 py-3 text-lg font-semibold rounded-xl shadow-lg 
                   bg-secondary text-white 
                   transition-all duration-300 transform hover:scale-105 hover:brightness-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        Continuer le Quiz
      </motion.button>
    </motion.div>
  );
}

export default AlmostThere;
