"""
generate_pdf_report.py
Generates an executive, beautifully styled PDF version of the SupeRR Selector Season 2
Methodology Report using ReportLab.
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    KeepTogether,
    HRFlowable,
)
from reportlab.pdfgen import canvas


class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to dynamically compute and print total page numbers:
    'Page X of Y' on every page, with header rule and title.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super().showPage()
        super().save()

    def draw_header_footer(self, total_pages):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))

        # Header (on pages > 1)
        if self._pageNumber > 1:
            self.drawString(
                54,
                letter[1] - 36,
                "SupeRR Selector Season 2 — Cricket Pressure Intelligence Methodology Report",
            )
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, letter[1] - 42, letter[0] - 54, letter[1] - 42)

        # Footer (on all pages)
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(54, 46, letter[0] - 54, 46)

        page_str = f"Page {self._pageNumber} of {total_pages}"
        self.drawRightString(letter[0] - 54, 32, page_str)
        self.drawString(
            54,
            32,
            "Confidential & Proprietary — Rajasthan Royals / SupeRR Selector 2026",
        )
        self.restoreState()


def build_pdf():
    pdf_path = os.path.join("reports", "final_methodology_report.pdf")
    os.makedirs("reports", exist_ok=True)

    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54,
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=26,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=6,
    )

    subtitle_style = ParagraphStyle(
        "DocSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#0D9488"),
        spaceAfter=12,
    )

    meta_style = ParagraphStyle(
        "MetaText",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#475569"),
    )

    h1_style = ParagraphStyle(
        "Heading1_Custom",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#0F172A"),
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True,
    )

    h2_style = ParagraphStyle(
        "Heading2_Custom",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#1E293B"),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True,
    )

    body_style = ParagraphStyle(
        "Body_Custom",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#334155"),
        spaceAfter=6,
    )

    bullet_style = ParagraphStyle(
        "Bullet_Custom",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#334155"),
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=3,
    )

    callout_style = ParagraphStyle(
        "CalloutText",
        parent=styles["Normal"],
        fontName="Helvetica-Oblique",
        fontSize=8.5,
        leading=12.5,
        textColor=colors.HexColor("#0F172A"),
    )

    table_cell_style = ParagraphStyle(
        "TableCell",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor("#1E293B"),
    )

    table_header_style = ParagraphStyle(
        "TableHeader",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=7.5,
        leading=9.5,
        textColor=colors.white,
    )

    story = []

    # Title & Metadata
    story.append(Paragraph("SupeRR Selector Season 2 — Final Methodology Report", title_style))
    story.append(Paragraph("Cricket Pressure Intelligence: Quantifying Player Reliability Under Match Stress", subtitle_style))
    story.append(Paragraph("<b>Organization:</b> Rajasthan Royals & Unstop &nbsp;|&nbsp; <b>Author:</b> Pranav Gaikwad (<code>Pranavgaikwad007</code>) &nbsp;|&nbsp; <b>Scope:</b> IPL & T20I (2022+)", meta_style))
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0D9488"), spaceBefore=2, spaceAfter=12))

    # 1. Executive Summary
    story.append(Paragraph("1. Executive Summary", h1_style))
    story.append(Paragraph(
        "In high-stakes Twenty20 cricket, standard aggregated statistics—such as raw batting strike rate or bowling economy rate—fail to distinguish between low-consequence 'garbage time' and critical match-defining leverage. A batter striking at 170 during a lopsided contest with 40 runs needed off 40 balls with 8 wickets in hand faces fundamentally different psychological and tactical constraints than a batter required to score 22 off 9 balls in a playoff knockout. Similarly, a bowler defending 8 runs in the final over operates under vastly different pressure dynamics than one bowling with 60 runs to defend.",
        body_style,
    ))
    story.append(Paragraph(
        "This report presents the <b>Cricket Pressure Intelligence System (CPIS)</b>, an objective, data-driven framework developed for the <b>SupeRR Selector Season 2</b> competition. The system reconstructs ball-by-ball match states, defines an objective, continuous pre-delivery Pressure Index (&Psi; &isin; [0, 100]), models the asymmetric mechanics of 1st-innings score projection versus 2nd-innings win probability swings, computes context-aware performance deltas, and synthesizes player performance using empirical Bayesian shrinkage with 1,000-iteration bootstrap confidence intervals.",
        body_style,
    ))
    story.append(Paragraph("<b>Primary Analytical Findings:</b>", body_style))
    story.append(Paragraph("&bull; <b>Contest Scope:</b> Across 883 scheduled fixtures (incorporating 837 senior eligible matches with ball-by-ball delivery records, comprising 367 IPL and 470 T20I fixtures) and 194,014 eligible contest deliveries, <b>68,402 deliveries (35.26%)</b> exceed the high-pressure threshold (&Psi; &ge; 65.0).", bullet_style))
    story.append(Paragraph("&bull; <b>Top Ranked Batter:</b> <b>Yashasvi Jaiswal</b> (Rajasthan Royals / India) achieves the #1 batting rank with an overall Pressure Reliability Score of <b>84.17 / 100</b> (95% CI: [71.66, 96.68]), elevating his strike rate from 156.36 baseline to <b>179.71</b> under high pressure (&Delta;SR = +23.35), generating <b>+39.41 runs added per 100 balls</b>.", bullet_style))
    story.append(Paragraph("&bull; <b>Top Ranked Bowler:</b> <b>Jamie Overton</b> (England / Chennai Super Kings) achieves the #1 bowling rank with an overall Pressure Reliability Score of <b>85.13 / 100</b> (95% CI: [70.85, 99.41]), restricting high-pressure scoring to an economy rate of <b>6.25</b> (down from 8.22 baseline, &Delta;Econ = -1.97), preventing <b>+2.01 runs per 6 balls</b> with a pressure wicket strike rate of <b>10.60 balls/wicket</b>.", bullet_style))
    story.append(Paragraph("&bull; <b>Ranking Uncertainty & Overlapping CIs:</b> Due to finite sample sizes in clutch scenarios, 95% bootstrap confidence intervals show substantial overlap among adjacent ranks. Point estimates identify the highest-probability leaders, but rankings must be interpreted as performance tiers rather than absolute discrete distinctions.", bullet_style))

    # 2. Problem Understanding
    story.append(Spacer(1, 4))
    story.append(Paragraph("2. Problem Understanding", h1_style))
    story.append(Paragraph(
        "Round 1 of SupeRR Selector Season 2 asks participants to build a data-driven system measuring how batters and bowlers perform in high-pressure match situations compared with baseline levels, and rank the top 10 most reliable players in each discipline.",
        body_style,
    ))
    story.append(Paragraph("&bull; <b>Dynamic Pressure:</b> Pressure is not a static property of a match; it shifts ball-by-ball based on balls remaining, wickets in hand, and required run rate.", bullet_style))
    story.append(Paragraph("&bull; <b>Innings Asymmetry:</b> 1st-innings pressure is dictated by par-score optimization under resource depletion; 2nd-innings pressure is governed by Win Probability swings towards or away from a fixed target.", bullet_style))
    story.append(Paragraph("&bull; <b>Bayesian Regularization:</b> Small sample sizes in clutch situations require shrinkage to prevent unproven players with small sample outliers from skewing rankings.", bullet_style))

    # 3. Dataset Description
    story.append(Spacer(1, 4))
    story.append(Paragraph("3. Dataset Description & Scope", h1_style))
    story.append(Paragraph(
        "The system digests 6 relational CSV tables from 2022 onwards: <code>ball_by_ball.csv</code> (200,999 raw rows), <code>match.csv</code> (883 scheduled rows), <code>player.csv</code> (959 registered players), <code>competition.csv</code> (141 competitions), <code>team.csv</code>, and <code>competition_team_player.csv</code>.",
        body_style,
    ))

    # 4. Data Cleaning & Match Reconstruction
    story.append(Spacer(1, 4))
    story.append(Paragraph("4. Data Cleaning and Match Reconstruction", h1_style))
    story.append(Paragraph(
        "<b>Match Audit:</b> Out of 883 scheduled fixtures in <code>match.csv</code>, 16 were abandoned without a ball bowled (4 IPL, 12 T20I). An additional 30 developmental fixtures (<code>Other_T20</code>) were excluded to maintain professional parity. The eligible contest corpus consists of <b>837 matches</b> (367 IPL + 470 T20I) containing <b>194,014 eligible deliveries</b>.",
        body_style,
    ))
    story.append(Paragraph(
        "<b>Entity Resolution:</b> 7 player names share multiple identities in the registry (e.g., Abdul Samad, Haider Ali). All computations aggregate strictly on integer <code>player_id</code> to eliminate cross-entity contamination.",
        body_style,
    ))
    story.append(Paragraph(
        "<b>Pre-Delivery Match State (Zero Data Leakage):</b> Every delivery state is calculated strictly before ball release: balls remaining in quota, cumulative runs, wickets lost, required runs, and required run rate.",
        body_style,
    ))

    # 5 & 6. Pressure Models
    story.append(Spacer(1, 4))
    story.append(Paragraph("5 & 6. Mathematical Pressure Engine (1st & 2nd Innings)", h1_style))
    story.append(Paragraph(
        "<b>1st Innings:</b> Models Duckworth-Lewis-Stern resource depletion combined with historical venue par deficit (par = 165.0) and death-phase non-linear weighting:<br/>"
        "&Psi;<sub>inn1</sub> = w<sub>1</sub> &middot; ResourceStress + w<sub>2</sub> &middot; ParDeficit + w<sub>3</sub> &middot; DeathPhaseBonus",
        body_style,
    ))
    story.append(Paragraph(
        "<b>2nd Innings:</b> Models win probability volatility gradient: the absolute swing in win probability between a boundary event vs. a dismissal event given required run rate and remaining wickets:<br/>"
        "Leverage = |WP(boundary) - WP(wicket)|<br/>"
        "&Psi;<sub>inn2</sub> = 100 &times; (0.50 &middot; Leverage + 0.35 &middot; MinMax(RRR) + 0.15 &middot; WicketFragility)",
        body_style,
    ))
    story.append(Paragraph(
        "<b>Delivery Distribution across Tiers:</b> Ordinary (&lt;40.0): 35.9% | Medium (40-65): 28.8% | High (65-85): 22.0% | Extreme (&ge;85.0): 13.2%. High-pressure threshold (&Psi; &ge; 65.0) captures 68,402 deliveries (35.3%).",
        body_style,
    ))

    # 7, 8, 9, 10. Performance Metrics & Bayesian Shrinkage
    story.append(Spacer(1, 4))
    story.append(Paragraph("7–10. Performance Metrics, Baselines & Bayesian Reliability", h1_style))
    story.append(Paragraph(
        "Every delivery is compared against phase-specific, innings-specific dynamic baselines. Batters are evaluated on Strike Rate Delta (&Delta;SR), Runs Added per 100 balls, Boundary %, and match consistency. Bowlers are evaluated on Economy Suppression (&Delta;Econ), Runs Prevented per 6 balls, Dot %, and Wicket Strike Rate.",
        body_style,
    ))
    story.append(Paragraph(
        "<b>Empirical Bayes Regularization:</b> Scores are shrunk toward the population mean (&mu;<sub>0</sub> = 50.0) with prior weight N<sub>0</sub> = 100 deliveries:<br/>"
        "R<sub>Bayes</sub> = [ N<sub>p</sub> / (N<sub>p</sub> + N<sub>0</sub>) ] &middot; R<sub>observed</sub> + [ N<sub>0</sub> / (N<sub>p</sub> + N<sub>0</sub>) ] &middot; &mu;<sub>0</sub>",
        body_style,
    ))

    # 11. Eligibility
    story.append(Paragraph(
        "<b>Eligibility Criteria:</b> Minimum 120 high-pressure deliveries faced/bowled, minimum 8 high-pressure matches, and minimum 250 career balls. Across 959 players, <b>135 batters</b> and <b>156 bowlers</b> qualified (291 total).",
        body_style,
    ))

    story.append(PageBreak())

    # 12. Top 10 Batters Table
    story.append(Paragraph("12. Top 10 Batters Under Pressure", h1_style))
    story.append(Paragraph(
        "Rankings synthesize strike rate acceleration, runs added, boundary efficiency, and match consistency, regularized via Empirical Bayes with 1,000-sample bootstrap confidence intervals.",
        body_style,
    ))

    batters_data = [
        [
            Paragraph("<b>Rk</b>", table_header_style),
            Paragraph("<b>Player Name</b>", table_header_style),
            Paragraph("<b>Team(s)</b>", table_header_style),
            Paragraph("<b>Score</b>", table_header_style),
            Paragraph("<b>95% CI</b>", table_header_style),
            Paragraph("<b>Balls</b>", table_header_style),
            Paragraph("<b>SR Press</b>", table_header_style),
            Paragraph("<b>&Delta;SR</b>", table_header_style),
            Paragraph("<b>RA/100</b>", table_header_style),
            Paragraph("<b>Bnd %</b>", table_header_style),
            Paragraph("<b>Dot %</b>", table_header_style),
            Paragraph("<b>Cons %</b>", table_header_style),
        ],
        [
            Paragraph("1", table_cell_style),
            Paragraph("<b>Yashasvi Jaiswal</b>", table_cell_style),
            Paragraph("RR / India", table_cell_style),
            Paragraph("<b>84.17</b>", table_cell_style),
            Paragraph("[71.7, 96.7]", table_cell_style),
            Paragraph("276", table_cell_style),
            Paragraph("179.71", table_cell_style),
            Paragraph("+23.35", table_cell_style),
            Paragraph("+39.41", table_cell_style),
            Paragraph("28.6%", table_cell_style),
            Paragraph("26.1%", table_cell_style),
            Paragraph("66.7%", table_cell_style),
        ],
        [
            Paragraph("2", table_cell_style),
            Paragraph("<b>Prabhsimran Singh</b>", table_cell_style),
            Paragraph("PBKS", table_cell_style),
            Paragraph("<b>81.40</b>", table_cell_style),
            Paragraph("[68.3, 94.5]", table_cell_style),
            Paragraph("251", table_cell_style),
            Paragraph("178.09", table_cell_style),
            Paragraph("+18.03", table_cell_style),
            Paragraph("+38.34", table_cell_style),
            Paragraph("27.1%", table_cell_style),
            Paragraph("27.5%", table_cell_style),
            Paragraph("72.2%", table_cell_style),
        ],
        [
            Paragraph("3", table_cell_style),
            Paragraph("<b>Abhishek Sharma</b>", table_cell_style),
            Paragraph("SRH / India", table_cell_style),
            Paragraph("<b>76.44</b>", table_cell_style),
            Paragraph("[63.7, 89.2]", table_cell_style),
            Paragraph("264", table_cell_style),
            Paragraph("185.23", table_cell_style),
            Paragraph("-1.27", table_cell_style),
            Paragraph("+49.74", table_cell_style),
            Paragraph("28.4%", table_cell_style),
            Paragraph("28.4%", table_cell_style),
            Paragraph("67.9%", table_cell_style),
        ],
        [
            Paragraph("4", table_cell_style),
            Paragraph("<b>Naman Dhir</b>", table_cell_style),
            Paragraph("MI / India", table_cell_style),
            Paragraph("<b>76.11</b>", table_cell_style),
            Paragraph("[62.0, 90.2]", table_cell_style),
            Paragraph("217", table_cell_style),
            Paragraph("182.95", table_cell_style),
            Paragraph("+10.91", table_cell_style),
            Paragraph("+37.01", table_cell_style),
            Paragraph("26.3%", table_cell_style),
            Paragraph("24.9%", table_cell_style),
            Paragraph("65.2%", table_cell_style),
        ],
        [
            Paragraph("5", table_cell_style),
            Paragraph("<b>Quinton de Kock</b>", table_cell_style),
            Paragraph("LSG / SA", table_cell_style),
            Paragraph("<b>73.97</b>", table_cell_style),
            Paragraph("[60.5, 87.5]", table_cell_style),
            Paragraph("238", table_cell_style),
            Paragraph("166.81", table_cell_style),
            Paragraph("+15.94", table_cell_style),
            Paragraph("+33.40", table_cell_style),
            Paragraph("23.9%", table_cell_style),
            Paragraph("28.2%", table_cell_style),
            Paragraph("66.7%", table_cell_style),
        ],
        [
            Paragraph("6", table_cell_style),
            Paragraph("<b>Suryakumar Yadav</b>", table_cell_style),
            Paragraph("India / MI", table_cell_style),
            Paragraph("<b>72.79</b>", table_cell_style),
            Paragraph("[65.3, 80.3]", table_cell_style),
            Paragraph("777", table_cell_style),
            Paragraph("165.77", table_cell_style),
            Paragraph("-0.66", table_cell_style),
            Paragraph("+30.46", table_cell_style),
            Paragraph("23.4%", table_cell_style),
            Paragraph("27.9%", table_cell_style),
            Paragraph("63.0%", table_cell_style),
        ],
        [
            Paragraph("7", table_cell_style),
            Paragraph("<b>Reeza Hendricks</b>", table_cell_style),
            Paragraph("South Africa", table_cell_style),
            Paragraph("<b>71.69</b>", table_cell_style),
            Paragraph("[57.3, 86.0]", table_cell_style),
            Paragraph("210", table_cell_style),
            Paragraph("156.67", table_cell_style),
            Paragraph("+10.08", table_cell_style),
            Paragraph("+30.57", table_cell_style),
            Paragraph("20.0%", table_cell_style),
            Paragraph("26.7%", table_cell_style),
            Paragraph("66.7%", table_cell_style),
        ],
        [
            Paragraph("8", table_cell_style),
            Paragraph("<b>Heinrich Klaasen</b>", table_cell_style),
            Paragraph("SRH / SA", table_cell_style),
            Paragraph("<b>70.51</b>", table_cell_style),
            Paragraph("[61.7, 79.4]", table_cell_style),
            Paragraph("552", table_cell_style),
            Paragraph("167.03", table_cell_style),
            Paragraph("+0.27", table_cell_style),
            Paragraph("+29.48", table_cell_style),
            Paragraph("22.5%", table_cell_style),
            Paragraph("25.9%", table_cell_style),
            Paragraph("62.5%", table_cell_style),
        ],
        [
            Paragraph("9", table_cell_style),
            Paragraph("<b>Ajinkya Rahane</b>", table_cell_style),
            Paragraph("KKR / CSK", table_cell_style),
            Paragraph("<b>69.06</b>", table_cell_style),
            Paragraph("[53.4, 84.7]", table_cell_style),
            Paragraph("177", table_cell_style),
            Paragraph("163.28", table_cell_style),
            Paragraph("+24.15", table_cell_style),
            Paragraph("+27.82", table_cell_style),
            Paragraph("18.6%", table_cell_style),
            Paragraph("25.4%", table_cell_style),
            Paragraph("66.7%", table_cell_style),
        ],
        [
            Paragraph("10", table_cell_style),
            Paragraph("<b>Mohammad Rizwan</b>", table_cell_style),
            Paragraph("Pakistan", table_cell_style),
            Paragraph("<b>68.84</b>", table_cell_style),
            Paragraph("[56.9, 80.8]", table_cell_style),
            Paragraph("304", table_cell_style),
            Paragraph("147.70", table_cell_style),
            Paragraph("+20.35", table_cell_style),
            Paragraph("+19.85", table_cell_style),
            Paragraph("15.5%", table_cell_style),
            Paragraph("23.0%", table_cell_style),
            Paragraph("64.7%", table_cell_style),
        ],
    ]

    col_widths_bat = [18, 88, 64, 34, 52, 28, 42, 34, 38, 34, 34, 38]
    t_bat = Table(batters_data, colWidths=col_widths_bat)
    t_bat.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0F172A")),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
    ]))
    story.append(t_bat)
    story.append(Spacer(1, 10))

    # 13. Top 10 Bowlers Table
    story.append(Paragraph("13. Top 10 Bowlers Under Pressure", h1_style))
    story.append(Paragraph(
        "Rankings capture economy suppression, runs prevented, boundary containment, dot ball execution, and wicket-taking frequency under high match leverage.",
        body_style,
    ))

    bowlers_data = [
        [
            Paragraph("<b>Rk</b>", table_header_style),
            Paragraph("<b>Player Name</b>", table_header_style),
            Paragraph("<b>Team(s)</b>", table_header_style),
            Paragraph("<b>Score</b>", table_header_style),
            Paragraph("<b>95% CI</b>", table_header_style),
            Paragraph("<b>Overs</b>", table_header_style),
            Paragraph("<b>Econ</b>", table_header_style),
            Paragraph("<b>&Delta;Econ</b>", table_header_style),
            Paragraph("<b>RP/6</b>", table_header_style),
            Paragraph("<b>Dot %</b>", table_header_style),
            Paragraph("<b>Bnd %</b>", table_header_style),
            Paragraph("<b>Wkt SR</b>", table_header_style),
        ],
        [
            Paragraph("1", table_cell_style),
            Paragraph("<b>Jamie Overton</b>", table_cell_style),
            Paragraph("ENG / CSK", table_cell_style),
            Paragraph("<b>85.13</b>", table_cell_style),
            Paragraph("[70.9, 99.4]", table_cell_style),
            Paragraph("35.3", table_cell_style),
            Paragraph("6.25", table_cell_style),
            Paragraph("-1.97", table_cell_style),
            Paragraph("+2.01", table_cell_style),
            Paragraph("49.5%", table_cell_style),
            Paragraph("12.3%", table_cell_style),
            Paragraph("10.6", table_cell_style),
        ],
        [
            Paragraph("2", table_cell_style),
            Paragraph("<b>Sunil Narine</b>", table_cell_style),
            Paragraph("KKR", table_cell_style),
            Paragraph("<b>83.93</b>", table_cell_style),
            Paragraph("[76.0, 91.9]", table_cell_style),
            Paragraph("114.0", table_cell_style),
            Paragraph("5.87", table_cell_style),
            Paragraph("-0.89", table_cell_style),
            Paragraph("+2.40", table_cell_style),
            Paragraph("40.9%", table_cell_style),
            Paragraph("8.2%", table_cell_style),
            Paragraph("18.0", table_cell_style),
        ],
        [
            Paragraph("3", table_cell_style),
            Paragraph("<b>Abrar Ahmed</b>", table_cell_style),
            Paragraph("Pakistan", table_cell_style),
            Paragraph("<b>81.74</b>", table_cell_style),
            Paragraph("[70.1, 93.4]", table_cell_style),
            Paragraph("53.0", table_cell_style),
            Paragraph("5.51", table_cell_style),
            Paragraph("-1.06", table_cell_style),
            Paragraph("+2.04", table_cell_style),
            Paragraph("44.0%", table_cell_style),
            Paragraph("7.9%", table_cell_style),
            Paragraph("16.7", table_cell_style),
        ],
        [
            Paragraph("4", table_cell_style),
            Paragraph("<b>Sufiyan Muqeem</b>", table_cell_style),
            Paragraph("Pakistan", table_cell_style),
            Paragraph("<b>76.68</b>", table_cell_style),
            Paragraph("[59.7, 93.7]", table_cell_style),
            Paragraph("24.8", table_cell_style),
            Paragraph("5.60", table_cell_style),
            Paragraph("-0.77", table_cell_style),
            Paragraph("+2.05", table_cell_style),
            Paragraph("53.7%", table_cell_style),
            Paragraph("10.1%", table_cell_style),
            Paragraph("11.5", table_cell_style),
        ],
        [
            Paragraph("5", table_cell_style),
            Paragraph("<b>Mujeeb Ur Rahman</b>", table_cell_style),
            Paragraph("AFG / MI", table_cell_style),
            Paragraph("<b>74.94</b>", table_cell_style),
            Paragraph("[61.1, 88.8]", table_cell_style),
            Paragraph("37.7", table_cell_style),
            Paragraph("6.08", table_cell_style),
            Paragraph("-0.70", table_cell_style),
            Paragraph("+1.61", table_cell_style),
            Paragraph("44.3%", table_cell_style),
            Paragraph("10.2%", table_cell_style),
            Paragraph("12.6", table_cell_style),
        ],
        [
            Paragraph("6", table_cell_style),
            Paragraph("<b>Kuldeep Yadav</b>", table_cell_style),
            Paragraph("DC / India", table_cell_style),
            Paragraph("<b>73.08</b>", table_cell_style),
            Paragraph("[66.2, 79.9]", table_cell_style),
            Paragraph("153.5", table_cell_style),
            Paragraph("6.94", table_cell_style),
            Paragraph("-0.90", table_cell_style),
            Paragraph("+1.13", table_cell_style),
            Paragraph("36.2%", table_cell_style),
            Paragraph("11.3%", table_cell_style),
            Paragraph("14.6", table_cell_style),
        ],
        [
            Paragraph("7", table_cell_style),
            Paragraph("<b>Matheesha Pathirana</b>", table_cell_style),
            Paragraph("CSK / SL", table_cell_style),
            Paragraph("<b>72.69</b>", table_cell_style),
            Paragraph("[63.8, 81.6]", table_cell_style),
            Paragraph("90.5", table_cell_style),
            Paragraph("7.24", table_cell_style),
            Paragraph("-0.54", table_cell_style),
            Paragraph("+1.44", table_cell_style),
            Paragraph("37.6%", table_cell_style),
            Paragraph("13.1%", table_cell_style),
            Paragraph("13.6", table_cell_style),
        ],
        [
            Paragraph("8", table_cell_style),
            Paragraph("<b>Lockie Ferguson</b>", table_cell_style),
            Paragraph("NZ / GT", table_cell_style),
            Paragraph("<b>72.45</b>", table_cell_style),
            Paragraph("[61.7, 83.2]", table_cell_style),
            Paragraph("62.7", table_cell_style),
            Paragraph("7.47", table_cell_style),
            Paragraph("-0.90", table_cell_style),
            Paragraph("+1.20", table_cell_style),
            Paragraph("44.7%", table_cell_style),
            Paragraph("16.0%", table_cell_style),
            Paragraph("13.0", table_cell_style),
        ],
        [
            Paragraph("9", table_cell_style),
            Paragraph("<b>Krunal Pandya</b>", table_cell_style),
            Paragraph("LSG / RCB", table_cell_style),
            Paragraph("<b>72.36</b>", table_cell_style),
            Paragraph("[63.4, 81.4]", table_cell_style),
            Paragraph("89.2", table_cell_style),
            Paragraph("6.63", table_cell_style),
            Paragraph("-1.00", table_cell_style),
            Paragraph("+1.42", table_cell_style),
            Paragraph("32.7%", table_cell_style),
            Paragraph("9.3%", table_cell_style),
            Paragraph("16.7", table_cell_style),
        ],
        [
            Paragraph("10", table_cell_style),
            Paragraph("<b>Mitchell Santner</b>", table_cell_style),
            Paragraph("NZ / MI", table_cell_style),
            Paragraph("<b>69.99</b>", table_cell_style),
            Paragraph("[60.9, 79.1]", table_cell_style),
            Paragraph("87.2", table_cell_style),
            Paragraph("6.68", table_cell_style),
            Paragraph("-0.52", table_cell_style),
            Paragraph("+1.13", table_cell_style),
            Paragraph("38.0%", table_cell_style),
            Paragraph("10.9%", table_cell_style),
            Paragraph("16.3", table_cell_style),
        ],
    ]

    col_widths_bowl = [18, 92, 64, 34, 52, 28, 34, 34, 36, 36, 36, 40]
    t_bowl = Table(bowlers_data, colWidths=col_widths_bowl)
    t_bowl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0F172A")),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
    ]))
    story.append(t_bowl)
    story.append(Spacer(1, 10))

    # 14. Uncertainty & Overlapping CIs
    story.append(Paragraph("14. Confidence Intervals & Ranking Uncertainty", h1_style))
    story.append(Paragraph(
        "<b>Explicit Discussion of Overlapping CIs:</b> Because pressure deliveries represent a limited sample of career balls, bootstrap 95% confidence intervals exhibit notable overlap between adjacent ranks (e.g., Jaiswal [71.7, 96.7] vs. Prabhsimran [68.3, 94.5]). In sports analytics, point estimates provide the highest-probability ranking, but these lists must realistically be viewed as elite performance tiers. Sample size directly governs precision: high-volume performers like Suryakumar Yadav (777 balls, CI width &plusmn;7.5) and Kuldeep Yadav (921 balls, CI width &plusmn;6.8) demonstrate rock-solid stability, whereas specialists with ~200 balls have wider intervals.",
        body_style,
    ))

    # 15. Model Validation & Quantile Clarification
    story.append(Paragraph("15. Model Validation & Clarification on Quantile Alignment", h1_style))
    story.append(Paragraph(
        "<b>Quantile Alignment Clarification:</b> We explicitly clarify that matching mathematical quantile distributions across 1st and 2nd innings is purely a numerical normalization technique and does <i>NOT</i> prove equivalent psychological or cricket pressure. Setting a target under resource risk in the 1st innings operates under distinct tactical dynamics compared to chasing required runs against ball depletion in the 2nd innings.<br/>"
        "<b>Case Study Validation:</b> The framework was validated on the IPL 2023 final climax (Mohit Sharma defending 13 runs in the final over against Jadeja). The pre-delivery pressure metric surged from 88.4 to 98.6 as the required equation tightened to 10 off 2 balls, perfectly capturing the inflection point of maximum match leverage with zero retrospective leakage.",
        body_style,
    ))

    # 16 & 17. Limitations & Reproducibility
    story.append(Paragraph("16 & 17. Limitations & Reproducibility", h1_style))
    story.append(Paragraph(
        "<b>Limitations:</b> Absence of pitch telemetry, weather conditions, boundary size asymmetries, and bowler-batter micro-matchup histories.<br/>"
        "<b>Reproducibility:</b> The complete pipeline is 100% deterministic and open-source. Clone the repository, install dependencies via <code>pip install -r requirements.txt</code>, and run <code>python -m src.pipeline</code> to reproduce all outputs, metrics, and JSON structures.",
        body_style,
    ))

    # Build the document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF report: {pdf_path}")


if __name__ == "__main__":
    build_pdf()
