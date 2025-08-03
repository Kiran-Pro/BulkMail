import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EmailHistory = () => {
  const navigate = useNavigate();
  const [emailData, setEmailData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get("http://localhost:5000/gethistory");
        setEmailData(response.data);
      } catch (error) {
        console.error("Error fetching email history:", error);
        setError("Failed to load email history.");
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 text-gray-900 font-sans flex flex-col">
      <div className="bg-white shadow-sm border-b border-blue-100 px-6 py-6 md:py-8 flex flex-col items-center md:flex-row md:justify-between">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700">
          Email History
        </h1>
        <button
          onClick={() => navigate("/home")}
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Send mails
        </button>
      </div>

      <div className="flex-grow p-6 md:p-10">
        {error && (
          <p className="text-red-500 font-medium mb-4 text-center">{error}</p>
        )}

        {emailData.length === 0 && !error ? (
          <p className="text-blue-500 text-center text-sm">
            No emails sent yet.
          </p>
        ) : (
          <ul className="grid md:grid-cols-2 gap-6">
            {emailData.map((email, index) => (
              <li
                key={index}
                className="border border-blue-100 rounded-xl p-6 bg-white shadow-md hover:shadow-lg transition duration-200"
              >
                <h2 className="text-blue-700 font-semibold text-lg">
                  {email.subject}
                </h2>
                <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                  {email.body}
                </p>
                <p className="text-sm text-blue-500 mt-2">
                  📧 Recipients:{" "}
                  <span className="font-medium">
                    {email.emailList.join(", ")}
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  🕒 Sent on:{" "}
                  {email.time ? new Date(email.time).toLocaleString() : "TBA"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EmailHistory;
