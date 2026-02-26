import gradio as gr
from utils.pdf_reader import extract_text_from_pdf
from utils.text_cleaner import clean_text
from resume_ranker import rank_resume

def process_resumes(job_desc, resume_files):
    results = []

    if resume_files is None:
        return "Please upload at least one resume."

    for file in resume_files:
        try:
            # Extract text
            text = extract_text_from_pdf(file.name)

            # Clean text
            cleaned = clean_text(text)

            # Run ranking logic
            analysis = rank_resume(job_desc, cleaned)

            results.append(f"""
Resume: {file.name}
Score: {analysis['score']}
Strengths: {analysis['strengths']}
Gaps: {analysis['gaps']}
Explanation: {analysis['explanation']}
Recommendation: {analysis['recommendation']}
------------------------------------------
""")
        except Exception as e:
            results.append(f"Error processing {file.name}: {str(e)}")

    return "\n".join(results)

# Gradio UI
iface = gr.Interface(
    fn=process_resumes,
    inputs=[
        gr.Textbox(label="Job Description", lines=4),
        gr.Files(label="Upload Resume PDFs")
    ],
    outputs=gr.Textbox(label="Results"),
    title="AI Resume Screening Agent"
)

iface.launch()