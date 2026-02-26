import React from "react";

function Results({ results }) {
  if (!results || results.length === 0) {
    return <p>No results yet...</p>;
  }

  return (
    <div>
      <h2>Ranking Results</h2>
      <ul>
        {results.map((res, index) => (
          <li key={index} style={{ marginBottom: "20px" }}>
            <strong>{res.name}</strong>
            <br />
            Score: {res.score}
            <br />
            Recommendation: {res.recommendation}
            <br />
            <strong>Strengths:</strong>
            <ul>
              {res.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
            <strong>Gaps:</strong>
            <ul>
              {res.gaps.map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
            <strong>Explanation:</strong> {res.explanation}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Results;