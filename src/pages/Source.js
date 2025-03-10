import { useLocation, useNavigate } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";

function Sources() {
  const location = useLocation();
  const navigate = useNavigate();
  const sources = location.state?.sources || [];

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-primary-light p-6 text-center">
      <h1 className="text-3xl font-bold text-primary-dark mb-6">📚 Sources des Questions</h1>

      {sources.length > 0 ? (
        <div className="w-full max-w-2xl space-y-4">
          {sources.map((source, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
              <span className="text-lg text-gray-800 truncate">{source}</span>
              <a
                href={source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white bg-secondary px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-primary-dark transition-all"
              >
                Ouvrir <FaExternalLinkAlt />
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-lg text-gray-600">Aucune source disponible.</p>
      )}

      <button
        onClick={() => navigate("/thank-you")}
        className="mt-6 px-6 py-3 bg-secondary text-white font-bold rounded-lg"
      >
        Continuer
      </button>
    </div>
  );
}

export default Sources;
