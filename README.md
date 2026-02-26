# resume-screening-agent
An AI based system that automatically analyzes and ranks resume based on a job descriptions using NLP. The model extracts key skills, matches them with job requirements, and shortlists the most relevant candidates.
This project demonstrates end-to-end integration of NLP-based ranking logic with a Flask backend and React frontend.

Tech Stack

Backend
Python
Flask
NLP techniques
PDF text extraction
Frontend
React.js
JavaScript
HTML/CSS

Features

Upload multiple resumes (PDF format)
Enter job description for comparison
Automatic resume text extraction
Resume ranking with similarity scoring
Strength and skill gap identification
Explanation and recommendation generation
Clean and interactive frontend interface

Project Structure

Resume-Screening-Agent/
│
├── backend/
│   ├── app.py
│   ├── resume_ranker.py
│   └── utils/
│       ├── pdf_reader.py
│       └── text_cleaner.py
│
├── frontend/
│   └── src/components/
│       ├── UploadForm.js
│       └── Results.js
│
└── README.md

How to Run

Backend Setup
cd backend
pip install -r requirements.txt
python app.py

Backend runs at:
http://localhost:5000

Frontend Setup
cd frontend
npm install
npm start

Frontend runs at:
http://localhost:3000
