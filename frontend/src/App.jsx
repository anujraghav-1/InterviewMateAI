import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Interview from "./pages/Interview";
import "./App.css";

function App() {
  const [interviewData, setInterviewData] = useState(null);

  function handleStartInterview(data) {
    setInterviewData(data);
  }

  function handleEndInterview() {
    setInterviewData(null);
  }

  return (
    <div className="app">
      <Navbar />

      {interviewData ? (
        <Interview
          interviewData={interviewData}
          onEndInterview={handleEndInterview}
        />
      ) : (
        <Home onStartInterview={handleStartInterview} />
      )}

      <footer>Built to help you become interview-ready.</footer>
    </div>
  );
}

export default App;