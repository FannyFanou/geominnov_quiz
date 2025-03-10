import { Link } from "react-router-dom";

function ThankYou() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-primary-light p-6 text-center">
      {/* Illustration */}
      <img
        src="/assets/intro-illustration.png"
        alt="Logo Entreprise"
        className="w-48 mb-6 drop-shadow-lg"
      />

      {/* Message principal */}
      <h1 className="text-3xl font-bold text-gray-800">Merci d'avoir joué ! </h1>
      <p className="text-lg text-gray-700 mt-3">
        Nous espérons vous revoir bientôt pour de nouveaux défis ! 😊
      </p>

     
    </div>
  );
}

export default ThankYou;
