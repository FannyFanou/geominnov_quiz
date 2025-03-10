import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Identifiants prédéfinis (à modifier ici)
  const ADMIN_EMAIL = "service@geominnov.com";
  const ADMIN_PASSWORD = "S.impact@energie";

  const handleLogin = (e) => {
    e.preventDefault();

    // Vérification des identifiants
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("isAuthenticated", "true"); // Stocke l'état de connexion
      navigate("/questions"); // Redirige vers l'espace admin
    } else {
      setError("Email ou mot de passe incorrect !");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-primary-light">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-primary-dark mb-6 text-center">
          Connexion Administrateur
        </h2>

        {error && (
          <p className="text-red-600 text-center bg-monochrome-light p-2 rounded-lg mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg shadow-sm"
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg shadow-sm"
            required
          />

          <button
            type="submit"
            className="w-full p-3 bg-secondary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-all duration-300"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
