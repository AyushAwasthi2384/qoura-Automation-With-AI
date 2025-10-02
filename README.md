# Quora Automation With AI

Automate answering questions on Quora using AI-generated responses and browser automation!

## Overview

This project leverages Puppeteer for browser automation, MySQL for credential management, and Google's Generative AI (Gemini) to automatically log into Quora, search for a keyword, and post high-quality AI-generated answers. It demonstrates a pipeline that combines database-driven login, keyword search, question scraping, and AI-powered answering.

**Features:**
- Login to Quora using credentials stored in MySQL.
- Search for a configurable keyword (e.g., "NextJS").
- Scrape the first question and generate a concise answer using Google's Gemini AI.
- Automatically post the answer using browser automation.
- Modular database credential management with CRUD support.

---

## Getting Started

### Prerequisites

- **Node.js** (v16+ recommended)
- **npm**
- **MySQL** installed and running (local instance)
- **Google Generative AI API Key** ([Get one here](https://ai.google.dev/))
- Quora account credentials

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AyushAwasthi2384/qoura-Automation-With-AI.git
   cd qoura-Automation-With-AI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   - Copy `.env.example` to `.env` (or create `.env`):
     ```
     GOOGLE_API_KEY=your_google_generative_ai_api_key
     DB_USER=your_mysql_user
     DB_PASSWORD=your_mysql_password
     DB_NAME=autoquora
     ```
   - Ensure your MySQL instance has a database named `autoquora`:
     ```sql
     CREATE DATABASE autoquora;
     ```
   - Create a `credentials` table:
     ```sql
     CREATE TABLE credentials (
       id INT AUTO_INCREMENT PRIMARY KEY,
       email VARCHAR(255) NOT NULL,
       password VARCHAR(255) NOT NULL
     );
     ```

4. **Add your Quora credentials:**
   You can use the included functions (`createCredential`) in `db.js` to insert credentials, or manually:
   ```sql
   INSERT INTO credentials (email, password) VALUES ('your_email', 'your_password');
   ```

---

## Running the Automation

1. **Start MySQL server** (ensure the database is available).
2. **Run the automation script:**
   ```bash
   node app.js
   ```
   - The script launches a browser, logs into Quora, searches for "NextJS", generates an answer, and posts it.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Clone your fork**
3. **Create a new branch**
   ```bash
   git checkout -b your-feature-branch
   ```
4. **Make your changes**
5. **Test thoroughly**
6. **Commit and push**
   ```bash
   git commit -m "Describe your change"
   git push origin your-feature-branch
   ```
7. **Open a Pull Request** on GitHub

### Guidelines

- Follow existing code style.
- Document new functions or features.
- Ensure any credentials or secrets are not hardcoded in code (use `.env`).
- Test your changes before submitting a PR.

---

## Project Structure

- `app.js` — Main automation script (Puppeteer, MySQL, AI integration)
- `db.js` — Database CRUD for credentials
- `ai.js` — Google Gemini AI wrapper for generating answers

---

## Security Notes

- **Never commit real credentials or API keys.**
- Use `.env` for sensitive information.
- Consider encrypting credentials in the database for production use.

---

## Contact

Maintainer: [Ayush Awasthi](https://github.com/AyushAwasthi2384)
