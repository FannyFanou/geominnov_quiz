import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "./AdminMenu"; // Menu de navigation

function AdminPanel() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login"); // Redirige vers la connexion si non connecté
    }
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/questions");
      const data = await response.json();
      setQuestions(data.data);
    } catch (error) {
      setError("Erreur lors du chargement des questions");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-question/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette question ?")) return;

    try {
      await fetch(`http://127.0.0.1:8000/api/admin/delete-question/${id}`, { method: "DELETE" });
      setQuestions(questions.filter((q) => q.id !== id));
    } catch (error) {
      setError("Erreur lors de la suppression de la question");
    }
  };

  return (
    <div className="p-6 bg-primary-light min-h-screen">
      <AdminMenu /> {/* Menu de navigation */}


      {loading ? (
        <p className="text-lg text-primary-dark font-semibold">⏳ Chargement...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="bg-white shadow-lg rounded-xl p-6">
          <button
            className="mb-6 px-6 py-3 bg-secondary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-all duration-300"
            onClick={() => navigate("/create-question")}
          >
            Ajouter une question
          </button>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg">
              <thead>
                <tr className="bg-primary-dark text-white text-left">
                  <th className="border p-4">Question</th>
                  <th className="border p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question, index) => (
                  <tr key={question.id} className={`border ${index % 2 === 0 ? "bg-monochrome-light" : "bg-white"}`}>
                    <td className="border p-4">{question.question_text}</td>
                    <td className="border p-4 flex gap-4">
                      <button
                        className="px-4 py-2 bg-primary-light text-white font-bold rounded-md shadow-md"
                        onClick={() => handleEdit(question.id)}
                      >
                         Modifier
                      </button>
                      <button
                        className="px-4 py-2 bg-accent-red text-white font-bold rounded-md shadow-md hover:bg-red-700 transition-all duration-300"
                        onClick={() => handleDelete(question.id)}
                      >
                         Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
