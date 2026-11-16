# SupeRR Selector Season 2 — Final Methodology Report
## Cricket Pressure Intelligence: Quantifying Player Reliability Under Match Stress
**Organization**: Rajasthan Royals & Unstop  
**Author**: Pranav Gaikwad (`Pranavgaikwad007`)  
**Scope**: Historical IPL & T20 International Matches (2022 onwards)  
**Date of Submission**: November 2026  

---

## 1. Executive Summary

In high-stakes Twenty20 cricket, standard aggregated statistics—such as raw batting strike rate or bowling economy rate—fail to distinguish between low-consequence "garbage time" and critical match-defining leverage. A batter striking at 170 during a lopsided contest with 40 runs needed off 40 balls with 8 wickets in hand faces fundamentally different psychological and tactical constraints than a batter required to score 22 off 9 balls in a playoff knockout. Similarly, a bowler defending 8 runs in the final over operates under vastly different pressure dynamics than one bowling with 60 runs to defend.

This report presents the **Cricket Pressure Intelligence System (CPIS)**, a principled, data-driven framework developed for the **SupeRR Selector Season 2** competition. The system rigorously reconstructs ball-by-ball match states, defines an objective, continuous pre-delivery Pressure Index ($\Psi \in [0, 100]$), models the asymmetric mechanics of 1st-innings score projection versus 2nd-innings win probability swings, computes context-aware performance deltas, and synthesizes player performance using empirical Bayesian shrinkage with 1,000-iteration bootstrap confidence intervals.

### Primary Analytical Findings
1. **Contest Scope**: Across 883 scheduled fixtures (incorporating 837 senior eligible matches with ball-by-ball delivery records, comprising 367 IPL and 470 T20I fixtures) and 194,014 eligible contest deliveries, **68,402 deliveries (35.26%)** exceed the high-pressure threshold ($\Psi \ge 65.0$).
2. **Top Ranked Batter**: **Yashasvi Jaiswal** (Rajasthan Royals / India) achieves the #1 batting rank with an overall Pressure Reliability Score of **84.17 / 100** (95% CI: [71.66, 96.68]), elevating his strike rate from 156.36 baseline to **179.71** under high pressure ($\Delta\text{SR} = +23.35$), generating **+39.41 runs added per 100 balls** with a boundary rate of 28.62%.
3. **Top Ranked Bowler**: **Jamie Overton** (England / Chennai Super Kings) achieves the #1 bowling rank with an overall Pressure Reliability Score of **85.13 / 100** (95% CI: [70.85, 99.41]), restricting high-pressure scoring to an economy rate of **6.25** (down from 8.22 baseline, $\Delta\text{Econ} = -1.97$), preventing **+2.01 runs per 6 balls**, with a pressure wicket strike rate of **10.60 balls/wicket** and 49.53% dot ball execution.
4. **Ranking Uncertainty & Confidence Intervals**: Due to finite sample sizes in clutch scenarios, 95% bootstrap confidence intervals show substantial overlap among adjacent ranks (e.g., Jaiswal [71.66, 96.68] vs. Prabhsimran Singh [68.28, 94.52]). While point estimates identify the highest-probability leaders, rankings must be interpreted as performance tiers rather than absolute discrete distinctions.

---

## 2. Problem Understanding

The challenge posed in Round 1 of SupeRR Selector Season 2 asks:
> *"Build a data-driven system that measures how batters and bowlers perform in high-pressure match situations compared with their usual performance levels. Use your system to identify and rank the players who deliver most consistently when it matters."*

### Analytical Requirements & Challenges
1. **Mathematical Definition of Pressure**: Pressure is not a static property of an over or tournament; it varies dynamically ball-by-ball based on remaining resources (balls and wickets) and required execution (required run rate or par score deficit).
2. **Asymmetric Innings Realities**:
   - In the **1st innings**, the target does not exist. The batting side seeks to maximize total runs against historical venue par, while managing wicket conservation against death-overs acceleration.
   - In the **2nd innings**, an exact target is fixed. Pressure is fundamentally governed by the Win Probability Gradient—the magnitude of win probability variance at stake on each ball.
3. **Context-Aware Comparison**: A batter scoring 14 off 8 balls in a 12 RRR situation performs at par, whereas scoring 14 off 8 when the required rate is 7 is pedestrian. Absolute rates must be benchmarked against dynamic match expectations.
4. **Sample Size & Selection Bias**: Clutch situations constitute a minority of contest deliveries (~35%). Players with 15 balls of extreme hitting could artificially dominate rankings without Bayesian regularization.

---

## 3. Dataset Description

The analysis operates on official historical IPL and T20 International ball-by-ball and relational tracking records provided for the competition:

| Table / File Name | Records Ingested | Key Schema Columns | Role in Pipeline |
| :--- | :--- | :--- | :--- |
| `ball_by_ball.csv` | 200,999 rows | `match_id`, `innings`, `over`, `ball`, `striker_id`, `bowler_id`, `runs_off_bat`, `extras`, `wides`, `noballs`, `wicket_type`, `player_dismissed_id` | Core micro-level delivery event stream |
| `match.csv` | 883 rows | `match_id`, `competition_id`, `match_date`, `venue_id`, `toss_winner_id`, `toss_decision`, `winner_id`, `result`, `target_runs` | Match-level metadata, scheduled status, venue, and outcome |
| `player.csv` | 959 rows | `player_id`, `player_name`, `batting_hand`, `bowling_skill`, `country_id` | Player master registry and biographical attributes |
| `competition.csv` | 141 rows | `competition_id`, `competition_name`, `competition_type` | Competition tier filtering (IPL vs T20I vs Other) |
| `team.csv` | 68 rows | `team_id`, `team_name`, `team_short_name` | Franchise and national team lookup |
| `competition_team_player.csv`| 4,210 rows | `competition_id`, `team_id`, `player_id`, `season` | Roster and multi-team affiliation mapping |

---

## 4. Data Cleaning and Match Reconstruction

### 4.1 Match Filtering and Scope Enforcement
- **Scheduled Fixtures Audit**: The raw `match.csv` lists 883 matches.
- **Abandoned Matches**: 16 matches were abandoned without a ball bowled (4 IPL fixtures and 12 T20I matches impacted by rain or cancellations), leaving 867 matches with delivery data.
- **Competition Exclusion**: 30 developmental fixtures categorized under `Other_T20` (e.g., regional preparatory leagues) were excluded to maintain competitive parity between top-flight international and IPL environments.
- **Eligible Match Corpus**: **837 senior matches** (367 IPL + 470 senior T20I matches), encapsulating **194,014 eligible contest deliveries**.

### 4.2 Entity Resolution & Collision Prevention
A critical data integrity check revealed that **7 player names share multiple distinct `player_id` entities** in the registry (e.g., `Abdul Samad` [SRH vs Pakistan A], `Haider Ali` [Pakistan vs UAE]). 
- **Enforcement Rule**: The entire pipeline strictly indexes and aggregates by integer `player_id`. Player names and multi-team strings (`Rajasthan Royals / India`, `Kolkata Knight Riders`, etc.) are mapped solely for presentation after all Bayesian calculations are finalized, preventing cross-entity contamination.

### 4.3 Deterministic Match-State Reconstruction (Zero Data Leakage)
To prevent retrospective data leakage (e.g., using post-delivery runs or end-of-innings totals to define the current ball's pressure), all match states are reconstructed chronologically strictly **before the bowler releases the ball**:
- `balls_remaining`: Exact count of legal balls remaining in the 20-over quota ($120 - \text{legal\_balls\_bowled}$).
- `wickets_lost`: Exact tally of dismissals prior to the current delivery ($10 - \text{wickets\_lost} = \text{wickets\_remaining}$).
- `current_score`: Cumulative runs scored by the batting side prior to the current delivery.
- `runs_required`: In the 2nd innings, $\max(1, \text{target\_runs} - \text{current\_score})$.
- `required_run_rate (RRR)`: $\frac{\text{runs\_required}}{\text{balls\_remaining} / 6.0}$.

---

## 5. Mathematical Pressure Definition

Pressure ($\Psi$) is formulated as a continuous leverage metric scaled from 0 to 100, representing the acute difficulty and outcome-sensitivity of the immediate delivery.

```
                      ┌──────────────────────────────────────┐
                      │    Delivery Context Pre-Ball State   │
                      └──────────────────┬───────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
     ┌───────────────────────┐                       ┌───────────────────────┐
     │   1st Innings Model   │                       │   2nd Innings Model   │
     │ Projected Par Deficit │                       │ Win Probability Slope │
     │  Resource Depletion   │                       │   Required Run Rate   │
     └───────────┬───────────┘                       └───────────┬───────────┘
                 │                                               │
                 └───────────────────────┬───────────────────────┘
                                         ▼
                      ┌──────────────────────────────────────┐
                      │ Quantile Normalization & Calibration │
                      │       Pressure Index Ψ ∈ [0, 100]    │
                      └──────────────────┬───────────────────┘
                                         ▼
                      ┌──────────────────────────────────────┐
                      │ High Pressure Threshold (Ψ ≥ 65.0)   │
                      │       68,402 Deliveries (35.3%)      │
                      └──────────────────────────────────────┘
```

Pressure is categorized into four tactical operational tiers:
- **Ordinary Pressure** ($\Psi < 40.0$): 69,686 deliveries (35.9%) — early consolidation, low required run rates, comfortable margins.
- **Medium Pressure** ($40.0 \le \Psi < 65.0$): 55,926 deliveries (28.8%) — standard mid-innings overs, balanced contest states.
- **High Pressure** ($65.0 \le \Psi < 85.0$): 42,750 deliveries (22.0%) — escalating run chases, middle-order collapses, late-overs defence.
- **Extreme Pressure** ($\Psi \ge 85.0$): 25,652 deliveries (13.2%) — clutch death overs, steep required run rates, single-digit balls remaining with matches hanging in the balance.

---

## 6. First-Innings and Second-Innings Models

### 6.1 First-Innings Pressure Engine
In the 1st innings, pressure is driven by expected total optimization under resource depletion:

$$\Psi_{\text{inn1}} = w_1 \cdot \text{ResourceStress} + w_2 \cdot \text{ParDeficit} + w_3 \cdot \text{DeathOversBonus}$$

Where:
- **Resource Stress**: Computed using the Duckworth-Lewis-Stern resource depletion principle:
  $$\text{ResourceStress} = 1.0 - \left( \frac{\text{balls\_remaining}}{120} \times \frac{\text{wickets\_remaining}}{10} \right)^{0.65}$$
- **Par Deficit**: Comparison between current projected total and historical T20 venue par (165.0):
  $$\text{ParDeficit} = \sigma\left(\frac{165.0 - \text{ProjectedTotal}}{18.0}\right)$$
  Where $\text{ProjectedTotal} = \text{current\_score} + \text{CRR} \times \frac{\text{balls\_remaining}}{6.0}$.
- **Death Phase Weighting**: Overs 16–20 receive non-linear compounding stress scaling up to 1.35x.

### 6.2 Second-Innings Pressure Engine
In the 2nd innings, pressure is modeled via the **Win Probability Volatility Gradient**:

$$WP = \frac{1}{1 + e^{-z}}$$

$$z = \beta_0 + \beta_1(\text{RRR} - \text{CRR}) + \beta_2\left(\frac{\text{runs\_required}}{\text{wickets\_remaining} + 1}\right) - \beta_3(\text{balls\_remaining})$$

The delivery-level leverage is the absolute rate of change of win probability with respect to standard outcome events (wicket vs. boundary):

$$\text{Leverage} = |WP(\text{boundary}) - WP(\text{wicket})|$$

$$\Psi_{\text{inn2}} = 100 \times \left( 0.50 \cdot \text{Leverage} + 0.35 \cdot \text{MinMax}(\text{RRR}) + 0.15 \cdot \text{WicketFragility} \right)$$

---

## 7. Batting Performance Metrics

A batter's performance under pressure is assessed across four orthogonal dimensions:

1. **Strike Rate Acceleration ($\Delta\text{SR}$)**:
   $$\Delta\text{SR} = \text{SR}_{\text{pressure}} - \text{SR}_{\text{overall}}$$
   $$\text{SR} = \frac{\text{Runs}}{\text{Balls}} \times 100$$
2. **Context-Aware Runs Added per 100 Balls ($\text{RA}_{100}$)**:
   $$\text{RA}_{100} = \sum_{i=1}^{N_p} (\text{runs\_scored}_i - \text{expected\_runs}_i) \times \frac{100}{N_p}$$
3. **Execution Safety Ratio (Boundary % to Dot %)**:
   $$\text{Boundary}\% = \frac{\text{Fours} + \text{Sixes}}{\text{Balls Faced}} \times 100, \quad \text{Dot}\% = \frac{\text{Balls with 0 Runs}}{\text{Balls Faced}} \times 100$$
4. **Match Impact Consistency Rate**:
   $$\text{Consistency}\% = \frac{\text{Matches with Positive Net Runs Added}}{\text{Total Pressure Matches}} \times 100$$

---

## 8. Bowling Performance Metrics

A bowler's ability to suffocate scoring and take high-leverage wickets is evaluated via:

1. **Economy Suppression ($\Delta\text{Econ}$)**:
   $$\Delta\text{Econ} = \text{Econ}_{\text{pressure}} - \text{Econ}_{\text{overall}} \quad (\text{Target: } \Delta\text{Econ} < 0)$$
   $$\text{Econ} = \frac{\text{Runs Conceded}}{\text{Overs Bowled}}$$
2. **Runs Prevented per 6 Balls ($\text{RP}_6$)**:
   $$\text{RP}_6 = \sum_{i=1}^{B_p} (\text{expected\_conceded}_i - \text{actual\_conceded}_i) \times \frac{6}{B_p}$$
3. **High-Pressure Dot Ball Execution & Boundary Containment**:
   $$\text{Dot}\% = \frac{\text{0-Run Deliveries Bowled}}{\text{Pressure Balls Bowled}} \times 100, \quad \text{Boundary}\% = \frac{\text{Boundaries Conceded}}{\text{Pressure Balls Bowled}} \times 100$$
4. **Pressure Wicket Strike Rate**:
   $$\text{Wicket SR} = \frac{\text{Pressure Balls Bowled}}{\text{Wickets Taken Under Pressure}}$$

---

## 9. Context-Aware Baselines

A fatal error in amateur cricket analytics is comparing raw strike rates without adjusting for phase or required run rate. In CPIS:
- Every delivery is mapped to a dynamic expectation matrix conditioned on:
  1. Over group: Powerplay (1–6), Middle Consolidation (7–11), Middle Acceleration (12–15), Death (16–20).
  2. Innings (1st vs 2nd).
  3. Pre-ball required run rate decile (for chases) or par deficit quintile (for 1st innings).
- **Baseline Expectation**:
  $$\text{ExpectedRuns}_{i} = \mathbb{E}[\text{Runs} \mid \text{OverBucket}, \text{Innings}, \text{PhaseStress}]$$
  $$\text{ExpectedDismissal}_{i} = \mathbb{P}[\text{Wicket} \mid \text{OverBucket}, \text{Innings}, \text{PhaseStress}]$$

---

## 10. Bayesian Reliability Scoring

Small sample sizes in extreme situations produce erratic noise. A batter hitting 30 off 10 balls in a single pressure chase cannot be crowned the #1 clutch batter in world cricket over someone sustaining elite numbers across 500 balls.

### Empirical Bayes Shrinkage
Player scores are shrunk toward the qualified population mean ($\mu_0 = 50.0$):

$$\hat{R}_{\text{Bayes}} = \frac{N_p}{N_p + N_0} \cdot R_{\text{observed}} + \frac{N_0}{N_p + N_0} \cdot \mu_0$$

Where:
- $N_p$: Number of high-pressure deliveries faced or bowled by the player.
- $N_0 = 100.0$: Prior pseudo-observation weight, established through cross-validated leave-one-season-out tuning.
- $R_{\text{observed}}$: Raw composite performance index computed from performance deltas ($\Delta\text{SR}$, $\text{RA}_{100}$, consistency, boundary/dot execution).

---

## 11. Player Eligibility and Fair Comparisons

To ensure fair and statistically robust comparisons between IPL franchise specialists and international circuit regulars:
1. **Minimum High-Pressure Deliveries**: $\ge 120$ high-pressure deliveries ($\Psi \ge 65.0$).
2. **Minimum Matches Contested**: $\ge 8$ matches with high-pressure exposure.
3. **Minimum Total Career Volume**: $\ge 250$ total balls in the 2022–2026 database.

### Qualification Summary
- Out of 959 registered active players:
  - **135 qualified batters** met all three thresholds.
  - **156 qualified bowlers** met all three thresholds.
  - Total qualified cohort: **291 elite cricketers**.

---

## 12. Top 10 Batters with Supporting Evidence

The table below presents the verified Top 10 Batters under Pressure:

| Rank | Player Name | Teams | Reliability Score | 95% CI | Pressure Balls | $\text{SR}_{\text{press}}$ | Baseline SR | $\Delta\text{SR}$ | $\text{RA}_{100}$ | Dot % | Bnd % | Consistency |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **Yashasvi Jaiswal** | RR / India | **84.17** | [71.66, 96.68] | 276 | 179.71 | 156.36 | **+23.35** | **+39.41** | 26.09% | 28.62% | 66.67% |
| **2** | **Prabhsimran Singh** | PBKS | **81.40** | [68.28, 94.52] | 251 | 178.09 | 160.05 | **+18.03** | **+38.34** | 27.49% | 27.09% | 72.22% |
| **3** | **Abhishek Sharma** | SRH / India | **76.44** | [63.65, 89.23] | 264 | 185.23 | 186.49 | -1.27 | **+49.74** | 28.41% | 28.41% | 67.86% |
| **4** | **Naman Dhir** | MI / India | **76.11** | [62.00, 90.22] | 217 | 182.95 | 172.04 | **+10.91** | **+37.01** | 24.88% | 26.27% | 65.22% |
| **5** | **Quinton de Kock** | LSG / SA | **73.97** | [60.49, 87.45] | 238 | 166.81 | 150.87 | **+15.94** | **+33.40** | 28.15% | 23.95% | 66.67% |
| **6** | **Suryakumar Yadav** | India / MI | **72.79** | [65.33, 80.25] | **777** | 165.77 | 166.43 | -0.66 | **+30.46** | 27.93% | 23.42% | 62.96% |
| **7** | **Reeza Hendricks** | South Africa | **71.69** | [57.34, 86.04] | 210 | 156.67 | 146.59 | **+10.08** | **+30.57** | 26.67% | 20.00% | 66.67% |
| **8** | **Heinrich Klaasen** | SRH / SA | **70.51** | [61.66, 79.36] | 552 | 167.03 | 166.76 | +0.27 | **+29.48** | 25.91% | 22.46% | 62.50% |
| **9** | **Ajinkya Rahane** | KKR / CSK | **69.06** | [53.43, 84.69] | 177 | 163.28 | 139.12 | **+24.15** | **+27.82** | 25.42% | 18.64% | 66.67% |
| **10** | **Mohammad Rizwan** | Pakistan | **68.84** | [56.92, 80.76] | 304 | 147.70 | 127.34 | **+20.35** | **+19.85** | 23.03% | 15.46% | 64.71% |

### Analytical Insights on Key Batters:
- **Yashasvi Jaiswal (#1)**: Exhibits phenomenal gear-shifting in pressure environments. When the match demands rapid acceleration, his strike rate surges from 156.36 to 179.71 (+23.35), with over 28.6% of pressure balls finding the fence.
- **Suryakumar Yadav (#6)**: Faced an immense 777 pressure balls (the highest among all top 10 batters), yielding the tightest 95% confidence interval ($\pm 7.46$). While his $\Delta\text{SR}$ is near zero (-0.66), maintaining a 165.77 strike rate across 777 high-pressure balls is an extraordinary baseline of sustained excellence.
- **Abhishek Sharma (#3)**: Boasts the highest raw run generation under pressure (+49.74 runs added per 100 balls), striking at 185.23.

---

## 13. Top 10 Bowlers with Supporting Evidence

The table below presents the verified Top 10 Bowlers under Pressure:

| Rank | Player Name | Teams | Reliability Score | 95% CI | Pressure Overs | $\text{Econ}_{\text{press}}$ | Baseline Econ | $\Delta\text{Econ}$ | $\text{RP}_6$ | Dot % | Bnd % | Wicket SR | Consistency |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **Jamie Overton** | ENG / CSK | **85.13** | [70.85, 99.41] | 35.3 ov (212b) | **6.25** | 8.22 | **-1.97** | **+2.01** | **49.53%** | 12.26% | **10.60** | **77.78%** |
| **2** | **Sunil Narine** | KKR | **83.93** | [75.98, 91.88] | 114.0 ov (684b)| **5.87** | 6.76 | **-0.89** | **+2.40** | 40.94% | **8.19%** | 18.00 | 71.11% |
| **3** | **Abrar Ahmed** | Pakistan | **81.74** | [70.08, 93.40] | 53.0 ov (318b) | **5.51** | 6.57 | **-1.06** | **+2.04** | 44.03% | **7.86%** | 16.74 | 73.91% |
| **4** | **Sufiyan Muqeem** | Pakistan | **76.68** | [59.65, 93.71] | 24.8 ov (149b) | **5.60** | 6.37 | **-0.77** | **+2.05** | **53.69%** | 10.07% | **11.46** | 66.67% |
| **5** | **Mujeeb Ur Rahman** | AFG / MI | **74.94** | [61.11, 88.77] | 37.7 ov (226b) | **6.08** | 6.78 | **-0.70** | **+1.61** | 44.25% | 10.18% | 12.56 | 70.83% |
| **6** | **Kuldeep Yadav** | DC / India | **73.08** | [66.23, 79.93] | **153.5 ov (921b)**| 6.94 | 7.84 | **-0.90** | **+1.13** | 36.16% | 11.29% | 14.62 | 68.85% |
| **7** | **Matheesha Pathirana** | CSK / SL | **72.69** | [63.77, 81.61] | 90.5 ov (543b) | 7.24 | 7.78 | **-0.54** | **+1.44** | 37.57% | 13.08% | **13.58** | **75.00%** |
| **8** | **Lockie Ferguson** | NZ / GT | **72.45** | [61.73, 83.17] | 62.7 ov (376b) | 7.47 | 8.37 | **-0.90** | **+1.20** | 44.68% | 15.96% | 12.97 | 70.27% |
| **9** | **Krunal Pandya** | LSG / RCB | **72.36** | [63.37, 81.35] | 89.2 ov (535b) | 6.63 | 7.63 | **-1.00** | **+1.42** | 32.71% | 9.35% | 16.72 | 67.50% |
| **10** | **Mitchell Santner** | NZ / MI | **69.99** | [60.90, 79.08] | 87.2 ov (523b) | 6.68 | 7.20 | **-0.52** | **+1.13** | 38.05% | 10.90% | 16.34 | 68.09% |

### Analytical Insights on Key Bowlers:
- **Jamie Overton (#1)**: The standout clutch performer. In death overs and pressure surges, Overton cuts his economy by nearly 2 full runs (-1.97 to 6.25), while executing dot balls on half his deliveries (49.53%) and taking a wicket every 10.6 balls.
- **Sunil Narine (#2)**: Remains the world standard for economy under immense stress. Across 114 pressure overs (684 balls), Narine concedes an economy of just 5.87, restricting boundaries to an astounding 8.19%.
- **Kuldeep Yadav (#6)**: Sustained elite performance across a massive 921 pressure balls (153.5 overs), claiming 63 pressure wickets with a tight confidence interval of $[66.23, 79.93]$.

---

## 14. Confidence Intervals and Sensitivity Analysis

### 14.1 Bootstrap Resampling & Ranking Uncertainty
A crucial tenet of honest data science is admitting uncertainty. Because clutch match states represent small subsets of playing careers, we ran 1,000 bootstrap resamples on every player's delivery records to generate empirical 95% Confidence Intervals:

- **Overlapping Intervals**: Notice that Yashasvi Jaiswal ([71.66, 96.68]) and Prabhsimran Singh ([68.28, 94.52]) have broadly overlapping intervals. We cannot claim with 99% certainty that Jaiswal will strictly outperform Prabhsimran in any single given future chase. Rather, our model asserts that Jaiswal has the highest expected mean reliability based on available historical evidence.
- **Sample Size Effect on Precision**: Bowlers like Kuldeep Yadav (921 balls, interval width $\pm 6.85$) and Sunil Narine (684 balls, width $\pm 7.95$) have vastly tighter confidence bounds than Sufiyan Muqeem (149 balls, width $\pm 17.03$). While Muqeem's point estimate of 76.68 places him at Rank 4, his ranking carries substantially higher uncertainty.

### 14.2 Hyperparameter Sensitivity Analysis
We evaluated ranking stability across variations in critical model parameters:
- **Prior Weight $N_0 \in [50, 150]$**: Rank 1–3 for batters (Jaiswal, Prabhsimran, Abhishek) remained identical across all $N_0$ settings. Lower $N_0$ boosted low-volume specialists (e.g., Naman Dhir), while higher $N_0$ favoured high-volume anchors (Suryakumar Yadav, Klaasen).
- **Pressure Cutoff $\Psi_{\text{thresh}} \in [60, 70]$**: Setting the cutoff to 70 reduced the sample to 48,210 deliveries but produced a 0.94 Rank Correlation with the baseline 65.0 threshold.

---

## 15. Model Validation

### 15.1 Addressing Quantile Alignment and Cricket Realism
> **Critical Clarification**: A common temptation in multi-innings sports modeling is to assume that matching the mathematical score distributions between the 1st and 2nd innings proves equivalent cricket pressure. **We explicitly reject this assumption.**  
Matching quantile distributions is purely a mathematical scaling normalization. A pressure score of 75 in the 1st innings reflects significant par-score deficit and resource risk, but it does NOT possess identical psychological or game-theoretic equivalence to defending 12 runs off 6 balls in a 2nd-innings chase. We calibrate the models to reflect comparable leverage within their respective tactical paradigms while acknowledging their distinct physical characteristics.

### 15.2 Empirical Case Study Validation: IPL 2023 Final
To validate the real-time pressure engine against actual delivery events, we reconstructed the climax of the **IPL 2023 Final** (Gujarat Titans vs Chennai Super Kings, rain-revised target of 171 in 15 overs):
- **Mohit Sharma's Over (Overs 14.1 to 14.4)**: Mohit bowled four consecutive yorkers conceding only 3 runs. The pressure score surged from 88.4 to 96.2, and CSK's win probability plummeted from 54% to 22%.
- **Ball 14.5 (10 needed off 2)**: Ravindra Jadeja struck a six straight down the ground. Pressure peaked at 98.6.
- **Ball 14.6 (4 needed off 1)**: Jadeja clipped a leg-stump flick to the fine-leg boundary for four. Match won.
- **Verdict**: The model accurately mapped the trajectory of maximum leverage and win probability shifts without any retroactive data leakage.

---

## 16. Limitations

1. **Absence of Player Match-Up Micro-Context**: Ball-by-ball data does not capture pitch degradation, dew factors, boundary dimension asymmetries, or specific bowler-batter match-up history (e.g., left-arm pace vs. right-hand opening batters).
2. **Fielding & Dropped Catches**: Reconstructed pressure assumes catch events are recorded accurately, but near-misses and misfields are unquantified in the raw delivery record.
3. **Opposition Quality Heterogeneity**: While developmental matches were excluded, T20I matches include both Tier-1 clashes (India vs Pakistan, Australia vs England) and associate nation fixtures. Opponent quality adjustments are partially mitigated by sample size thresholds but remain a source of residual variance.

---

## 17. Reproducibility Instructions

The entire analytical framework is 100% automated, deterministic, and reproducible:

### Step 1: Environment Setup
```bash
git clone https://github.com/Pranavgaikwad007/superrr-selector.git
cd superrr-selector
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
```

### Step 2: Run End-to-End Analytical Pipeline
```bash
python -m src.pipeline
```
This script executes:
- Ingestion of raw datasets from `data/raw/`.
- Data cleaning and referential validation.
- Match-state reconstruction.
- Pressure engine computation across all 200,999 deliveries.
- Batting and bowling performance metric extraction.
- Bayesian shrinkage and bootstrap confidence intervals.
- Generates all CSV files in `outputs/` and `frontend/src/data/frontend_data.json`.

### Step 3: Run Verification Test Suite
```bash
python -m pytest
```
Executes all 39 unit and integration tests across data loading, state reconstruction, pressure logic, and ranking calculations.

### Step 4: Run Frontend Development Server
```bash
cd frontend
npm install
npm run dev
```

---

## 18. Conclusion

By shifting from descriptive aggregate statistics to a rigorous Bayesian pressure intelligence engine, the **SupeRR Selector System** successfully isolates true clutch performers from high-volume accumulators. **Yashasvi Jaiswal** and **Jamie Overton** emerge as the most reliable exponents of batting acceleration and bowling containment under intense match stress. The interactive dashboard, open codebase, and auditable methodology provide cricket analysts and franchise management with a statistically sound blueprint for high-leverage talent evaluation.
