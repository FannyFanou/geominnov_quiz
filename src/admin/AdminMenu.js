import { NavLink } from "react-router-dom";

function AdminMenu() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-around">
      <NavLink to="/questions" className="px-4 py-2 hover:bg-gray-700 rounded">
        📋 Gérer les Questions
      </NavLink>
      <NavLink to="/participants" className="px-4 py-2 hover:bg-gray-700 rounded">
        👥 Voir les Participants
      </NavLink>
    </nav>
  );
}

export default AdminMenu;
