# Phase 2 Methodology Report: Cricket Pressure Detection Engine

## Project: SupeRR Selector Season 2 — Cricket Pressure Intelligence

> **Executive Summary**: This document details the mathematical, empirical, and contextual formulation of the **SupeRR Pressure Detection Engine**. The engine assigns a strictly pre-delivery pressure index on a normalized $[0, 100]$ scale for all 200,999 deliveries in the dataset, ensuring zero data leakage, chronological validation, and robust context awareness.

---

## 1. Defining Match Pressure in T20 Cricket

Pressure in professional T20 cricket is **not** simply a function of overs remaining. Treating every death-over ball as high pressure is statistically invalid: a team chasing 15 runs off 30 balls with 8 wickets in hand experiences negligible pressure, whereas a team requiring 45 runs off 18 balls with 4 wickets in hand operates under extreme tension.

We define Pressure as the mathematical conjunction of three fundamental dimensions:
1. **Outcome Uncertainty / Leverage ($U$)**: The degree to which the match outcome hangs in the balance. When Win Probability ($P$) is near $50\%$, leverage and volatility peak ($U = 4P(1-P) \to 1.0$). When $P \to 1.0$ (certain victory) or $P \to 0.0$ (impossible defeat / dead rubber), tension deflates.
2. **Task Urgency & Deficit ($D$)**: The gap between the required scoring rate ($RRR$) and the achievable baseline rate ($8.5$ rpo), modulated by resource scarcity.
3. **Resource Vulnerability ($V$)**: Wickets in hand. As wickets fall, the remaining batting order is exposed, and the cost of an error escalates non-linearly.
4. **Stage Stakes ($S$) & Knockout Multiplier ($K$)**: Deliveries closer to match completion leave less recovery time, while knockout matches (`knock_out == 1`) carry elimination stakes.

---

## 2. Second-Innings Model: Empirical Win-Probability & Leverage

### 2.1 Model Architecture & Chronological Split
An empirical Logistic Regression Win Probability pipeline was trained strictly on chronological splits to prevent temporal leakage:
- **Training Set**: Deliveries from seasons 2022 through 2024 (57,443 deliveries).
- **Test / Validation Set**: Deliveries from seasons 2025 and 2026 (37,703 deliveries).

### 2.2 Validation Metrics (Out-of-Time Test Set)
- **ROC-AUC**: **0.9051** (indicating high discriminatory calibration between wins and losses)
- **Brier Score Loss**: **0.1269**
- **Log Loss**: **0.3881**

### 2.3 Feature Importance & Interpretability
| Feature | Coefficient | Interpretation |
| :--- | :--- | :--- |
| `runs_per_wicket` | `-2.565` | Primary driver: required runs per remaining wicket sharply decreases win probability |
| `rrr_capped` | `-0.770` | High required run rate penalizes win probability |
| `wickets_in_hand` | `0.485` | Higher wickets in hand directly protects win equity |
| `balls_remaining` | `0.414` | Time available to construct the chase |
| `current_run_rate` | `0.106` | Scoring momentum signal |

### 2.4 Chasing Pressure Formula
$$\text{Raw Chasing Pressure} = \left[ U^{0.65} \times \left(0.35 + 0.35 \cdot D_{\text{RRR}} + 0.30 \cdot V_{\text{wickets}}\right) \right] \times \left(0.75 + 0.50 \cdot S_{\text{stage}}\right) \times K_{\text{knockout}}$$

---

## 3. First-Innings Model: Expected Resource Potential & Deficit

In the first innings, there is no fixed target. Teams bat against an expected competitive benchmark ($T_{\text{par}} = 185$ for IPL, $170$ for T20I).

### 3.1 Model Architecture & Out-of-Time Validation
A Ridge regression resource model was trained chronologically to project the expected final total $\hat{Y}$ strictly before each ball:
- **Test MAE**: **18.15 runs**
- **Test $R^2$**: **0.6132**

### 3.2 First-Innings Pressure Formula
$$\text{Raw Innings 1 Pressure} = \left[ 0.40 + 0.35 \cdot D_{\text{deficit}} + 0.35 \cdot V_{\text{scarcity}} \right] \times \left( 0.70 + 0.45 \cdot S_{\text{stage}} + 0.20 \cdot L_{\text{wicket}} \right) \times K_{\text{knockout}}$$
Where:
- $D_{\text{deficit}} = \text{clip}\left(\frac{T_{\text{par}} - \hat{Y}}{40.0}, -0.5, 1.5\right)$
- $V_{\text{scarcity}} = \frac{W_{\text{lost}}}{9.0}$ (defensive collapse pressure)
- $L_{\text{wicket}} = \text{clip}\left(\frac{5 - W_{\text{rem}}}{4.0}, 0, 1\right)$ (tail exposure volatility)

---

## 4. Calibration & Unified 0–100 Normalization

Because 1st and 2nd innings operate on different physical dimensions, **raw scores cannot be directly compared without calibration**.
We apply monotonic quantile mapping independently to 1st and 2nd innings distributions so that every calibrated score maps directly to its true contextual percentile rank:
- **Innings 1 Mean**: **50.00** (Std: 28.87, Median: 50.00)
- **Innings 2 Mean**: **50.00** (Std: 28.87, Median: 50.00)
- **Mean Divergence**: **< 0.01 points** (demonstrating exact distribution alignment).

### Documented Pressure Tiers
| Tier | Score Range | Deliveries Count | Percentage | Contextual Definition |
| :--- | :--- | :--- | :--- | :--- |
| **Ordinary** | `[0, 35]` | 69,686 | 34.97% | Standard play; low leverage; outcome largely under control or platform building |
| **Medium** | `[35, 65]` | 59,897 | 30.06% | Balanced competitive contest; standard middle-overs execution |
| **High** | `[65, 85]` | 39,884 | 20.02% | Tense match state; critical wickets in balance; demanding required rate |
| **Extreme** | `[85, 100]` | 29,779 | 14.95% | Clutch championship moments; final-over shootouts; Super Overs |

---

## 5. Sensitivity Analysis

### 5.1 Threshold Boundary Sensitivity
| Configuration | Ordinary | Medium | High | Extreme |
| :--- | :--- | :--- | :--- | :--- |
| `baseline [35, 65, 85]` | 34.87% | 30.06% | 20.01% | 15.05% |
| `conservative [30, 60, 80]` | 29.87% | 30.07% | 20.01% | 20.05% |
| `strict [40, 70, 90]` | 39.88% | 30.06% | 20.01% | 10.05% |

### 5.2 Knockout Stakes Multiplier Sensitivity
- **Knockout Matches Deliveries**: 7,335
- **Knockout Mean Pressure Score**: **55.94**
- **Regular Matches Mean Pressure Score**: **49.82**
- **Empirical Knockout Uplift**: **+6.12 points** (statistically aligns with the heightened psychological stakes of knockout cricket)

---

## 6. Real Match Case Studies

### Case Study 1: IPL 2023 Final (Match 21586 — CSK vs GT Thriller)
- **Situation**: Rain-shortened chase of 171 in 15 overs (90 balls).
- **Final Over**: Mohit Sharma defending 13 runs against Shivam Dube and Ravindra Jadeja.
- **Pressure Trajectory**:
  - Ball 1 (dot ball, 13 off 5 needed): `Win Prob = 0.684` $\to$ **Pressure: 99.55 (Extreme)**
  - Ball 2 (single, 12 off 4 needed): `Win Prob = 0.510` $\to$ **Pressure: 99.99 (Extreme)**
  - Ball 3 (single, 11 off 3 needed): `Win Prob = 0.358` $\to$ **Pressure: 100.00 (Peak Extreme)**
  - Ball 4 (single, 10 off 2 needed): `Win Prob = 0.162` $\to$ **Pressure: 99.65 (Extreme)**
  - Ball 5 (Jadeja hits SIX, 4 off 1 needed): `Win Prob = 0.022 -> 0.138` $\to$ **Pressure: 99.28 (Extreme)**
  - Ball 6: Jadeja hits FOUR to win the IPL championship on the final delivery.

### Case Study 2: Comfortable Chase (Match 13511 — West Indies vs England)
- **Situation**: Chasing a modest 104; cruising at 95/1 after 16 overs.
- **Pressure Trajectory**: Throughout the final 12 deliveries, `Win Prob >= 0.990`, yielding **Pressure: 7.25 – 9.88 (Ordinary Tier)**.
- Demonstrates that death overs under non-competitive scorelines are correctly recognized as low pressure.

### Case Study 3: Super Over Shootouts (Match 40725 — DC vs RR Tied)
- All Super Over deliveries in Innings 3 and 4 are anchored between **85.0 and 100.0 (Extreme Tier)**, reflecting the sudden-death leverage of 6-ball eliminators.

---
*Report auto-generated by SupeRR Selector Phase 2 Pressure Detection Pipeline.*