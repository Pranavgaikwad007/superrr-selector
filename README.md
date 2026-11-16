# SupeRR Selector Season 2 — Cricket Pressure Intelligence

[![Python 3.11+](https://img.shields.io/badge/Python-3.11%2B-blue.svg)](https://www.python.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Tests Passing](https://img.shields.io/badge/Pytest-39%20passed-success.svg)](https://docs.pytest.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An end-to-end cricket analytics and machine learning platform built for the **Rajasthan Royals — SupeRR Selector Season 2** competition. The system rigorously quantifies match leverage and identifies the most reliable batters and bowlers under intense match pressure using historical ball-by-ball records from IPL and T20 Internationals (2022 onwards).

---

## 🏆 Official Top 10 Rankings

### Top 10 Batters Under Pressure

| Rank | Player Name | Team(s) | Reliability Score | 95% Bootstrap CI | Pressure Balls | $\text{SR}_{\text{press}}$ | Baseline SR | $\Delta\text{SR}$ | $\text{RA}_{100}$ | Boundary % | Dot % |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **Yashasvi Jaiswal** | Rajasthan Royals / India | **84.17** | [71.66, 96.68] | 276 | **179.71** | 156.36 | **+23.35** | **+39.41** | 28.62% | 26.09% |
| **2** | **Prabhsimran Singh** | Punjab Kings | **81.40** | [68.28, 94.52] | 251 | **178.09** | 160.05 | **+18.03** | **+38.34** | 27.09% | 27.49% |
| **3** | **Abhishek Sharma** | Sunrisers Hyderabad / India | **76.44** | [63.65, 89.23] | 264 | **185.23** | 186.49 | -1.27 | **+49.74** | 28.41% | 28.41% |
| **4** | **Naman Dhir** | Mumbai Indians / India | **76.11** | [62.00, 90.22] | 217 | **182.95** | 172.04 | **+10.91** | **+37.01** | 26.27% | 24.88% |
| **5** | **Quinton de Kock** | Lucknow Super Giants / South Africa | **73.97** | [60.49, 87.45] | 238 | **166.81** | 150.87 | **+15.94** | **+33.40** | 23.95% | 28.15% |
| **6** | **Suryakumar Yadav** | India / Mumbai Indians | **72.79** | [65.33, 80.25] | **777** | **165.77** | 166.43 | -0.66 | **+30.46** | 23.42% | 27.93% |
| **7** | **Reeza Hendricks** | South Africa | **71.69** | [57.34, 86.04] | 210 | **156.67** | 146.59 | **+10.08** | **+30.57** | 20.00% | 26.67% |
| **8** | **Heinrich Klaasen** | Sunrisers Hyderabad / South Africa | **70.51** | [61.66, 79.36] | 552 | **167.03** | 166.76 | +0.27 | **+29.48** | 22.46% | 25.91% |
| **9** | **Ajinkya Rahane** | Kolkata Knight Riders / CSK | **69.06** | [53.43, 84.69] | 177 | **163.28** | 139.12 | **+24.15** | **+27.82** | 18.64% | 25.42% |
| **10** | **Mohammad Rizwan** | Pakistan | **68.84** | [56.92, 80.76] | 304 | **147.70** | 127.34 | **+20.35** | **+19.85** | 15.46% | 23.03% |

---

### Top 10 Bowlers Under Pressure

| Rank | Player Name | Team(s) | Reliability Score | 95% Bootstrap CI | Pressure Overs | $\text{Econ}_{\text{press}}$ | Baseline Econ | $\Delta\text{Econ}$ | $\text{RP}_6$ | Dot % | Wicket SR |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **Jamie Overton** | England / Chennai Super Kings | **85.13** | [70.85, 99.41] | 35.3 ov (212b) | **6.25** | 8.22 | **-1.97** | **+2.01** | **49.53%** | **10.60** |
| **2** | **Sunil Narine** | Kolkata Knight Riders | **83.93** | [75.98, 91.88] | 114.0 ov (684b)| **5.87** | 6.76 | **-0.89** | **+2.40** | 40.94% | 18.00 |
| **3** | **Abrar Ahmed** | Pakistan | **81.74** | [70.08, 93.40] | 53.0 ov (318b) | **5.51** | 6.57 | **-1.06** | **+2.04** | 44.03% | 16.74 |
| **4** | **Sufiyan Muqeem** | Pakistan | **76.68** | [59.65, 93.71] | 24.8 ov (149b) | **5.60** | 6.37 | **-0.77** | **+2.05** | **53.69%** | **11.46** |
| **5** | **Mujeeb Ur Rahman** | Afghanistan / Mumbai Indians | **74.94** | [61.11, 88.77] | 37.7 ov (226b) | **6.08** | 6.78 | **-0.70** | **+1.61** | 44.25% | 12.56 |
| **6** | **Kuldeep Yadav** | Delhi Capitals / India | **73.08** | [66.23, 79.93] | **153.5 ov (921b)**| **6.94** | 7.84 | **-0.90** | **+1.13** | 36.16% | 14.62 |
| **7** | **Matheesha Pathirana** | Chennai Super Kings / Sri Lanka | **72.69** | [63.77, 81.61] | 90.5 ov (543b) | **7.24** | 7.78 | **-0.54** | **+1.44** | 37.57% | **13.58** |
| **8** | **Lockie Ferguson** | New Zealand / Gujarat Titans | **72.45** | [61.73, 83.17] | 62.7 ov (376b) | **7.47** | 8.37 | **-0.90** | **+1.20** | 44.68% | 12.97 |
| **9** | **Krunal Pandya** | Lucknow Super Giants / RCB | **72.36** | [63.37, 81.35] | 89.2 ov (535b) | **6.63** | 7.63 | **-1.00** | **+1.42** | 32.71% | 16.72 |
| **10** | **Mitchell Santner** | New Zealand / Mumbai Indians | **69.99** | [60.90, 79.08] | 87.2 ov (523b) | **6.68** | 7.20 | **-0.52** | **+1.13** | 38.05% | 16.34 |

---

## 🔬 Core Methodology & Mathematical Architecture

### 1. Zero Data Leakage & Pre-Delivery State
Every delivery state is calculated strictly before the ball is released:
- Balls remaining in quota ($120 - \text{legal\_balls}$)
- Pre-delivery score, wickets lost, and required run rate (RRR)
- DLS revised target handling and tie-break Super Over detection

### 2. Dual-Innings Dynamic Pressure Modeling
- **1st Innings Engine**: Combines DLS resource stress with real-time projected final total par deficit ($T_{\text{par}} = 165.0$) and death-overs urgency scaling.
- **2nd Innings Engine**: Computes delivery leverage via the **Win Probability Volatility Gradient** ($|\Delta\text{WP}|$ between boundary vs dismissal) conditioned on required run rate and remaining wickets.
- **Delivery Tiers**:
  - Ordinary ($<40.0$): 35.9% of deliveries
  - Medium ($40.0 \le \Psi < 65.0$): 28.8% of deliveries
  - High ($65.0 \le \Psi < 85.0$): 22.0% of deliveries
  - Extreme ($\Psi \ge 85.0$): 13.2% of deliveries
  - **High-Pressure Threshold ($\Psi \ge 65.0$)**: Captures **68,402 contest deliveries (35.26%)**.

### 3. Empirical Bayes Regularization & Uncertainty
- **Empirical Bayes Shrinkage**: Regularizes observed rates toward the qualified cohort mean ($\mu_0 = 50.0$) using prior weight $N_0 = 100$ deliveries, preventing small-sample distortions.
- **Bootstrap Confidence Intervals**: 1,000 resamples quantify ranking stability. The model explicitly highlights overlapping confidence intervals, noting that rankings reflect elite performance tiers rather than absolute discrete certainty.

---

## 📊 Dataset Ingestion & Verification Audit

- **Total Scheduled Fixtures**: 883 matches recorded in `matches.csv`.
- **Matches with Deliveries**: 867 matches (16 matches abandoned without a ball bowled: 4 IPL + 12 T20I).
- **Excluded Developmental Fixtures**: 30 `Other_T20` matches excluded to preserve professional competitive parity.
- **Eligible Senior Matches**: **837 matches** (367 IPL + 470 T20I).
- **Total Deliveries Analyzed**: **194,014 eligible deliveries** (out of 200,999 raw rows).
- **Qualified Cohort**: **135 batters** and **156 bowlers** (minimum 120 high-pressure balls, 8+ matches, 250+ total career balls).
- **Player Disambiguation**: 7 duplicate player names resolved strictly by unique integer `player_id`.

---

## 💻 Tech Stack & Deployment Architecture

```
┌───────────────────────────────────────┐
│     Python Data Science Pipeline      │
│  Pandas, NumPy, Scikit-learn, Pytest  │
└──────────────────┬────────────────────┘
                   │
                   ▼ (Optimized JSON Exports)
┌───────────────────────────────────────┐
│       React 19 + TypeScript + Vite    │
│   Tailwind CSS, Lucide, Recharts      │
└──────────────────┬────────────────────┘
                   │
                   ▼ (Static Deployment)
┌───────────────────────────────────────┐
│           Vercel Production           │
│    Fast Global CDN, Zero Backend Cost │
└───────────────────────────────────────┘
```

- **Analytics Engine**: Python 3.11+, Pandas, NumPy, Scikit-Learn.
- **Automated Tests**: 39 Pytest unit tests in `tests/` covering loaders, state reconstruction, pressure monotonicity, and ranking consistency.
- **Production Web Dashboard**: React 19, TypeScript, Tailwind CSS, Vite, Recharts, and Lucide React.
- **Deployment Platform**: Vercel (static single-page application served via global edge CDN).

---

## 📁 Repository Directory Structure

```text
superrr-selector/
├── .gitignore                   # Clean exclusions (data zips, parquet, node_modules)
├── README.md                    # Root project documentation (this file)
├── requirements.txt             # Python dependencies
├── app.py                       # Local Streamlit inspection tool
│
├── src/                         # Python Analytics Pipeline
│   ├── data_loader.py           # Ingestion, schema verification & extraction
│   ├── data_validator.py        # Referential integrity & collision checks
│   ├── match_state.py           # Pre-delivery state reconstruction (zero leakage)
│   ├── pressure_engine.py       # Dual-innings pressure detection engine
│   ├── batting_engine.py        # Batting clutch metrics & baseline computation
│   ├── bowling_engine.py        # Bowling clutch metrics & baseline computation
│   ├── ranking_engine.py        # Bayesian shrinkage & bootstrap confidence intervals
│   └── pipeline.py              # End-to-end automated pipeline runner
│
├── tests/                       # Automated Test Suite (39 Passing Tests)
│   ├── test_data_loader.py
│   ├── test_data_validator.py
│   ├── test_match_state.py
│   ├── test_pressure_engine.py
│   ├── test_ranking_engine.py
│   └── test_pipeline.py
│
├── outputs/                     # Validated Competition Deliverables
│   ├── UNSTOP_FINAL_RANKINGS.txt # Clean dropdown submission format for Unstop
│   ├── final_submission_checklist.md # Verification checklist
│   ├── top10_batters.csv        # Top 10 batters export
│   ├── top10_bowlers.csv        # Top 10 bowlers export
│   ├── all_batters_ranked.csv   # All 135 qualified batters
│   ├── all_bowlers_ranked.csv   # All 156 qualified bowlers
│   └── frontend_data.json       # Master payload for web dashboard
│
├── reports/                     # Formal Methodology Documentation
│   ├── final_methodology_report.md  # 17-section comprehensive methodology paper
│   └── final_methodology_report.pdf # 4-page verified, formatted PDF document
│
├── scripts/                     # Operational Utilities
│   └── generate_pdf_report.py   # ReportLab script compiling methodology PDF
│
└── frontend/                    # Production React + Vite Web Dashboard
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── vercel.json              # Vercel SPA routing configuration
    ├── src/
    │   ├── pages/               # 6 Complete Interactive Pages
    │   │   ├── OverviewPage.tsx
    │   │   ├── BattingLeaderboardPage.tsx
    │   │   ├── BowlingLeaderboardPage.tsx
    │   │   ├── PlayerComparisonPage.tsx
    │   │   ├── PressureExplorerPage.tsx
    │   │   └── MethodologyPage.tsx
    │   ├── components/          # Reusable UI widgets, radar charts, modals
    │   └── types/               # TypeScript interfaces
    └── dist/                    # Compiled production build ready for deployment
```

---

## 🚀 Reproduction & Setup Instructions

### 1. Clone Repository & Setup Python Environment
```bash
git clone https://github.com/Pranavgaikwad007/superrr-selector.git
cd superrr-selector

python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate  # macOS / Linux

pip install -r requirements.txt
```

### 2. Run Python Test Suite (39 Tests)
```bash
python -m pytest
```

### 3. Run End-to-End Pipeline
```bash
python -m src.pipeline
```

### 4. Compile Methodology PDF
```bash
python scripts/generate_pdf_report.py
```

### 5. Run Production Frontend Locally
```bash
cd frontend
npm install
npm run dev
```

---

## 📄 Submission Files

1. **Player Dropdown Selections**: [`outputs/UNSTOP_FINAL_RANKINGS.txt`](outputs/UNSTOP_FINAL_RANKINGS.txt)
2. **Methodology Report (PDF)**: [`reports/final_methodology_report.pdf`](reports/final_methodology_report.pdf)
3. **Methodology Report (Markdown)**: [`reports/final_methodology_report.md`](reports/final_methodology_report.md)
4. **Final Submission Verification Checklist**: [`outputs/final_submission_checklist.md`](outputs/final_submission_checklist.md)

---

## 👤 Author & Acknowledgements

Developed by **Pranav Gaikwad** (`Pranavgaikwad007`) for the **Rajasthan Royals — SupeRR Selector Season 2** competition.
