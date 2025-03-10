import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-primary-light text-center p-6 animate-fade-in">
      {/* Illustration avec animation */}
      <img 
        src="/assets/logo-geom.jpg" 
        alt="Maison" 
        className="w-52 md:w-72 mb-6 drop-shadow-xl "
      />

      {/* Texte d'introduction avec meilleure mise en page */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-monochrome-dark mb-4 tracking-wide">
        Testez vos connaissances !
      </h1>
      <p className="text-lg md:text-xl text-white max-w-lg leading-relaxed">
        Découvrez comment améliorer votre logement grâce à ce quiz interactif. 
        Apprenez en vous amusant !
      </p>

      {/* Bouton interactif avec effet hover */}
      <Link to="/intro">
        <button className="mt-6 px-8 py-3 bg-secondary text-white font-bold text-lg rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95">
          Démarrer 
        </button>
      </Link>
    </div>
  );
}

export default Home;
