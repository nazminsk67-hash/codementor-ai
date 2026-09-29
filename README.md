# CodeMentor AI

## Memory-Powered Java Code Review Assistant

CodeMentor AI is an AI-powered Java code review application that analyzes Java source code, identifies potential issues, explains them, and provides improvement suggestions.

Unlike a basic one-time code reviewer, CodeMentor AI integrates **Hindsight memory** to retain useful insights from previous code reviews and use relevant memories during subsequent reviews.

## 🚀 Project Overview

Developers, especially students and beginners, often make similar coding mistakes repeatedly. Traditional code review tools can identify problems in individual pieces of code, but they may not retain useful context from previous reviews.

CodeMentor AI addresses this by combining:

- AI-powered Java code analysis
- Intelligent issue detection
- Improvement recommendations
- Long-term memory
- Previous review insights
- Interactive demonstration scenarios

The goal is to make code review more contextual and personalized over time.

## ✨ Key Features

### 1. AI-Powered Java Code Review

Users can paste Java source code into the application and request an AI-powered review.

The system analyzes the code and generates:

- Review summary
- Detected issues
- Improvement suggestions
- Memory-related insights
- Learned coding insights

### 2. Java Code Validation

The backend performs basic validation before sending code for AI analysis.

It checks whether:

- Code has been provided
- Code is within the allowed size
- The input appears to contain Java-related syntax

Invalid input is rejected with an appropriate error message.

### 3. Hindsight Memory

CodeMentor AI uses Hindsight as its long-term memory layer.

The application:

1. Recalls relevant memories before reviewing code.
2. Provides those memories as context to the AI reviewer.
3. Generates the current code review.
4. Extracts useful insights from the review.
5. Stores those insights for future reviews.

This allows the application to maintain useful knowledge across multiple code reviews.

### 4. Groq-Powered AI Analysis

Groq is used to process the Java code and generate the review.

The AI receives:

- Current Java source code
- Relevant recalled memories

It then generates structured review information.

### 5. Demo Scenarios

The application includes demo scenarios that make it easy to demonstrate the system.

These scenarios can be used to show:

- Null-related coding issues
- Similar mistakes in different code
- Multiple coding issues

They provide a quick way to demonstrate the memory-powered workflow.

### 6. Error Handling

The backend handles different types of invalid requests, including:

- Empty code
- Non-Java input
- Excessively large code
- Invalid JSON
- AI review failures


## 🧠 How the Memory-Powered Review Works

The main workflow is:

```text
User enters Java code
        ↓
Frontend sends code to backend
        ↓
Backend validates the input
        ↓
Hindsight recalls relevant memories
        ↓
Groq analyzes the Java code
        ↓
AI generates the review
        ↓
New insights are extracted
        ↓
Insights are stored in Hindsight
        ↓
Review is returned to the frontend
        ↓
User sees the results
```

This creates a feedback cycle where previous review insights can become useful context for future reviews.

## 🏗️ System Architecture

```text
┌─────────────────────────┐
│       Frontend          │
│    HTML / CSS / JS      │
└────────────┬────────────┘
             │
             │ POST /api/review
             ▼
┌─────────────────────────┐
│    Node.js + Express    │
│       Backend           │
└────────────┬────────────┘
             │
       ┌─────┴─────┐
       │           │
       ▼           ▼
┌────────────┐ ┌────────────┐
│ Hindsight  │ │   Groq AI  │
│  Memory    │ │ Code Review│
└────────────┘ └────────────┘
       │           │
       └─────┬─────┘
             ▼
      Review + Insights
             │
             ▼
        Frontend UI
```

## 🛠️ Technology Stack

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js
- CORS
- dotenv

### Artificial Intelligence

- Groq
- Hindsight

### Programming Language Reviewed

- Java

## 📁 Project Structure

```text
codementor-ai/
│
├── backend/
│   ├── agent.js
│   ├── hindsight.js
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── test-agent.js
│   ├── test-api.js
│   └── test-hindsight.js
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── .env.example
├── .gitignore
└── README.md
```

## ⚙️ Installation

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd codementor-ai
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with the actual repository URL.

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root.

Use `.env.example` as a reference.

Example:

```env
GROQ_API_KEY=your_groq_api_key
HINDSIGHT_API_KEY=your_hindsight_api_key
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
HINDSIGHT_BANK_ID=codementor-demo-dev
PORT=3000
```

### 🔐 Security

Never commit your `.env` file to GitHub.

API keys must remain private.

## ▶️ Running the Application

From the `backend` directory:

```bash
npm start
```

The backend starts on:

```text
http://localhost:3000
```

The Express server also serves the frontend application.

Open the application in your browser using the displayed local address.

## 🧪 Testing the Application

### Test 1 — Valid Java Code

Paste valid Java code into the editor and click:

**Review Code**

The application should return:

- Review
- Issues
- Improvements
- Memory information

### Test 2 — Invalid Input

For example:

```text
hello world
```

The backend should reject it with:

```text
That does not look like Java code.
```

### Test 3 — Demo Scenarios

Use the available demo buttons to load predefined Java examples.

A typical demonstration workflow is:

```text
Demo 1
  ↓
Review
  ↓
Memory is created
  ↓
Demo 2
  ↓
Review
  ↓
Relevant memory can be recalled
```

## 🔍 Example Java Code

```java
public class Calculator {

    public int add(int a, int b) {
        return a + b;
    }

    public int divide(int a, int b) {
        return a / b;
    }

    public static void main(String[] args) {
        Calculator calculator = new Calculator();

        System.out.println(calculator.add(10, 20));
        System.out.println(calculator.divide(20, 5));
    }
}
```

Paste the code into CodeMentor AI and select **Review Code**.

## 🧩 Backend API

### POST `/api/review`

The application exposes a review endpoint.

Example request:

```json
{
  "code": "public class Test { public static void main(String[] args) { System.out.println(\"Hello\"); } }"
}
```

The endpoint returns structured information including:

```json
{
  "review": "...",
  "issues": [],
  "improvements": [],
  "memoryInsights": [],
  "memoryUsed": [],
  "memoryLearned": [],
  "memoryStatus": {}
}
```
## 🔐 API Security

The project uses environment variables for external service credentials.

The following should never be committed:

```text
.env
```

The repository contains `.env.example` so that other developers know which variables are required without exposing credentials.

## 🎯 Project Goals

CodeMentor AI was developed to explore how AI code review can be combined with persistent memory.

The main goals are:

- Automate basic Java code review
- Provide understandable feedback
- Identify recurring coding problems
- Retain useful review insights
- Use previous knowledge during future reviews
- Create a simple and accessible developer tool

## 🚧 Future Enhancements

Potential future improvements include:

- Support for additional programming languages
- User authentication
- Individual developer memory profiles
- GitHub repository integration
- Pull-request code review
- IDE extensions
- Automated test generation
- Code execution and testing
- More advanced memory retrieval
- Code quality metrics
- Security vulnerability detection

## 👩‍💻 Project

**CodeMentor AI — Memory-Powered Java Code Review Assistant**

GitHub Repository:

https://github.com/nazminsk67-hash/codementor-ai

## 📜 License

This project is created for educational and hackathon purposes.
