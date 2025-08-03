import { useState } from "react";
import { FaFileCsv } from "react-icons/fa";
import { HiOutlineMailOpen } from "react-icons/hi";
import * as XLSX from "xlsx";
import axios from "axios";
import Navbar from "./components/Navbar";

function App() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(false);
  const [emailList, setEmailList] = useState([]);
  const [subject, setSubject] = useState("");

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const handleSubject = (e) => {
    setSubject(e.target.value);
  };

  const sendMessage = () => {
    if (!subject.trim() || !message.trim() || emailList.length === 0) {
      alert("Please fill in all fields and upload a recipient list.");
      return;
    }
    setStatus(true);
    axios
      .post("http://localhost:5000/sendemail", {
        subject: subject,
        message: message,
        emailList: emailList,
      })
      .then((data) => {
        if (data.status === 200) {
          alert("Email sent successfully!");
          setStatus(false);
          setSubject("");
          setMessage("");
          setEmailList([]);
        }
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        setStatus(false);
      });
  };

  const handleFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log("File selected:", file);

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;

      const workbook = XLSX.read(data, { type: "binary" });
      console.log("Workbook:", workbook);

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
      console.log("Emails with headers:", emailList);

      const totalemail = emailList.map((item) => item.A);
      console.log("Total emails:", totalemail);

      setEmailList(totalemail);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="min-h-screen bg-blue-50 text-gray-900 font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl bg-white border border-blue-100 rounded-2xl p-10 shadow-md">
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-blue-700">
              Subject
            </label>
            <input
              className="w-full h-4 border border-blue-200 text-gray-800 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              placeholder="Write your subject content here..."
              onChange={handleSubject}
              value={subject}
            ></input>
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-blue-700">
              Email Content
            </label>
            <textarea
              className="w-full h-40 border border-blue-200 text-gray-800 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              placeholder="Write your email content here..."
              onChange={handleMessage}
              value={message}
            ></textarea>
          </div>

          <div className="mb-6 border border-dashed border-blue-200 rounded-xl p-6 flex flex-col items-center text-center bg-blue-50">
            <div className="flex items-center gap-2 text-blue-600 font-medium mb-3">
              <FaFileCsv className="text-blue-700" />
              Upload Recipient List (.csv)
            </div>
            <input
              onChange={handleFile}
              type="file"
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-blue-300 file:text-sm file:font-medium file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
            />
            <p className="mt-3 text-sm text-blue-500">
              Total recipients:{" "}
              <span className="font-semibold">{emailList.length}</span>
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={sendMessage}
              className="bg-blue-700 text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-blue-800 transition-colors flex items-center gap-2"
            >
              <HiOutlineMailOpen size={20} />
              {status ? "Sending" : "Send"}
            </button>
          </div>
        </div>
      </main>

      <footer className="text-center py-6 text-sm text-blue-400 border-t border-blue-100">
        &copy; 2025 BulkMail — Created by Kiranmadhav
      </footer>
    </div>
  );
}

export default App;
