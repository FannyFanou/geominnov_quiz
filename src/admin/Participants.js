import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ParticipantsList() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/score")
      .then((response) => response.json())
      .then((data) => {
        setParticipants(data.message);
        setLoading(false);
      })
      .catch(() => setError("Erreur lors du chargement des participants"));
  }, []);

  if (loading) return <p className="text-primary-dark text-lg font-semibold">Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-primary-light min-h-screen">
      {/* Bouton de retour */}
      <button
        onClick={() => navigate("/questions")}
        className="mb-6 px-4 py-2 text-white font-bold rounded-lg shadow-md bg-secondary"
      >
        Retour aux questions
      </button>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-3xl font-bold text-primary-dark mb-6">Liste des Participants</h1>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg">
            <thead>
              <tr className="bg-primary-dark text-white text-left">
                <th className="border p-4">Nom</th>
                <th className="border p-4">Email</th>
                <th className="border p-4">Score</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant, index) => (
                <tr key={participant.id} className={`border ${index % 2 === 0 ? "bg-monochrome-light" : "bg-white"}`}>
                  <td className="border p-4">{participant.username}</td>
                  <td className="border p-4">{participant.email}</td>
                  <td className="border p-4 font-semibold text-primary-dark">{participant.score}/5</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ParticipantsList;
