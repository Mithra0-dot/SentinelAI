# 🛡️ SentinelAI – Hyperlocal Civic Intelligence Platform

## Overview

SentinelAI is an AI-powered civic issue reporting platform that enables citizens to report infrastructure problems such as potholes, water leakages, garbage accumulation, road damage, and broken streetlights using images and location data.

The platform automatically analyzes uploaded images using Google's Gemini AI, prioritizes issues based on severity and community engagement, recommends the responsible government department, and verifies completed repairs using before-and-after image comparison.

---

## Problem Statement

Municipal authorities receive thousands of civic complaints every day, many of which lack sufficient details, making manual verification and prioritization difficult.

SentinelAI automates this workflow using Artificial Intelligence, allowing authorities to:

* Detect civic issues automatically
* Prioritize high-impact problems
* Recommend the appropriate department
* Verify completed repairs
* Visualize issues on an interactive map

---

## Key Features

### AI Image Analysis

* Detects civic issue type
* Predicts severity
* Generates issue description
* Provides confidence score

### Smart Issue Reporting

* Upload issue image
* Automatic GPS location tagging
* Stores reports in MySQL

### Interactive Live Map

* Displays reported issues using Leaflet
* Real-time updates
* Status tracking

### AI Priority Dashboard

Ranks issues using:

Priority Score =
Severity +
AI Confidence +
Community Votes

This helps authorities focus on the most critical issues first.

### AI Recommendation Engine

Google Gemini recommends:

* Responsible Department
* Recommended Action
* Urgency Level
* Estimated Resolution Time
* Citizen Advice

### Community Participation

* Upvote issues
* Track repair progress
* Update issue status

### AI Repair Verification

Upload an "After Repair" image.

Gemini compares:

Before Image → After Image

and predicts:

* Resolved
* Partially Resolved
* Not Resolved

with confidence and explanation.

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Leaflet
* Axios

### Backend

* FastAPI
* Python
* Google Gemini API
* MySQL

### AI

* Gemini 2.5 Flash
* Computer Vision
* Prompt Engineering

---

## Project Architecture

Citizen
↓
Upload Image
↓
React Frontend
↓
FastAPI Backend
↓
Gemini AI Analysis
↓
MySQL Database
↓
Live Dashboard + Interactive Map

---

## Installation

### Backend

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
npm install
npm run dev
```

---

## Environment Variables

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=
```

---

## Future Enhancements

* Route optimization for municipal vehicles
* Predictive hotspot analytics
* Mobile application
* SMS/Email notifications
* Citizen reward system
* Administrative dashboard
* Government API integration

---

## Developed By

**Sangamithra K**

Artificial Intelligence & Machine Learning Student

Built for AI-powered Smart City Governance and Civic Intelligence.
