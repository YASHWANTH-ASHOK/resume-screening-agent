import React, { useState } from "react";

function UploadForm({ setResults }) {
  const [jobDesc, setJobDesc] = useState("");
  const [resumes, setResumes] = useState([]);

  const handleUpload = async () => {
    if (!jobDesc.trim()) {
      alert("Please paste a job description.");
      return;
    }
    if (!resumes || resumes.length === 0) {
      alert("Please select at least one resume PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("job_desc", jobDesc);

    for (let i = 0; i < resumes.length; i++) {
      // KEY NAME MUST MATCH backend: "resume"
      formData.append("resume", resumes[i]);
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/rank", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Backend error:", text);
        alert("Backend error – check backend terminal.");
        return;
      }

      const data = await response.json();
      console.log("Received results:", data);
      setResults(data); // array from backend
    } catch (err) {
      console.error("Request failed:", err);
      alert("Failed to connect to backend.");
    }
  };

  return (
    <div className="card">
      <h2>Upload Job Description</h2>
      <textarea
        placeholder="Paste Job Description here..."
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
        rows="6"
      />

      <h2>Upload Resumes (PDF Only)</h2>
      <input
        type="file"
        multiple
        onChange={(e) => setResumes(e.target.files)}
        accept="application/pdf"
      />

      <button onClick={handleUpload}>Rank Resumes</button>
    </div>
  );
}

export default UploadForm;