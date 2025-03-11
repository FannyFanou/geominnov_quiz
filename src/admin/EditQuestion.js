import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditQuestion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [source, setSource] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/admin/update-question/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setQuestion(data.question_text);
        setSource(data.source);
        setLoading(false);
      })
      .catch(() => setError("❌ Erreur de chargement de la question"));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/questions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, source }),
      });

      if (!response.ok) throw new Error("❌ Erreur lors de la modification");

      navigate("/admin"); // Redirige vers la liste des questions après modification
    } catch (error) {
      setError(error.message);
    }
  }; 

  return (
    <div className="p-6 bg-primary-light min-h-screen flex justify-center items-center">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-primary-dark"> Modifier la Question</h1>

        {error && <p className="text-accent-red mb-4">{error}</p>}

        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Question */}
          <div>
            <label className="block text-primary-dark font-medium">Question :</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
              required
            />
          </div>

          {/* Source */}
          <div>
            <label className="block text-primary-dark font-medium">Source :</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
              required
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/questions")}
              className="px-6 py-3 bg-monochrome-dark text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-all duration-300"
            >
              Retour
            </button>

            <button
              type="submit"
              className="px-6 py-3 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-all duration-300"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditQuestion;
