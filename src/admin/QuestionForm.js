import { useState } from "react";
import { useNavigate } from "react-router-dom";

function QuestionForm() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [source, setSource] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [choices, setChoices] = useState(["", ""]);
  const [correctChoiceIndex, setCorrectChoiceIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const addChoice = () => setChoices([...choices, ""]);
  const updateChoice = (index, value) => {
    const updatedChoices = [...choices];
    updatedChoices[index] = value;
    setChoices(updatedChoices);
  };
  const removeChoice = (index) => setChoices(choices.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const payload = {
      question,
      source,
      is_open_question: isOpen,
      correct_answer: isOpen ? correctAnswer : null,
      choices: isOpen ? null : choices,
      correct_choice_index: isOpen ? null : correctChoiceIndex,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/create_question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur inconnue");

      setMessage("✅ Question créée avec succès !");
      
      // Redirection vers la liste des questions après 1 seconde
      setTimeout(() => {
        navigate("/questions");
      }, 1000);
      
    } catch (error) {
      setMessage("❌ Erreur : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-white rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-primary-dark text-center mb-6">📝 Créer une Question</h2>

      {message && <p className="mb-4 text-center text-sm font-semibold">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Énoncé de la question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-3 border border-primary-dark rounded-lg focus:ring-2 focus:ring-secondary"
          required
        />

        <input
          type="text"
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="w-full p-3 border border-primary-dark rounded-lg focus:ring-2 focus:ring-secondary"
          
        />

        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="checkbox" checked={isOpen} onChange={() => setIsOpen(!isOpen)} className="h-5 w-5 text-primary-dark" />
          <span className="text-primary-dark font-semibold">Question ouverte</span>
        </label>

        {isOpen ? (
          <input
            type="text"
            placeholder="Réponse correcte"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            className="w-full p-3 border border-primary-dark rounded-lg focus:ring-2 focus:ring-secondary"
            required
          />
        ) : (
          <div>
            {choices.map((choice, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  placeholder={`Choix ${index + 1}`}
                  value={choice}
                  onChange={(e) => updateChoice(index, e.target.value)}
                  className="w-full p-2 border border-primary-dark rounded-lg focus:ring-2 focus:ring-secondary"
                  required
                />
                <input
                  type="radio"
                  name="correct_choice"
                  checked={correctChoiceIndex === index}
                  onChange={() => setCorrectChoiceIndex(index)}
                  className="h-5 w-5 text-secondary"
                />
                {choices.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeChoice(index)}
                    className="text-accent-red font-bold hover:text-red-700"
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addChoice}
              className="mt-2 px-4 py-2 bg-secondary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-all duration-300"
            >
              ➕ Ajouter un choix
            </button>
          </div>
        )}

        <button
          type="submit"
          className="w-full p-3 bg-secondary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-all duration-300"
          disabled={loading}
        >
          {loading ? "Envoi..." : "Créer"}
        </button>
      </form>
    </div>
  );
}

export default QuestionForm;
