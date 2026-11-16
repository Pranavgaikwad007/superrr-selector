# Phase 1 Data Audit & Schema Integrity Report

## Project: SupeRR Selector Season 2 — Cricket Pressure Intelligence

> **Executive Summary**: This report documents the complete structural audit, entity reconciliation, schema relationships, and edge-case validation performed across the official SupeRR Selector data pack.

---

## 1. Dataset File Inventory & Schema Summaries

| Dataset File | Row Count | Column Count | Primary Key / Candidate Key | Columns with Nulls |
| :--- | :--- | :--- | :--- | :--- |
| `competitions.csv` | 141 | 6 | `comp_id` | None |
| `teams.csv` | 353 | 3 | `team_id` | None |
| `matches.csv` | 883 | 22 | `match_id` | home_team_captain_id (44), away_team_captain_id (45), toss_win_team_id (15), toss_opted (15), first_inn_revised_overs (858), second_inn_revised_overs (858), revised_target (860), win_team_id (41) |
| `ball_by_ball.csv` | 200,999 | 33 | `(match_id, innings, innings_ball_num)` | dismissal_type_id (190,118), dismissal_type (190,118), dismissed_player_id (190,107), extras_type (189,167), stroke (6,158), delivery_style (391), over_or_around (407) |
| `competition_team_player_mapping.csv` | 6,413 | 6 | `(comp_id, team_id, player_id)` | None |
| `playing_eleven.csv` | 28,381 | 9 | `(match_id, player_id)` | batting_order (8,678), is_captain (8,667), is_wk (8,667) |

---

## 2. Competition & Format Breakdown

The data pack contains **141 registered competitions**. However, careful inspection reveals that not all competitions represent eligible senior T20/IPL competition matches:

| Competition Category | Competitions Count | Scheduled Matches | Matches with Deliveries | Delivery Count | Eligibility Scope |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **IPL** | 5 | 371 | 367 | - | Eligible (Primary) |
| **T20I** | 134 | 482 | 470 | - | Eligible (Primary) |
| **Other_T20** | 2 | 30 | 30 | - | Non-Eligible (Emerging / Developmental) |

### Specific Competition Findings:
1. **IPL Competitions (5 tournaments, 371 matches)**: IPL 2022 (74), IPL 2023 (74), IPL 2024 (74), IPL 2025 (75), IPL 2026 (74). Of these, 367 matches have ball-by-ball records, and 4 matches were completely abandoned without a ball bowled.
2. **Official T20I Competitions (134 tournaments, 482 matches)**: International bilateral series and ICC events from 2022 through 2026. 470 have ball-by-ball records, 12 were abandoned without a ball bowled, and 3 tournaments had 0 scheduled matches in the dataset.
3. **Other T20 Competitions (2 tournaments, 30 matches)**: `Mens T20 Emerging Teams Asia Cup 2024` (comp_id 2670, 15 matches) and `Asia Cup Rising Stars 2025` (comp_id 3289, 15 matches). These are 'A' team and developmental fixtures, flagged as `is_eligible_competition = False` for strict IPL/T20I analysis.
4. **Zero-Match Competitions (3 tournaments)**: `3405 (Afghanistan v Sri Lanka 2026)`, `3473 (UAE in Nepal 2026)`, and `2940 (India in Bangladesh 2025)` have zero match records.

---

## 3. Foreign Key Integrity & Entity Validation

| Referential Relationship | Source Field -> Target Field | Integrity Status | Notes |
| :--- | :--- | :--- | :--- |
| Matches -> Competitions | `matches.comp_id` -> `competitions.comp_id` | PASSED (100%) | All 883 matches reference valid competitions |
| Matches -> Teams | `matches.(home/away)_team_id` -> `teams.team_id` | PASSED (100%) | All match teams exist in `teams.csv` |
| Deliveries -> Matches | `ball_by_ball.match_id` -> `matches.match_id` | PASSED (100%) | All 200,999 balls map to scheduled matches |
| Deliveries -> Teams | `ball_by_ball.(batting/bowling)_team_id` -> `teams.team_id` | PASSED (100%) | All batting and bowling teams resolve |
| Deliveries -> Players | `ball_by_ball.(striker/bowler)_id` -> `mapping.player_id` | PASSED (100%) | All 959 active players exist in player mapping |

---

## 4. Player Identity Reconciliation & Name Collisions

A critical data quality finding: **7 player names correspond to multiple distinct `player_id` values**:

### `Abdul Samad` (IDs: [7446, 6922])
| ID | Competition / Tournament | Team | Context / Disambiguation |
| :--- | :--- | :--- | :--- |
| 7446 | IPL 2022 | Sunrisers Hyderabad | Distinct individual / team registry |
| 7446 | IPL 2023 | Sunrisers Hyderabad | Distinct individual / team registry |
| 7446 | IPL 2024 | Sunrisers Hyderabad | Distinct individual / team registry |
| 6922 | Mens T20 Emerging Teams Asia Cup 2024 | Pakistan A | Distinct individual / team registry |
| 7446 | IPL 2025 | Lucknow Super Giants | Distinct individual / team registry |
| 6922 | Pakistan in New Zealand T20I Series 2025 | Pakistan | Distinct individual / team registry |
| 6922 | South Africa in Pakistan T20I Series 2025 | Pakistan | Distinct individual / team registry |
| 6922 | Pakistan T20I Tri-Series 2025 | Pakistan | Distinct individual / team registry |
| 7446 | IPL 2026 | Lucknow Super Giants | Distinct individual / team registry |
| 6922 | Pakistan in Sri Lanka T20I Series 2026 | Pakistan | Distinct individual / team registry |
| 6922 | Sri Lanka in Pakistan T20I Series 2026 | Pakistan | Distinct individual / team registry |

### `Bashir Ahmad` (IDs: [39479, 29833])
| ID | Competition / Tournament | Team | Context / Disambiguation |
| :--- | :--- | :--- | :--- |
| 39479 | Mens T20 Emerging Teams Asia Cup 2024 | Afghanistan A | Distinct individual / team registry |
| 29833 | Asia Cup 2025 | Afghanistan | Distinct individual / team registry |
| 29833 | United Arab Emirates T20I Tri-Series 2025 | Afghanistan | Distinct individual / team registry |
| 29833 | Afghanistan v Bangladesh T20I Series 2025 | Afghanistan | Distinct individual / team registry |
| 29833 | Afghanistan in Zimbabwe T20I Series 2025 | Afghanistan | Distinct individual / team registry |

### `Basil Hameed` (IDs: [8638, 39444])
| ID | Competition / Tournament | Team | Context / Disambiguation |
| :--- | :--- | :--- | :--- |
| 8638 | Asia Cup T20 Qualifiers 2022 | United Arab Emirates | Distinct individual / team registry |
| 8638 | Bangladesh in United Arab Emirates T20I Series 2022 | United Arab Emirates | Distinct individual / team registry |
| 8638 | New Zealand in United Arab Emirates T20I Series 2023 | United Arab Emirates | Distinct individual / team registry |
| 8638 | Mens T20 Emerging Teams Asia Cup 2024 | United Arab Emirates | Distinct individual / team registry |
| 39444 | Mens T20 Emerging Teams Asia Cup 2024 | United Arab Emirates | Distinct individual / team registry |
| 8638 | Ireland in United Arab Emirates T20I Series 2026 | United Arab Emirates | Distinct individual / team registry |

### `Haider Ali` (IDs: [7338, 28756])
| ID | Competition / Tournament | Team | Context / Disambiguation |
| :--- | :--- | :--- | :--- |
| 7338 | Mens Twenty20 Asia Cup 2022 | Pakistan | Distinct individual / team registry |
| 7338 | England in Pakistan T20I Series 2022 | Pakistan | Distinct individual / team registry |
| 7338 | New Zealand T20I Tri Series 2022/23 | Pakistan | Distinct individual / team registry |
| 7338 | Mens T20 Emerging Teams Asia Cup 2024 | Pakistan A | Distinct individual / team registry |
| 28756 | Bangladesh in United Arab Emirates T20I Series 2025 | United Arab Emirates | Distinct individual / team registry |
| 28756 | Asia Cup 2025 | United Arab Emirates | Distinct individual / team registry |
| 28756 | United Arab Emirates T20I Tri-Series 2025 | United Arab Emirates | Distinct individual / team registry |
| 28756 | Ireland in United Arab Emirates T20I Series 2026 | United Arab Emirates | Distinct individual / team registry |
| 28756 | United Arab Emirates in Nepal T20I Series 2026 | United Arab Emirates | Distinct individual / team registry |

### `Mohammad Ali` (IDs: [3083, 20229])
| ID | Competition / Tournament | Team | Context / Disambiguation |
| :--- | :--- | :--- | :--- |
| 3083 | New Zealand in Pakistan T20I Series 2024 | Pakistan | Distinct individual / team registry |
| 20229 | Pakistan in England T20I Series 2024 | Pakistan | Distinct individual / team registry |
| 20229 | Pakistan in New Zealand T20I Series 2025 | Pakistan | Distinct individual / team registry |

### `Muhammad Farooq` (IDs: [27373, 28978])
| ID | Competition / Tournament | Team | Context / Disambiguation |
| :--- | :--- | :--- | :--- |
| 27373 | Mens T20 Emerging Teams Asia Cup 2024 | United Arab Emirates | Distinct individual / team registry |
| 28978 | Mens T20 Emerging Teams Asia Cup 2024 | United Arab Emirates | Distinct individual / team registry |
| 27373 | Asia Cup 2025 | United Arab Emirates | Distinct individual / team registry |
| 27373 | United Arab Emirates T20I Tri-Series 2025 | United Arab Emirates | Distinct individual / team registry |
| 27373 | Asia Cup Rising Stars 2025 | United Arab Emirates | Distinct individual / team registry |
| 27373 | Ireland in United Arab Emirates T20I Series 2026 | United Arab Emirates | Distinct individual / team registry |

### `Rashid Khan` (IDs: [4722, 20172])
| ID | Competition / Tournament | Team | Context / Disambiguation |
| :--- | :--- | :--- | :--- |
| 4722 | IPL 2022 | Gujarat Titans | Distinct individual / team registry |
| 4722 | Afghanistan in Zimbabwe T20I Series 2022 | Afghanistan | Distinct individual / team registry |
| 4722 | Mens Twenty20 Asia Cup 2022 | Afghanistan | Distinct individual / team registry |
| 4722 | Afghanistan in Ireland T20I Series 2022 | Afghanistan | Distinct individual / team registry |
| 4722 | IPL 2023 | Gujarat Titans | Distinct individual / team registry |
| 4722 | Afghanistan v Pakistan T20I Series 2023 | Afghanistan | Distinct individual / team registry |
| 4722 | Afghanistan in Bangladesh T20I Series 2023 | Afghanistan | Distinct individual / team registry |
| 4722 | Afghanistan in India T20I Series 2024 | Afghanistan | Distinct individual / team registry |
| 4722 | IPL 2024 | Gujarat Titans | Distinct individual / team registry |
| 4722 | Afghanistan v Ireland T20I Series 2024 | Afghanistan | Distinct individual / team registry |
| 4722 | IPL 2025 | Gujarat Titans | Distinct individual / team registry |
| 4722 | Afghanistan in Zimbabwe T20I Series 2024 | Afghanistan | Distinct individual / team registry |
| 4722 | Asia Cup 2025 | Afghanistan | Distinct individual / team registry |
| 4722 | United Arab Emirates T20I Tri-Series 2025 | Afghanistan | Distinct individual / team registry |
| 4722 | Afghanistan v Bangladesh T20I Series 2025 | Afghanistan | Distinct individual / team registry |
| 4722 | Afghanistan in Zimbabwe T20I Series 2025 | Afghanistan | Distinct individual / team registry |
| 4722 | IPL 2026 | Gujarat Titans | Distinct individual / team registry |
| 4722 | Afghanistan v West Indies T20I Series 2026 | Afghanistan | Distinct individual / team registry |
| 4722 | Afghanistan v Sri Lanka T20I Series 2026 | Afghanistan | Distinct individual / team registry |
| 20172 | United Arab Emirates in Nepal T20I Series 2026 | Nepal | Distinct individual / team registry |
| 4722 | Afghanistan vs India in India T20I Series 2026 | Afghanistan | Distinct individual / team registry |
| 4722 | Afghanistan v Zimbabwe T20I Series 2026 | Afghanistan | Distinct individual / team registry |

> **Methodological Rule**: Never group or aggregate player statistics by `player_name`. All metrics, pressure indices, ratings, and baselines MUST strictly aggregate by `player_id`.

---

## 5. Match Completion & Delivery State Findings

- **Total Matches in Schedule**: 883
- **Matches with Deliveries**: 867
- **Completely Abandoned Matches (0 balls bowled)**: 16
- **Incomplete Matches with Partial Play (Rained out / No Result)**: 24
- **Super Over Matches (Tied matches going to Innings 3 & 4)**: 6 (Match IDs: [34429, 40725, 45512, 48027, 48029, 50359])
- **Shortened Matches with Revised Targets (DLS / Revised Overs)**: 23 matches

---

## 6. Delivery Scoring & Rules Reconstruction Verification

Through exhaustive validation against official scorecard outcomes, the following rules have been confirmed:
1. **Team Runs per Delivery**: `runs + extras1_runs + extras_2_runs`. Exactly accounts for off-the-bat runs, penalty runs, and extras.
2. **Legal Balls**: Deliveries where `extras_type` is NOT in `['wide', 'Overstep', 'other']`. Overstep (front-foot no ball) and other (waist-height/fielding no balls) both require re-bowling.
3. **Batter Credited Runs & Balls**: `runs` is credited to striker. Balls faced equals 1 for all deliveries except `extras_type == 'wide'`.
4. **Bowler Credited Wickets**: Only dismissals where dismissal type is `['Caught', 'Bowled', 'LBW', 'Stump', 'Hit Wicket']`. RunOuts (600), Retire Outs (6), and Obstructing the Field (3) are team dismissals not credited to bowlers.
5. **State Before Delivery**: All pressure signals, runs scored so far, wickets lost, balls remaining, CRR, and RRR are calculated strictly BEFORE the delivery occurs, ensuring zero data leakage.

---
*Report auto-generated by SupeRR Selector Phase 1 Pipeline.*