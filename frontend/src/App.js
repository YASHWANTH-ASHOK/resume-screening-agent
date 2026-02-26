import React, { useState } from "react";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [fileNames, setFileNames] = useState([]);

  // Convert strengths/gaps into clean list Even if backend sends merged words
  const formatList = (value) => {
    if (!value) return [];

    // If backend sends array ["css","html"]
    if (Array.isArray(value)) return value;

    // If backend sends string "cssfrontendhtml"
    if (typeof value === "string") {
      return value
        .split(/[^a-zA-Z]+/)   // split wherever non-letter appears
        .filter(Boolean);      // remove empty
    }

    return [];
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files).map((f) => f.name);
    setFileNames(files);
  };

  const handleSubmit = async () => {
    const jd = document.getElementById("jdInput").value;
    const files = document.getElementById("resumeInput").files;

    if (!jd || files.length === 0) {
      alert("Please enter JD and upload resumes!");
      return;
    }

    const formData = new FormData();
    formData.append("jd", jd);

    for (let file of files) {
      formData.append("resumes", file);
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/rank", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setLoading(false);

      if (data.results) setResults(data.results);
      else alert("No results returned from backend");

    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Error contacting backend");
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">Resume Screening Agent</h1>
      <p className="subtitle">Upload Job Description + Multiple Resumes</p>

      <div className="glass-card">
        <textarea
          id="jdInput"
          placeholder="Paste Job Description here..."
        ></textarea>

        <div
          className="file-drop"
          onClick={() => document.getElementById("resumeInput").click()}
        >
          <p>
            Drag & Drop Resumes <br />
            <span>(or click to upload PDFs)</span>
          </p>

          <input
            type="file"
            id="resumeInput"
            multiple
            accept=".pdf"
            hidden
            onChange={handleFileSelect}
          />
        </div>

        {/* Show uploaded filenames */}
        {fileNames.length > 0 && (
          <div className="file-list">
            {fileNames.map((name, i) => (
              <p key={i}>📄 {name}</p>
            ))}
          </div>
        )}

        <button className="btn" onClick={handleSubmit}>
          Analyze Resumes
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && <div className="loading">Analyzing...</div>}

      {/* RESULTS */}
      <div className="results">
        {Array.isArray(results) &&
          results.map((r, index) => (
            <div className="result-card" key={index}>
              <h3>Score: {r.score}</h3>

              {/* Strengths list */}
              <p><strong>Strengths:</strong></p>
              <ul className="skill-list">
                {formatList(r.strengths).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>

              {/* Gaps list */}
              <p><strong>Gaps:</strong></p>
              <ul className="skill-list">
                {formatList(r.gaps).map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>

              <p><strong>Explanation:</strong> {r.explanation}</p>
              <p><strong>Recommendation:</strong> {r.recommendation}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;