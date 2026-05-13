# Aggregate AI

AI-powered education platform designed to improve learning accessibility, teacher support, and digital education collaboration across Africa.

---

## Overview

Education AI is a mobile-first learning platform built to address challenges in modern education systems, such as:

* High student-to-teacher ratios
* Limited educational resources
* Curriculum transition challenges
* Lack of personalised learning support
* Limited access to digital learning tools

The platform combines artificial intelligence, curriculum-aligned content, and school collaboration tools to create a scalable education ecosystem for students, teachers, and schools.

---

## Features

### Student Features

* AI-powered learning assistant
* Personalised learning support
* Interactive quizzes and assessments
* Topic explanations aligned to the curriculum
* Revision and exam preparation
* Offline learning capabilities
* Voice and text AI interactions

### Teacher Features

* Upload and manage learning materials
* Assignment and assessment creation
* AI-assisted lesson preparation
* Student progress tracking
* Classroom collaboration tools

### School Features

* School management dashboard
* Student and teacher onboarding
* Academic analytics
* Content sharing system
* Performance monitoring

### AI Features

* Intelligent tutoring
* AI-generated explanations
* Question generation
* Learning recommendations
* Summarization
* Semantic search
* Curriculum-aware responses

---

## Tech Stack

### Frontend

* Ionic Framework
* Vue.js
* Capacitor

### Backend

* Supabase
* PostgreSQL
* Supabase Edge Functions

### AI

* Open-source LLMs
* Gemma
* Qwen
* Retrieval-Augmented Generation (RAG)

---

## Architecture

```text
Mobile App (Ionic + Vue)
        |
        v
Supabase Backend
        |
        +----------------------+
        |                      |
        v                      v
 Authentication          PostgreSQL Database
        |                      |
        v                      v
 Edge Functions         Learning Content
        |                      |
        +----------+-----------+
                   |
                   v
              AI Services
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/education-ai.git
```

### Navigate into Project

```bash
cd education-ai
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
ionic serve
```

### Build Mobile Application

```bash
ionic build
npx cap sync
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_AI_API_KEY=
```

---

## Project Goals

* Improve access to quality education
* Support competency-based learning
* Enable scalable AI-assisted education
* Empower schools with digital tools
* Promote STEM education
* Support offline-first learning environments

---

## Roadmap

### Phase 1

* Authentication
* AI chat assistant
* Curriculum management
* Student onboarding

### Phase 2

* Teacher dashboards
* School portals
* Assignments and assessments
* Learning analytics

### Phase 3

* Offline AI support
* Gamification
* Voice tutor
* Smart recommendations

### Phase 4

* Regional expansion
* Multi-language support
* Advanced AI personalisation

---

## Security

* JWT Authentication
* Row Level Security (RLS)
* Secure API communication
* Role-based access control

---

## Contributing

Contributions are welcome from developers, educators, curriculum specialists, and AI researchers.

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Open a pull request

---

## Vision

To revolutionise the dissemination of academic knowledge across Africa through artificial intelligence and accessible technology.

---

## Founder

Built by Joshua Kato
katoj65@gmail.com

