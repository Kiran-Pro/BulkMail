import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="bg-white shadow-sm border-b border-blue-100 px-6 py-6 md:py-8 flex flex-col items-center md:flex-row md:justify-between">
      <div className="text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700">
          BulkMail
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Send multiple emails at once with ease
        </p>
      </div>
      <div className="mt-4 md:mt-0">
        <button
          onClick={() => navigate("/history")}
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Email History
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
