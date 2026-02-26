import re

# --------------------------------------------------------------
# STOPWORDS — ignore common words
# --------------------------------------------------------------
STOPWORDS = {
    "and","or","but","the","a","an","is","are","was","were","with","for","to","in",
    "on","of","also","app","you","can","this","that","as","be","have","has","had",
    "by","from","at","it","its","your","their","they","we","our","i"
}

# --------------------------------------------------------------
# TECH SKILLS — dictionary of valid technical keywords
# --------------------------------------------------------------
TECH_KEYWORDS = {
    # Languages
    "python","java","javascript","typescript","c","c++","c#","go","rust","kotlin",
    "swift","php","ruby",

    # Web Development
    "html","css","react","node","express","django","flask","fastapi","angular",
    "bootstrap","nextjs","api","apis","rest","json","xml",

    # Databases
    "sql","mysql","postgresql","mongodb","redis","sqlite","nosql",

    # Cloud
    "aws","azure","gcp","cloud","lambda","docker","kubernetes","k8s","devops",
    "ci","cd","jenkins",

    # ML & AI
    "ml","ai","machine","learning","deep","neural","model","models","training",
    "testing","data","nlp","opencv","pandas","numpy","sklearn","tensorflow",
    "pytorch",

    # Backend
    "backend","frontend","fullstack","microservices","authentication",
    "authorization","jwt"
}

# --------------------------------------------------------------
# CLEAN TEXT — prevents merged words like cssfrontendhtml
# --------------------------------------------------------------
def clean_text(text):
    if not text:
        return ""

    text = text.lower()

    # Remove bullets
    text = text.replace("•", " ")
    text = text.replace("●", " ")
    text = text.replace("·", " ")
    text = text.replace("-", " ")

    # Keep letters, numbers, and spaces only
    text = re.sub(r"[^a-z0-9 ]", " ", text)

    # Reduce multiple spaces → single space
    text = re.sub(r"\s+", " ", text)

    return text.strip()


# --------------------------------------------------------------
# EXTRACT KEYWORDS — only take REAL skills from TECH_KEYWORDS
# --------------------------------------------------------------
def extract_keywords(text):
    words = text.split()
    keywords = set()

    for w in words:
        w = w.strip()

        if len(w) < 2:
            continue

        if w in STOPWORDS:
            continue

        if w in TECH_KEYWORDS:
            keywords.add(w)

    return keywords


# --------------------------------------------------------------
# SKILL MATCH SCORE
# --------------------------------------------------------------
def skill_match_score(job_keywords, resume_keywords):
    matched = job_keywords.intersection(resume_keywords)
    missing = job_keywords.difference(matched)

    if len(job_keywords) == 0:
        score = 0
    else:
        score = (len(matched) / len(job_keywords)) * 100

    return score, matched, missing


# --------------------------------------------------------------
# RECOMMENDATION LABEL
# --------------------------------------------------------------
def get_recommendation(score):
    if score >= 85:
        return "Strong fit"
    elif score >= 60:
        return "Good fit"
    elif score >= 40:
        return "Possible fit"
    else:
        return "Not a fit"


# --------------------------------------------------------------
# MAIN RESUME RANKING FUNCTION
# --------------------------------------------------------------
def rank_resume(resume_text, job_description):

    # Clean both texts
    job_clean = clean_text(job_description)
    resume_clean = clean_text(resume_text)

    # Extract keywords
    job_keywords = extract_keywords(job_clean)
    resume_keywords = extract_keywords(resume_clean)

    # Calculate score and matched skills
    score, matched, missing = skill_match_score(job_keywords, resume_keywords)

    # Create explanation
    explanation = (
        f"The resume matches {len(matched)} out of {len(job_keywords)} "
        f"important technical skills from the job description."
    )

    # Final result
    return {
        "score": round(score, 2),
        "strengths": sorted(list(matched))[:10],
        "gaps": sorted(list(missing))[:10],
        "explanation": explanation,
        "recommendation": get_recommendation(score),
    }