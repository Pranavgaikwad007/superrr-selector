"""
generate_pdf_report.py
Generates an executive, beautifully styled, comprehensive PDF report for
SupeRR Selector Season 2:
- Complete Cricket Pressure Intelligence Methodology & Mathematical Formulas
- Top 10 Batters and Bowlers Under Pressure with 95% Confidence Intervals
- Strategic Blueprint for Rajasthan Royals IPL 2027 Squad Building
- Official Links (GitHub Repo, Deployed Dashboard)
- Case Study Validation (IPL 2023 Final) & Reproducibility
"""

import os
import sys
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
        self.setFont("Helvetica-Bold", 7.5)
        self.setFillColor(colors.HexColor("#260C35"))

        # Header (on pages > 1)
        if self._pageNumber > 1:
            self.drawString(
                40,
                letter[1] - 32,
                "RAJASTHAN ROYALS | SUPERR SELECTOR SEASON 2 — CRICKET PRESSURE INTELLIGENCE",
            )
            self.setFont("Helvetica", 7)
            self.setFillColor(colors.HexColor("#64748B"))
            self.drawRightString(
                letter[0] - 40,
                letter[1] - 32,
                "https://superrr-selector.vercel.app",
            )
            self.setStrokeColor(colors.HexColor("#E5008A"))
            self.setLineWidth(1.0)
            self.line(40, letter[1] - 36, letter[0] - 40, letter[1] - 36)

        # Footer (on all pages)
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.75)
        self.line(40, 38, letter[0] - 40, 38)

        self.setFont("Helvetica", 7.5)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(
            40,
            26,
            "Confidential & Proprietary — Rajasthan Royals & Unstop | Author: Pranav Gaikwad (Pranavgaikwad007)",
        )
        page_str = f"Page {self._pageNumber} of {total_pages}"
        self.drawRightString(letter[0] - 40, 26, page_str)
        self.restoreState()


def get_styles():
    styles = getSampleStyleSheet()

    royal_pink = colors.HexColor("#E5008A")
    deep_purple = colors.HexColor("#260C35")
    dark_text = colors.HexColor("#0F172A")
    body_text = colors.HexColor("#334155")

    doc_styles = {
        "title": ParagraphStyle(
            "DocTitle",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=21,
            leading=25,
            textColor=deep_purple,
            spaceAfter=4,
        ),
        "subtitle": ParagraphStyle(
            "DocSubtitle",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=15,
            textColor=royal_pink,
            spaceAfter=8,
        ),
        "meta": ParagraphStyle(
            "MetaText",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8,
            leading=11.5,
            textColor=colors.HexColor("#475569"),
        ),
        "link_box": ParagraphStyle(
            "LinkBox",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8.5,
            leading=12.5,
            textColor=deep_purple,
        ),
        "h1": ParagraphStyle(
            "Heading1_Custom",
            parent=styles["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=12.5,
            leading=16,
            textColor=deep_purple,
            spaceBefore=12,
            spaceAfter=5,
            keepWithNext=True,
        ),
        "h2": ParagraphStyle(
            "Heading2_Custom",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=9.5,
            leading=13,
            textColor=royal_pink,
            spaceBefore=8,
            spaceAfter=3,
            keepWithNext=True,
        ),
        "h3": ParagraphStyle(
            "Heading3_Custom",
            parent=styles["Heading3"],
            fontName="Helvetica-Bold",
            fontSize=8.5,
            leading=11.5,
            textColor=dark_text,
            spaceBefore=6,
            spaceAfter=2,
            keepWithNext=True,
        ),
        "body": ParagraphStyle(
            "Body_Custom",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8,
            leading=11.5,
            textColor=body_text,
            spaceAfter=4,
        ),
        "bullet": ParagraphStyle(
            "Bullet_Custom",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8,
            leading=11.5,
            textColor=body_text,
            leftIndent=12,
            firstLineIndent=-8,
            spaceAfter=2.5,
        ),
        "formula": ParagraphStyle(
            "FormulaBox",
            parent=styles["Normal"],
            fontName="Courier-Bold",
            fontSize=8,
            leading=11,
            textColor=colors.HexColor("#1E293B"),
        ),
        "formula_desc": ParagraphStyle(
            "FormulaDesc",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=7.5,
            leading=10.5,
            textColor=colors.HexColor("#475569"),
        ),
        "callout": ParagraphStyle(
            "CalloutText",
            parent=styles["Normal"],
            fontName="Helvetica-Oblique",
            fontSize=8,
            leading=11.5,
            textColor=deep_purple,
        ),
        "table_cell": ParagraphStyle(
            "TableCell",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=7,
            leading=9,
            textColor=colors.HexColor("#1E293B"),
        ),
        "table_cell_bold": ParagraphStyle(
            "TableCellBold",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=7,
            leading=9,
            textColor=colors.HexColor("#0F172A"),
        ),
        "table_header": ParagraphStyle(
            "TableHeader",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=7,
            leading=9,
            textColor=colors.white,
        ),
        "player_card_name": ParagraphStyle(
            "PlayerCardName",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8.5,
            leading=11,
            textColor=deep_purple,
        ),
        "player_card_role": ParagraphStyle(
            "PlayerCardRole",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=7.5,
            leading=10,
            textColor=royal_pink,
        ),
        "player_card_body": ParagraphStyle(
            "PlayerCardBody",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=7.5,
            leading=10.5,
            textColor=body_text,
        ),
    }
    return doc_styles


def build_formula_box(title, formula_text, variable_explanations, styles):
    """
    Renders an elegant card-like table containing a mathematical formula and its variable breakdown.
    """
    flowables = []
    flowables.append(Paragraph(f"<b>{title}</b>", styles["h3"]))
    flowables.append(Spacer(1, 2))
    flowables.append(Paragraph(formula_text, styles["formula"]))
    if variable_explanations:
        flowables.append(Spacer(1, 3))
        for exp in variable_explanations:
            flowables.append(Paragraph(f"&bull; {exp}", styles["formula_desc"]))

    t = Table([[flowables]], colWidths=[528])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ('BOX', (0, 0), (-1, -1), 0.75, colors.HexColor("#CBD5E1")),
        ('LINELEFT', (0, 0), (-1, -1), 2.5, colors.HexColor("#E5008A")),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    return t


def build_links_banner(styles):
    """
    Prominent clickable links box for the top of the report.
    """
    content = [
        Paragraph(
            "<b>Official Deployment Links & Codebase Repository:</b>",
            styles["link_box"],
        ),
        Spacer(1, 2),
        Paragraph(
            "&bull; <b>Live Interactive Platform:</b> <font color='#E5008A'><u><a href='https://superrr-selector.vercel.app'>https://superrr-selector.vercel.app</a></u></font> (Vercel Production Deployed)<br/>"
            "&bull; <b>Official GitHub Repository:</b> <font color='#260C35'><u><a href='https://github.com/Pranavgaikwad007/superrr-selector'>https://github.com/Pranavgaikwad007/superrr-selector</a></u></font> (Full Codebase, Tests & Artifacts)<br/>"
            "&bull; <b>Author / Maintainer:</b> Pranav Gaikwad (<code>Pranavgaikwad007</code>) &nbsp;|&nbsp; <b>Competition:</b> SupeRR Selector Season 2 &nbsp;|&nbsp; <b>Partner:</b> Rajasthan Royals & Unstop",
            styles["meta"],
        ),
    ]
    t = Table([[content]], colWidths=[528])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#FFF1F8")),
        ('BOX', (0, 0), (-1, -1), 1.0, colors.HexColor("#E5008A")),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    return t


def build_pdf_report(target_pdf_path):
    os.makedirs(os.path.dirname(target_pdf_path), exist_ok=True)

    # Printable width: 612 - 2 * 42 = 528 pt.
    doc = SimpleDocTemplate(
        target_pdf_path,
        pagesize=letter,
        leftMargin=42,
        rightMargin=42,
        topMargin=42,
        bottomMargin=42,
    )

    styles = get_styles()
    story = []

    # =========================================================================
    # COVER / HEADER SECTION
    # =========================================================================
    story.append(Paragraph("SupeRR Selector Season 2 — Final Intelligence Report", styles["title"]))
    story.append(Paragraph("Cricket Pressure Intelligence System (CPIS) & Rajasthan Royals IPL 2027 Squad Blueprint", styles["subtitle"]))
    story.append(build_links_banner(styles))
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#E5008A"), spaceBefore=2, spaceAfter=8))

    # =========================================================================
    # SECTION 1: EXECUTIVE SUMMARY
    # =========================================================================
    story.append(Paragraph("1. Executive Summary", styles["h1"]))
    story.append(Paragraph(
        "In modern Twenty20 franchise cricket, standard aggregated statistics—such as raw batting strike rate or bowling economy rate—fail to distinguish between low-consequence 'garbage time' and critical match-defining leverage. A batter striking at 170 in an already-decided chase faces fundamentally different psychological and tactical constraints than a batter requiring 24 runs off 11 balls against high-caliber death bowling. Similarly, a bowler defending 9 runs in the 20th over operates under vastly different pressure dynamics than one bowling with 60 runs to defend.",
        styles["body"],
    ))
    story.append(Paragraph(
        "This report presents the <b>Cricket Pressure Intelligence System (CPIS)</b>, an objective, mathematically rigorous framework developed for <b>SupeRR Selector Season 2</b>. CPIS reconstructs ball-by-ball match states, defines an objective pre-delivery Pressure Index (&Psi; &isin; [0, 100]), models the asymmetric mechanics of 1st-innings resource exhaustion versus 2nd-innings win-probability volatility, computes context-aware performance deltas, and synthesizes player reliability using Empirical Bayesian shrinkage with 1,000-iteration bootstrap confidence intervals.",
        styles["body"],
    ))
    story.append(Paragraph("<b>Primary Analytical & Strategic Findings:</b>", styles["body"]))
    story.append(Paragraph(
        "&bull; <b>Audited Scope:</b> Evaluated 883 scheduled fixtures (incorporating 837 senior eligible matches with delivery records, comprising 367 IPL and 470 T20I fixtures) and 194,014 eligible deliveries. Exactly <b>68,402 deliveries (35.26%)</b> qualify as high-pressure (&Psi; &ge; 65.0).",
        styles["bullet"],
    ))
    story.append(Paragraph(
        "&bull; <b>#1 High-Pressure Batter:</b> <b>Yashasvi Jaiswal</b> (Rajasthan Royals / India) leads all qualified batters with a Pressure Reliability Score of <b>84.17 / 100</b> (95% CI: [71.66, 96.68]). Under high pressure, Jaiswal accelerates from a 156.36 baseline to <b>179.71 SR</b> (&Delta;SR = +23.35), generating <b>+39.41 runs added per 100 balls</b> with a 28.62% boundary frequency.",
        styles["bullet"],
    ))
    story.append(Paragraph(
        "&bull; <b>#1 High-Pressure Bowler:</b> <b>Jamie Overton</b> (England / Chennai Super Kings) leads all qualified bowlers with a Pressure Reliability Score of <b>85.13 / 100</b> (95% CI: [70.85, 99.41]). Under extreme stress, Overton suppresses scoring to an economy of <b>6.25</b> (down from 8.22 baseline, &Delta;Econ = -1.97), preventing <b>+2.01 runs per 6 balls</b> with a wicket strike rate of <b>10.60 balls/wicket</b> and 49.53% dot ball execution.",
        styles["bullet"],
    ))
    story.append(Paragraph(
        "&bull; <b>IPL 2027 Strategic Value for Rajasthan Royals:</b> Detailed squad-building blueprint providing actionable recruitment priorities across Sawai Mansingh Stadium's distinct pitch dimensions and conditions, specifically targeting high-pressure execution gaps in death-overs bowling and spin-demolishing middle overs.",
        styles["bullet"],
    ))

    # =========================================================================
    # SECTION 2: DATASET AUDIT & REFERENTIAL INTEGRITY
    # =========================================================================
    story.append(Spacer(1, 4))
    story.append(Paragraph("2. Dataset Description & Referential Integrity Audit", styles["h1"]))
    story.append(Paragraph(
        "The analytical pipeline ingests six relational tables spanning 2022 to 2026. Prior to mathematical modeling, a comprehensive audit reconciled scheduled matches against delivery records and resolved entity collisions:",
        styles["body"],
    ))

    audit_table_data = [
        [
            Paragraph("<b>Category / Entity</b>", styles["table_header"]),
            Paragraph("<b>Raw Count</b>", styles["table_header"]),
            Paragraph("<b>Valid Count</b>", styles["table_header"]),
            Paragraph("<b>Excluded / Resolved</b>", styles["table_header"]),
            Paragraph("<b>Analytical Justification</b>", styles["table_header"]),
        ],
        [
            Paragraph("Scheduled Matches", styles["table_cell_bold"]),
            Paragraph("883", styles["table_cell"]),
            Paragraph("837", styles["table_cell"]),
            Paragraph("46 excluded", styles["table_cell"]),
            Paragraph("16 abandoned (no ball bowled) + 30 Other_T20 developmental matches excluded for professional parity.", styles["table_cell"]),
        ],
        [
            Paragraph("Contest Deliveries", styles["table_cell_bold"]),
            Paragraph("200,999", styles["table_cell"]),
            Paragraph("194,014", styles["table_cell"]),
            Paragraph("6,985 excluded", styles["table_cell"]),
            Paragraph("Deliveries from excluded developmental fixtures removed; zero missing balls in eligible matches.", styles["table_cell"]),
        ],
        [
            Paragraph("High-Pressure Deliveries", styles["table_cell_bold"]),
            Paragraph("-", styles["table_cell"]),
            Paragraph("68,402", styles["table_cell"]),
            Paragraph("35.26% of corpus", styles["table_cell"]),
            Paragraph("Deliveries with continuous pre-ball Pressure Index &Psi; &ge; 65.0 across both innings.", styles["table_cell"]),
        ],
        [
            Paragraph("Player Master Registry", styles["table_cell_bold"]),
            Paragraph("959 players", styles["table_cell"]),
            Paragraph("291 qualified", styles["table_cell"]),
            Paragraph("7 entity collisions", styles["table_cell"]),
            Paragraph("7 names share multiple player_ids (e.g. Abdul Samad). Aggregations indexed strictly on integer player_id.", styles["table_cell"]),
        ],
        [
            Paragraph("Eligibility Thresholds", styles["table_cell_bold"]),
            Paragraph("-", styles["table_cell"]),
            Paragraph("135 Bat / 156 Bowl", styles["table_cell"]),
            Paragraph("Min: 120p balls, 8p matches", styles["table_cell"]),
            Paragraph("Requires &ge;120 pressure balls, &ge;8 pressure matches, and &ge;250 career balls to eliminate small-sample noise.", styles["table_cell"]),
        ],
    ]
    t_audit = Table(audit_table_data, colWidths=[100, 52, 54, 88, 234])
    t_audit.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#260C35")),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
    ]))
    story.append(t_audit)

    # =========================================================================
    # SECTION 3: COMPLETE MATHEMATICAL FORMULAS
    # =========================================================================
    story.append(Spacer(1, 6))
    story.append(Paragraph("3. Complete Mathematical Formulations (Every Formula Defined)", styles["h1"]))
    story.append(Paragraph(
        "To satisfy absolute scientific scrutiny and prevent future data leakage, all pressure and performance variables are calculated strictly <b>before</b> the delivery is bowled.",
        styles["body"],
    ))

    # Formula 1: Pre-Delivery Match State
    story.append(build_formula_box(
        "3.1 Pre-Delivery Match State Variables (Zero Future Data Leakage)",
        "B_rem = 120 - LegalBallsBowled<br/>"
        "W_rem = 10 - WicketsLost<br/>"
        "RunsRequired = max(1, TargetRuns - CurrentScore)&nbsp;&nbsp;[2nd Innings]<br/>"
        "RRR = RunsRequired / (B_rem / 6.0)&nbsp;&nbsp;|&nbsp;&nbsp;CRR = CurrentScore / ((120 - B_rem) / 6.0)",
        [
            "B_rem: Exact count of legal deliveries remaining in the 20-over quota.",
            "W_rem: Wickets remaining in hand prior to ball release.",
            "RRR & CRR: Required and Current Run Rates computed strictly on legal pre-ball states.",
        ],
        styles,
    ))
    story.append(Spacer(1, 4))

    # Formula 2: First-Innings Dynamic Par & Resource Stress
    story.append(build_formula_box(
        "3.2 First-Innings Pressure Engine (&Psi;<sub>inn1</sub>): Resource Depletion & Par Deficit",
        "ResourceStress = 1.0 - ( (B_rem / 120.0) * (W_rem / 10.0) ) ^ 0.65<br/>"
        "ProjectedScore = CurrentScore + CRR * (B_rem / 6.0)<br/>"
        "ParDeficit = 1.0 / ( 1.0 + exp( -(VenuePar - ProjectedScore) / 18.0 ) )&nbsp;&nbsp;[VenuePar = 165.0]<br/>"
        "DeathPhaseMultiplier = 1.0 + 0.35 * max( 0.0, (Over - 15.0) / 5.0 )<br/>"
        "&Psi;<sub>inn1_raw</sub> = 100 * [ 0.40 * ResourceStress + 0.35 * ParDeficit + 0.25 * (ResourceStress * DeathPhaseMultiplier) ]",
        [
            "Resource Stress: Non-linear DLS resource depletion using exponential curvature (power 0.65).",
            "Par Deficit: Continuous logistic sigmoid comparing projected total to venue par baseline (165.0), scaled by &sigma;=18.0.",
            "Death Phase: Progressive compounding scalar for overs 16–20 reflecting accelerated risk.",
        ],
        styles,
    ))
    story.append(Spacer(1, 4))

    # Formula 3: Second-Innings Win Probability & Leverage
    story.append(build_formula_box(
        "3.3 Second-Innings Pressure Engine (&Psi;<sub>inn2</sub>): Win Probability Volatility Gradient",
        "P_win = 1.0 / ( 1.0 + exp( -z ) )<br/>"
        "z = &beta;_0 + &beta;_1 * (RRR - CRR) + &beta;_2 * [ RunsRequired / (W_rem + 1) ] - &beta;_3 * (B_rem / 6.0)<br/>"
        "Leverage = | P_win(Outcome = Boundary) - P_win(Outcome = Wicket) |<br/>"
        "WicketFragility = 1.0 - (W_rem / 10.0)<br/>"
        "&Psi;<sub>inn2_raw</sub> = 100 * [ 0.50 * Leverage + 0.35 * MinMax(RRR, [4.0, 16.0]) + 0.15 * WicketFragility ]",
        [
            "P_win: Pre-delivery win probability modeled via calibrated logistic regression.",
            "Leverage: Absolute win probability swing between a boundary event vs. a dismissal event on the immediate ball.",
            "MinMax(RRR): Bounded required run rate normalized between 4.0 and 16.0 RPO.",
        ],
        styles,
    ))

    story.append(PageBreak())

    # Formula 4: Quantile Normalization & Tiers
    story.append(build_formula_box(
        "3.4 Continuous Quantile Normalization & 4 Tactical Pressure Tiers",
        "&Psi; = QuantileTransform( &Psi;<sub>raw</sub>, target_distribution = Uniform[0, 100] )<br/>"
        "&bull; Ordinary Pressure (&Psi; < 40.0): 69,686 deliveries (35.9%) — early consolidation, low leverage<br/>"
        "&bull; Medium Pressure (40.0 &le; &Psi; < 65.0): 55,926 deliveries (28.8%) — standard mid-innings overs<br/>"
        "&bull; High Pressure (65.0 &le; &Psi; < 85.0): 42,750 deliveries (22.0%) — escalating chases, collapse risk<br/>"
        "&bull; Extreme Pressure (&Psi; &ge; 85.0): 25,652 deliveries (13.2%) — clutch death overs, steep equations",
        [
            "High-Pressure Corpus (&Psi; &ge; 65.0): Combines High + Extreme tiers = 68,402 deliveries (35.26%).",
            "CRITICAL SCIENTIFIC DISTINCTION: Quantile matching is strictly a numerical standardization technique to equalize score ranges across innings. It does NOT imply psychological equivalence between setting a total and chasing.",
        ],
        styles,
    ))
    story.append(Spacer(1, 4))

    # Formula 5: Batting Performance Formulas
    story.append(build_formula_box(
        "3.5 Batting Performance Formulas Under Pressure",
        "&Delta;SR = SR_pressure - SR_overall&nbsp;&nbsp;where&nbsp;&nbsp;SR = (Runs / Balls) * 100<br/>"
        "RA_100 = &sum;<sub>i=1..N_p</sub> ( Runs_i - E[Runs | Phase, Innings, StressBucket] ) * ( 100.0 / N_p )<br/>"
        "Boundary% = [ (Fours + Sixes) / N_p ] * 100&nbsp;&nbsp;|&nbsp;&nbsp;Dot% = [ Dots / N_p ] * 100<br/>"
        "Consistency% = [ Matches with Positive Net RA / Total Pressure Matches ] * 100<br/>"
        "R_bat_raw = 0.35 * Norm(&Delta;SR) + 0.35 * Norm(RA_100) + 0.15 * Norm(Boundary%) + 0.15 * Consistency%",
        [
            "&Delta;SR: Strike rate acceleration under pressure compared against player's career baseline.",
            "RA_100: Context-Aware Runs Added per 100 balls against historical expectation conditioned on over bucket and innings.",
            "R_bat_raw: Multi-dimensional raw batting composite scaled 0 to 100 before Bayesian regularization.",
        ],
        styles,
    ))
    story.append(Spacer(1, 4))

    # Formula 6: Bowling Performance Formulas
    story.append(build_formula_box(
        "3.6 Bowling Performance Formulas Under Pressure",
        "&Delta;Econ = Econ_pressure - Econ_overall&nbsp;&nbsp;(Target: negative &Delta;Econ, representing suppression)<br/>"
        "RP_6 = &sum;<sub>i=1..B_p</sub> ( E[Conceded | Phase, Innings, StressBucket] - Conceded_i ) * ( 6.0 / B_p )<br/>"
        "Dot% = [ DotDeliveries / B_p ] * 100&nbsp;&nbsp;|&nbsp;&nbsp;Boundary% = [ BoundariesConceded / B_p ] * 100<br/>"
        "WicketSR = B_p / max(1, Wickets_pressure)<br/>"
        "R_bowl_raw = 0.30 * Norm(-&Delta;Econ) + 0.30 * Norm(RP_6) + 0.20 * Norm(Dot%) + 0.20 * Norm(1.0 / WicketSR)",
        [
            "&Delta;Econ: Economy rate reduction under pressure compared to career baseline.",
            "RP_6: Runs Prevented per 6 legal balls compared against contextual baseline expectations.",
            "WicketSR: Balls per wicket under high pressure; inverted in scoring to reward frequent dismissals.",
        ],
        styles,
    ))
    story.append(Spacer(1, 4))

    # Formula 7: Empirical Bayes Shrinkage & Bootstrap Confidence Intervals
    story.append(build_formula_box(
        "3.7 Empirical Bayesian Shrinkage & 1,000-Iteration Bootstrap Resampling",
        "R_Bayes = [ N_p / (N_p + N_0) ] * R_observed + [ N_0 / (N_p + N_0) ] * &mu;_0<br/>"
        "&mu;_0 = 50.0 (Prior Population Mean)&nbsp;&nbsp;|&nbsp;&nbsp;N_0 = 100.0 (Prior Delivery Weight)<br/>"
        "95% Bootstrap CI = [ Q_0.025( R_Bayes^(1..B) ), Q_0.975( R_Bayes^(1..B) ) ]&nbsp;&nbsp;[B = 1,000 resamples]",
        [
            "Empirical Bayes: Shrinks small-sample outliers toward the population mean (50.0). High-volume players retain observed score; low-volume players shrink.",
            "Bootstrap CI: 1,000 non-parametric resamples with replacement generate empirical 95% confidence intervals.",
            "OVERLAPPING CI ACKNOWLEDGMENT: Adjacent rankings possess overlapping confidence intervals. Scores represent expected mean reliability tiers rather than deterministic absolute ranks.",
        ],
        styles,
    ))

    # =========================================================================
    # SECTION 4: TOP 10 BATTERS UNDER PRESSURE
    # =========================================================================
    story.append(Spacer(1, 6))
    story.append(Paragraph("4. Top 10 Most Reliable Batters Under Pressure", styles["h1"]))
    story.append(Paragraph(
        "Rankings synthesize strike rate acceleration, runs added, boundary efficiency, and match consistency, regularized via Empirical Bayes with 1,000-iteration bootstrap confidence intervals (min 120 pressure balls, 8 pressure matches, 250 career balls):",
        styles["body"],
    ))

    batters_data = [
        [
            Paragraph("<b>Rk</b>", styles["table_header"]),
            Paragraph("<b>Player Name</b>", styles["table_header"]),
            Paragraph("<b>Team(s)</b>", styles["table_header"]),
            Paragraph("<b>Score</b>", styles["table_header"]),
            Paragraph("<b>95% CI</b>", styles["table_header"]),
            Paragraph("<b>Balls</b>", styles["table_header"]),
            Paragraph("<b>SR Press</b>", styles["table_header"]),
            Paragraph("<b>&Delta;SR</b>", styles["table_header"]),
            Paragraph("<b>RA/100</b>", styles["table_header"]),
            Paragraph("<b>Bnd %</b>", styles["table_header"]),
            Paragraph("<b>Dot %</b>", styles["table_header"]),
            Paragraph("<b>Cons %</b>", styles["table_header"]),
        ],
        [
            Paragraph("1", styles["table_cell_bold"]),
            Paragraph("<b>Yashasvi Jaiswal</b>", styles["table_cell_bold"]),
            Paragraph("RR / India", styles["table_cell"]),
            Paragraph("<b>84.17</b>", styles["table_cell_bold"]),
            Paragraph("[71.7, 96.7]", styles["table_cell"]),
            Paragraph("276", styles["table_cell"]),
            Paragraph("179.71", styles["table_cell"]),
            Paragraph("+23.35", styles["table_cell_bold"]),
            Paragraph("+39.41", styles["table_cell_bold"]),
            Paragraph("28.6%", styles["table_cell"]),
            Paragraph("26.1%", styles["table_cell"]),
            Paragraph("66.7%", styles["table_cell"]),
        ],
        [
            Paragraph("2", styles["table_cell_bold"]),
            Paragraph("<b>Prabhsimran Singh</b>", styles["table_cell_bold"]),
            Paragraph("PBKS", styles["table_cell"]),
            Paragraph("<b>81.40</b>", styles["table_cell_bold"]),
            Paragraph("[68.3, 94.5]", styles["table_cell"]),
            Paragraph("251", styles["table_cell"]),
            Paragraph("178.09", styles["table_cell"]),
            Paragraph("+18.03", styles["table_cell_bold"]),
            Paragraph("+38.34", styles["table_cell_bold"]),
            Paragraph("27.1%", styles["table_cell"]),
            Paragraph("27.5%", styles["table_cell"]),
            Paragraph("72.2%", styles["table_cell"]),
        ],
        [
            Paragraph("3", styles["table_cell_bold"]),
            Paragraph("<b>Abhishek Sharma</b>", styles["table_cell_bold"]),
            Paragraph("SRH / India", styles["table_cell"]),
            Paragraph("<b>76.44</b>", styles["table_cell_bold"]),
            Paragraph("[63.7, 89.2]", styles["table_cell"]),
            Paragraph("264", styles["table_cell"]),
            Paragraph("185.23", styles["table_cell"]),
            Paragraph("-1.27", styles["table_cell"]),
            Paragraph("+49.74", styles["table_cell_bold"]),
            Paragraph("28.4%", styles["table_cell"]),
            Paragraph("28.4%", styles["table_cell"]),
            Paragraph("67.9%", styles["table_cell"]),
        ],
        [
            Paragraph("4", styles["table_cell_bold"]),
            Paragraph("<b>Naman Dhir</b>", styles["table_cell_bold"]),
            Paragraph("MI / India", styles["table_cell"]),
            Paragraph("<b>76.11</b>", styles["table_cell_bold"]),
            Paragraph("[62.0, 90.2]", styles["table_cell"]),
            Paragraph("217", styles["table_cell"]),
            Paragraph("182.95", styles["table_cell"]),
            Paragraph("+10.91", styles["table_cell_bold"]),
            Paragraph("+37.01", styles["table_cell_bold"]),
            Paragraph("26.3%", styles["table_cell"]),
            Paragraph("24.9%", styles["table_cell"]),
            Paragraph("65.2%", styles["table_cell"]),
        ],
        [
            Paragraph("5", styles["table_cell_bold"]),
            Paragraph("<b>Quinton de Kock</b>", styles["table_cell_bold"]),
            Paragraph("LSG / SA", styles["table_cell"]),
            Paragraph("<b>73.97</b>", styles["table_cell_bold"]),
            Paragraph("[60.5, 87.5]", styles["table_cell"]),
            Paragraph("238", styles["table_cell"]),
            Paragraph("166.81", styles["table_cell"]),
            Paragraph("+15.94", styles["table_cell_bold"]),
            Paragraph("+33.40", styles["table_cell_bold"]),
            Paragraph("23.9%", styles["table_cell"]),
            Paragraph("28.2%", styles["table_cell"]),
            Paragraph("66.7%", styles["table_cell"]),
        ],
        [
            Paragraph("6", styles["table_cell_bold"]),
            Paragraph("<b>Suryakumar Yadav</b>", styles["table_cell_bold"]),
            Paragraph("India / MI", styles["table_cell"]),
            Paragraph("<b>72.79</b>", styles["table_cell_bold"]),
            Paragraph("[65.3, 80.3]", styles["table_cell"]),
            Paragraph("777", styles["table_cell"]),
            Paragraph("165.77", styles["table_cell"]),
            Paragraph("-0.66", styles["table_cell"]),
            Paragraph("+30.46", styles["table_cell_bold"]),
            Paragraph("23.4%", styles["table_cell"]),
            Paragraph("27.9%", styles["table_cell"]),
            Paragraph("63.0%", styles["table_cell"]),
        ],
        [
            Paragraph("7", styles["table_cell_bold"]),
            Paragraph("<b>Reeza Hendricks</b>", styles["table_cell_bold"]),
            Paragraph("South Africa", styles["table_cell"]),
            Paragraph("<b>71.69</b>", styles["table_cell_bold"]),
            Paragraph("[57.3, 86.0]", styles["table_cell"]),
            Paragraph("210", styles["table_cell"]),
            Paragraph("156.67", styles["table_cell"]),
            Paragraph("+10.08", styles["table_cell_bold"]),
            Paragraph("+30.57", styles["table_cell_bold"]),
            Paragraph("20.0%", styles["table_cell"]),
            Paragraph("26.7%", styles["table_cell"]),
            Paragraph("66.7%", styles["table_cell"]),
        ],
        [
            Paragraph("8", styles["table_cell_bold"]),
            Paragraph("<b>Heinrich Klaasen</b>", styles["table_cell_bold"]),
            Paragraph("SRH / SA", styles["table_cell"]),
            Paragraph("<b>70.51</b>", styles["table_cell_bold"]),
            Paragraph("[61.7, 79.4]", styles["table_cell"]),
            Paragraph("552", styles["table_cell"]),
            Paragraph("167.03", styles["table_cell"]),
            Paragraph("+0.27", styles["table_cell"]),
            Paragraph("+29.48", styles["table_cell_bold"]),
            Paragraph("22.5%", styles["table_cell"]),
            Paragraph("25.9%", styles["table_cell"]),
            Paragraph("62.5%", styles["table_cell"]),
        ],
        [
            Paragraph("9", styles["table_cell_bold"]),
            Paragraph("<b>Ajinkya Rahane</b>", styles["table_cell_bold"]),
            Paragraph("KKR / CSK", styles["table_cell"]),
            Paragraph("<b>69.06</b>", styles["table_cell_bold"]),
            Paragraph("[53.4, 84.7]", styles["table_cell"]),
            Paragraph("177", styles["table_cell"]),
            Paragraph("163.28", styles["table_cell"]),
            Paragraph("+24.15", styles["table_cell_bold"]),
            Paragraph("+27.82", styles["table_cell_bold"]),
            Paragraph("18.6%", styles["table_cell"]),
            Paragraph("25.4%", styles["table_cell"]),
            Paragraph("66.7%", styles["table_cell"]),
        ],
        [
            Paragraph("10", styles["table_cell_bold"]),
            Paragraph("<b>Mohammad Rizwan</b>", styles["table_cell_bold"]),
            Paragraph("Pakistan", styles["table_cell"]),
            Paragraph("<b>68.84</b>", styles["table_cell_bold"]),
            Paragraph("[56.9, 80.8]", styles["table_cell"]),
            Paragraph("304", styles["table_cell"]),
            Paragraph("147.70", styles["table_cell"]),
            Paragraph("+20.35", styles["table_cell_bold"]),
            Paragraph("+19.85", styles["table_cell_bold"]),
            Paragraph("15.5%", styles["table_cell"]),
            Paragraph("23.0%", styles["table_cell"]),
            Paragraph("64.7%", styles["table_cell"]),
        ],
    ]

    col_widths_bat = [18, 92, 66, 34, 52, 28, 42, 34, 38, 36, 36, 38]
    t_bat = Table(batters_data, colWidths=col_widths_bat)
    t_bat.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#260C35")),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
    ]))
    story.append(t_bat)

    # =========================================================================
    # SECTION 5: TOP 10 BOWLERS UNDER PRESSURE
    # =========================================================================
    story.append(Spacer(1, 6))
    story.append(Paragraph("5. Top 10 Most Reliable Bowlers Under Pressure", styles["h1"]))
    story.append(Paragraph(
        "Rankings synthesize economy suppression, runs prevented, dot ball execution, and wicket strike rate under high pressure (&Psi; &ge; 65.0):",
        styles["body"],
    ))

    bowlers_data = [
        [
            Paragraph("<b>Rk</b>", styles["table_header"]),
            Paragraph("<b>Player Name</b>", styles["table_header"]),
            Paragraph("<b>Team(s)</b>", styles["table_header"]),
            Paragraph("<b>Score</b>", styles["table_header"]),
            Paragraph("<b>95% CI</b>", styles["table_header"]),
            Paragraph("<b>Overs</b>", styles["table_header"]),
            Paragraph("<b>Econ</b>", styles["table_header"]),
            Paragraph("<b>&Delta;Econ</b>", styles["table_header"]),
            Paragraph("<b>RP/6</b>", styles["table_header"]),
            Paragraph("<b>Dot %</b>", styles["table_header"]),
            Paragraph("<b>Bnd %</b>", styles["table_header"]),
            Paragraph("<b>Wkt SR</b>", styles["table_header"]),
        ],
        [
            Paragraph("1", styles["table_cell_bold"]),
            Paragraph("<b>Jamie Overton</b>", styles["table_cell_bold"]),
            Paragraph("ENG / CSK", styles["table_cell"]),
            Paragraph("<b>85.13</b>", styles["table_cell_bold"]),
            Paragraph("[70.9, 99.4]", styles["table_cell"]),
            Paragraph("35.3", styles["table_cell"]),
            Paragraph("6.25", styles["table_cell_bold"]),
            Paragraph("-1.97", styles["table_cell_bold"]),
            Paragraph("+2.01", styles["table_cell_bold"]),
            Paragraph("49.5%", styles["table_cell"]),
            Paragraph("12.3%", styles["table_cell"]),
            Paragraph("10.6", styles["table_cell_bold"]),
        ],
        [
            Paragraph("2", styles["table_cell_bold"]),
            Paragraph("<b>Sunil Narine</b>", styles["table_cell_bold"]),
            Paragraph("KKR", styles["table_cell"]),
            Paragraph("<b>83.93</b>", styles["table_cell_bold"]),
            Paragraph("[76.0, 91.9]", styles["table_cell"]),
            Paragraph("114.0", styles["table_cell"]),
            Paragraph("5.87", styles["table_cell_bold"]),
            Paragraph("-0.89", styles["table_cell_bold"]),
            Paragraph("+2.40", styles["table_cell_bold"]),
            Paragraph("40.9%", styles["table_cell"]),
            Paragraph("8.2%", styles["table_cell_bold"]),
            Paragraph("18.0", styles["table_cell"]),
        ],
        [
            Paragraph("3", styles["table_cell_bold"]),
            Paragraph("<b>Abrar Ahmed</b>", styles["table_cell_bold"]),
            Paragraph("Pakistan", styles["table_cell"]),
            Paragraph("<b>81.74</b>", styles["table_cell_bold"]),
            Paragraph("[70.1, 93.4]", styles["table_cell"]),
            Paragraph("53.0", styles["table_cell"]),
            Paragraph("5.51", styles["table_cell_bold"]),
            Paragraph("-1.06", styles["table_cell_bold"]),
            Paragraph("+2.04", styles["table_cell_bold"]),
            Paragraph("44.0%", styles["table_cell"]),
            Paragraph("7.9%", styles["table_cell_bold"]),
            Paragraph("16.7", styles["table_cell"]),
        ],
        [
            Paragraph("4", styles["table_cell_bold"]),
            Paragraph("<b>Sufiyan Muqeem</b>", styles["table_cell_bold"]),
            Paragraph("Pakistan", styles["table_cell"]),
            Paragraph("<b>76.68</b>", styles["table_cell_bold"]),
            Paragraph("[59.7, 93.7]", styles["table_cell"]),
            Paragraph("24.8", styles["table_cell"]),
            Paragraph("5.60", styles["table_cell_bold"]),
            Paragraph("-0.77", styles["table_cell_bold"]),
            Paragraph("+2.05", styles["table_cell_bold"]),
            Paragraph("53.7%", styles["table_cell_bold"]),
            Paragraph("10.1%", styles["table_cell"]),
            Paragraph("11.5", styles["table_cell_bold"]),
        ],
        [
            Paragraph("5", styles["table_cell_bold"]),
            Paragraph("<b>Mujeeb Ur Rahman</b>", styles["table_cell_bold"]),
            Paragraph("AFG / MI", styles["table_cell"]),
            Paragraph("<b>74.94</b>", styles["table_cell_bold"]),
            Paragraph("[61.1, 88.8]", styles["table_cell"]),
            Paragraph("37.7", styles["table_cell"]),
            Paragraph("6.08", styles["table_cell_bold"]),
            Paragraph("-0.70", styles["table_cell_bold"]),
            Paragraph("+1.61", styles["table_cell_bold"]),
            Paragraph("44.3%", styles["table_cell"]),
            Paragraph("10.2%", styles["table_cell"]),
            Paragraph("12.6", styles["table_cell_bold"]),
        ],
        [
            Paragraph("6", styles["table_cell_bold"]),
            Paragraph("<b>Kuldeep Yadav</b>", styles["table_cell_bold"]),
            Paragraph("DC / India", styles["table_cell"]),
            Paragraph("<b>73.08</b>", styles["table_cell_bold"]),
            Paragraph("[66.2, 79.9]", styles["table_cell"]),
            Paragraph("153.5", styles["table_cell"]),
            Paragraph("6.94", styles["table_cell"]),
            Paragraph("-0.90", styles["table_cell_bold"]),
            Paragraph("+1.13", styles["table_cell_bold"]),
            Paragraph("36.2%", styles["table_cell"]),
            Paragraph("11.3%", styles["table_cell"]),
            Paragraph("14.6", styles["table_cell_bold"]),
        ],
        [
            Paragraph("7", styles["table_cell_bold"]),
            Paragraph("<b>Matheesha Pathirana</b>", styles["table_cell_bold"]),
            Paragraph("CSK / SL", styles["table_cell"]),
            Paragraph("<b>72.69</b>", styles["table_cell_bold"]),
            Paragraph("[63.8, 81.6]", styles["table_cell"]),
            Paragraph("90.5", styles["table_cell"]),
            Paragraph("7.24", styles["table_cell"]),
            Paragraph("-0.54", styles["table_cell_bold"]),
            Paragraph("+1.44", styles["table_cell_bold"]),
            Paragraph("37.6%", styles["table_cell"]),
            Paragraph("13.1%", styles["table_cell"]),
            Paragraph("13.6", styles["table_cell_bold"]),
        ],
        [
            Paragraph("8", styles["table_cell_bold"]),
            Paragraph("<b>Lockie Ferguson</b>", styles["table_cell_bold"]),
            Paragraph("NZ / GT", styles["table_cell"]),
            Paragraph("<b>72.45</b>", styles["table_cell_bold"]),
            Paragraph("[61.7, 83.2]", styles["table_cell"]),
            Paragraph("62.7", styles["table_cell"]),
            Paragraph("7.47", styles["table_cell"]),
            Paragraph("-0.90", styles["table_cell_bold"]),
            Paragraph("+1.20", styles["table_cell_bold"]),
            Paragraph("44.7%", styles["table_cell"]),
            Paragraph("16.0%", styles["table_cell"]),
            Paragraph("13.0", styles["table_cell_bold"]),
        ],
        [
            Paragraph("9", styles["table_cell_bold"]),
            Paragraph("<b>Krunal Pandya</b>", styles["table_cell_bold"]),
            Paragraph("LSG / RCB", styles["table_cell"]),
            Paragraph("<b>72.36</b>", styles["table_cell_bold"]),
            Paragraph("[63.4, 81.4]", styles["table_cell"]),
            Paragraph("89.2", styles["table_cell"]),
            Paragraph("6.63", styles["table_cell_bold"]),
            Paragraph("-1.00", styles["table_cell_bold"]),
            Paragraph("+1.42", styles["table_cell_bold"]),
            Paragraph("32.7%", styles["table_cell"]),
            Paragraph("9.3%", styles["table_cell_bold"]),
            Paragraph("16.7", styles["table_cell"]),
        ],
        [
            Paragraph("10", styles["table_cell_bold"]),
            Paragraph("<b>Mitchell Santner</b>", styles["table_cell_bold"]),
            Paragraph("NZ / MI", styles["table_cell"]),
            Paragraph("<b>69.99</b>", styles["table_cell_bold"]),
            Paragraph("[60.9, 79.1]", styles["table_cell"]),
            Paragraph("87.2", styles["table_cell"]),
            Paragraph("6.68", styles["table_cell_bold"]),
            Paragraph("-0.52", styles["table_cell_bold"]),
            Paragraph("+1.13", styles["table_cell_bold"]),
            Paragraph("38.0%", styles["table_cell"]),
            Paragraph("10.9%", styles["table_cell"]),
            Paragraph("16.3", styles["table_cell"]),
        ],
    ]

    col_widths_bowl = [18, 92, 66, 34, 52, 28, 34, 34, 36, 36, 36, 40]
    t_bowl = Table(bowlers_data, colWidths=col_widths_bowl)
    t_bowl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#260C35")),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
    ]))
    story.append(t_bowl)

    story.append(PageBreak())

    # =========================================================================
    # SECTION 6: STRATEGIC BLUEPRINT FOR RAJASTHAN ROYALS (IPL 2027 SQUAD)
    # =========================================================================
    story.append(Paragraph("6. Strategic Blueprint for Rajasthan Royals — IPL 2027 Squad Building", styles["h1"]))
    story.append(Paragraph(
        "Rajasthan Royals' quest for their second IPL title requires moving beyond raw prestige signings to data-driven, situation-specific clutch execution. This section translates our mathematical pressure model directly into actionable recruitment and tactical deployment strategies for the 2027 Mega-Auction and squad construction.",
        styles["body"],
    ))

    story.append(Paragraph("6.1 Rajasthan Royals Tactical Context & Home Conditions (SMS Jaipur)", styles["h2"]))
    story.append(Paragraph(
        "<b>Sawai Mansingh Stadium (Jaipur) Dynamics:</b><br/>"
        "&bull; <b>Ground Dimensions:</b> Large square boundaries (68–72 meters) and expansive straight boundaries (74–76 meters). Jaipur heavily penalizes mistimed blind slogging, rewarding placement, fast running between wickets, and bowlers who hit heavy hard lengths.<br/>"
        "&bull; <b>Pitch Behavior:</b> Dry red/black clay mixture that offers genuine grip and variable bounce for wrist-spinners and cutters. Historically, batting first requires building a defendable 175–185 total, while chasing demands ice-cool middle-overs acceleration without panicking.<br/>"
        "&bull; <b>Existing RR Core Pillars:</b> <b>Sanju Samson</b> (Captain & elite dynamic #3), <b>Yashasvi Jaiswal</b> (Opener & #1 Pressure Batter), <b>Riyan Parag</b> (Middle-overs spin destroyer), <b>Dhruv Jurel</b> (Death finisher & WK option), and <b>Sandeep Sharma</b> (Powerplay/death seam specialist).<br/>"
        "&bull; <b>Tactical Vulnerability Addressed:</b> Historically, RR has conceded high run-rate leaks in overs 16–20 and experienced middle-overs batting stalls when opposing mystery spinners operated in dry conditions. Our model identifies the precise clutch profiles to permanently eliminate these flaws.",
        styles["body"],
    ))

    story.append(Spacer(1, 4))
    story.append(Paragraph("6.2 How EACH Top-Ranked Batter Strengthens Rajasthan Royals for IPL 2027", styles["h2"]))

    batters_tactical = [
        ("1. Yashasvi Jaiswal (RR / India | Score: 84.17)", "Franchise Pillar & Primary Retainer",
         "Already RR's crown jewel. Leads the entire world with +39.41 runs added per 100 balls under pressure and a +23.35 SR surge. At Jaipur, Jaiswal's ability to clear 75m straight boundaries while maintaining a low dot percentage (26.1%) provides RR an unmatched advantage in steep chases."),
        ("2. Prabhsimran Singh (PBKS | Score: 81.40)", "Aggressive Top-Order Disruptor / Backup Opener",
         "Strikes at 178.09 under pressure with 72.2% match consistency. If targeted at auction, Prabhsimran provides an ultra-aggressive powerplay partner or backup to Jaiswal/Samson, preventing RR from entering run-rate stagnation if an early wicket falls."),
        ("3. Abhishek Sharma (SRH / India | Score: 76.44)", "Dynamic Spin-Destroying Opener & 6th Bowler",
         "Generates +49.74 runs added per 100 balls (highest in world cricket). Combining Abhishek with Jaiswal at the top gives RR two left-handed dynamic openers who demolish spin in the powerplay, plus handy left-arm orthodox overs for Jaipur's dry surface."),
        ("4. Naman Dhir (MI / India | Score: 76.11)", "High-Ceiling Middle-Overs Floater & Death Finisher",
         "Boasts an 182.95 strike rate under pressure with a +10.91 SR delta and low dot percentage (24.9%). Slots naturally at #5 or #6 between Parag and Jurel, converting tricky 10 RRR equations into comfortable chases without burning resources."),
        ("5. Quinton de Kock (LSG / SA | Score: 73.97)", "Experienced Overseas Chase Anchor & Tactical Wicketkeeper",
         "Elevates strike rate from 150.87 to 166.81 (+15.94) under high stress. Provides veteran overseas leadership, world-class glovework, and calmness during high-leverage knockout fixtures where young batters often perish."),
        ("6. Suryakumar Yadav (India / MI | Score: 72.79)", "The Gold Standard for 360-Degree Pressure Management",
         "The ultimate benchmark: faced an astounding 777 pressure balls while maintaining a 165.77 SR and +30.46 runs added. His ability to manipulate Jaipur's deep square boundaries with scoops and ramps is the precise prototype RR's middle order must emulate."),
        ("7. Reeza Hendricks (South Africa | Score: 71.69)", "Calculated Target-Master & Crisis Stabilizer",
         "Increases SR under pressure (+10.08) with 66.7% consistency. Ideal overseas anchor signing when conditions turn sticky, preventing middle-order collapses while ticking the scoreboard at 8–9 RPO with low risk."),
        ("8. Heinrich Klaasen (SRH / SA | Score: 70.51)", "Top Overseas Mega-Auction Target: Spin Demolisher",
         "The most destructive spin-hitter in global T20s. Faced 552 pressure balls striking at 167.03 with +29.48 runs added. Klaasen at #4 or #5 at Sawai Mansingh Stadium neutralizes opposition spinners who traditionally stifle RR in overs 7–15."),
        ("9. Ajinkya Rahane (KKR / CSK | Score: 69.06)", "Former RR Captain: Tactical Crisis Counter-Attacker",
         "Demonstrates the highest SR acceleration under pressure in our dataset (+24.15 delta, surging from 139.12 to 163.28). Available at budget auction value, Rahane brings deep intimate knowledge of Jaipur conditions and elite crisis counter-punching."),
        ("10. Mohammad Rizwan (Pakistan | Score: 68.84)", "Innings Consolidation & Target Accumulator Benchmark",
         "Accelerates by +20.35 SR under pressure. Represents the archetype of low-dot-ball (23.0%) strike rotation that RR's top 3 can deploy when defending low totals on slow Jaipur pitches."),
    ]

    for name, role, desc in batters_tactical:
        story.append(Paragraph(f"<b>{name}</b> &nbsp;|&nbsp; <i>{role}</i>", styles["player_card_name"]))
        story.append(Paragraph(desc, styles["player_card_body"]))
        story.append(Spacer(1, 2))

    story.append(PageBreak())

    story.append(Paragraph("6.3 How EACH Top-Ranked Bowler Strengthens Rajasthan Royals for IPL 2027", styles["h2"]))

    bowlers_tactical = [
        ("1. Jamie Overton (ENG / CSK | Score: 85.13)", "Priority #1 Overseas Fast-Bowling All-Rounder",
         "World #1 clutch bowler. In pressure overs, Overton drops his economy by nearly 2 full runs (-1.97 to 6.25), bowls 49.53% dot balls, and takes a wicket every 10.6 balls. His 145+ km/h hit-the-deck pace perfectly exploits Jaipur's 75m straight boundaries, giving RR an unhittable death enforcer."),
        ("2. Sunil Narine (KKR | Score: 83.93)", "Unflappable Mystery Spin Benchmark",
         "The global benchmark for high-stress containment: 114 pressure overs, 5.87 economy, +2.40 runs prevented per 6 balls, and an unbelievable 8.19% boundary concession rate. The tactical prototype for suffocating opposition chases at SMS Jaipur."),
        ("3. Abrar Ahmed (Pakistan | Score: 81.74)", "Mystery Wrist-Spin Middle-Overs Strangler",
         "Suppresses economy by -1.06 down to 5.51 under pressure, allowing boundaries on just 7.86% of deliveries. Ideal overseas wrist-spin profile that grips and rips on abrasive Jaipur surfaces."),
        ("4. Sufiyan Muqeem (Pakistan | Score: 76.68)", "High-Impact Left-Arm Wrist-Spin Enforcer",
         "Delivers an astounding 53.69% dot balls under pressure with an 11.46 wicket strike rate. Left-arm unorthodox angle creates acute visual disruption for right-handed batters aiming for Jaipur's long square boundaries."),
        ("5. Mujeeb Ur Rahman (AFG / MI | Score: 74.94)", "Powerplay & Slog-Overs Mystery Specialist",
         "Economical at 6.08 under pressure (+1.61 runs prevented) with a 12.56 strike rate. Can bowl two overs inside the powerplay and two at the death, giving Samson supreme tactical flexibility."),
        ("6. Kuldeep Yadav (DC / India | Score: 73.08)", "Premier Indian Wrist-Spinner Target",
         "Highest-volume Indian bowler in our study: 921 pressure balls (153.5 overs) with 63 clutch wickets and an economy of 6.94 (-0.90 delta). If available at auction, Kuldeep is RR's dream Indian spinner, partnering with Sandeep Sharma to dismantle opposition middle orders."),
        ("7. Matheesha Pathirana (CSK / SL | Score: 72.69)", "Priority #1 Death-Overs Slog Specialist",
         "Possesses a deadly 13.58 ball wicket strike rate under pressure with sling yorkers. Conceding just 7.24 economy in clutch death overs, Pathirana solves RR's historic death-overs run leakage permanently."),
        ("8. Lockie Ferguson (NZ / GT | Score: 72.45)", "Express 150 km/h Enforcer",
         "Restricts pressure economy to 7.47 (-0.90 delta) while taking wickets every 12.97 balls with 44.68% dot balls. Exploits Jaipur's big square boundaries with heavy bouncers into the ribcage."),
        ("9. Krunal Pandya (LSG / RCB | Score: 72.36)", "Indian Spin-Bowling All-Rounder & Slog Restrictor",
         "Restricts pressure economy to 6.63 (-1.00 delta) with an elite 9.35% boundary rate across 89.2 pressure overs. Solves RR's #7 batting depth while providing 4 reliable overs in dry conditions."),
        ("10. Mitchell Santner (NZ / MI | Score: 69.99)", "Ice-Cool Finger-Spin Defensive Mastermind",
         "Concedes only 6.68 economy under high pressure with 38.05% dots. Never gets flustered, offering supreme control on pitches where seamers are taking a pounding."),
    ]

    for name, role, desc in bowlers_tactical:
        story.append(Paragraph(f"<b>{name}</b> &nbsp;|&nbsp; <i>{role}</i>", styles["player_card_name"]))
        story.append(Paragraph(desc, styles["player_card_body"]))
        story.append(Spacer(1, 2))

    story.append(Spacer(1, 4))
    story.append(Paragraph("6.4 Recommended Rajasthan Royals IPL 2027 Dream Starting XI", styles["h2"]))
    story.append(Paragraph(
        "Synthesizing existing core retainers with data-identified clutch targets yields an invincible tactical XI tailored for Sawai Mansingh Stadium and high-pressure away playoff matches:",
        styles["body"],
    ))

    xi_data = [
        [
            Paragraph("<b>#</b>", styles["table_header"]),
            Paragraph("<b>Player Name</b>", styles["table_header"]),
            Paragraph("<b>Role / Specialization</b>", styles["table_header"]),
            Paragraph("<b>Tactical Role in RR Setup</b>", styles["table_header"]),
            Paragraph("<b>Pressure Metric</b>", styles["table_header"]),
        ],
        [
            Paragraph("1", styles["table_cell_bold"]),
            Paragraph("<b>Yashasvi Jaiswal</b> (LHB)", styles["table_cell_bold"]),
            Paragraph("Retained Opener", styles["table_cell"]),
            Paragraph("Clutch chase accelerator; exploits powerplay and maintains 179+ SR under pressure.", styles["table_cell"]),
            Paragraph("84.17 (#1 Bat)", styles["table_cell_bold"]),
        ],
        [
            Paragraph("2", styles["table_cell_bold"]),
            Paragraph("<b>Prabhsimran / Abhishek</b>", styles["table_cell_bold"]),
            Paragraph("Auction Target Opener", styles["table_cell"]),
            Paragraph("Dynamic boundary enforcer; absorbs early swing pressure to protect middle order.", styles["table_cell"]),
            Paragraph("81.40 / 76.44", styles["table_cell_bold"]),
        ],
        [
            Paragraph("3", styles["table_cell_bold"]),
            Paragraph("<b>Sanju Samson</b> (C/WK)", styles["table_cell_bold"]),
            Paragraph("Retained Captain & Anchor", styles["table_cell"]),
            Paragraph("Tactical fulcrum; controls tempo against pace and spin through overs 7–14.", styles["table_cell"]),
            Paragraph("Franchise Leader", styles["table_cell_bold"]),
        ],
        [
            Paragraph("4", styles["table_cell_bold"]),
            Paragraph("<b>Riyan Parag</b> (RHB/Spin)", styles["table_cell_bold"]),
            Paragraph("Retained Middle Order", styles["table_cell"]),
            Paragraph("Dominant middle-overs spin hitter; targets straight boundaries at Jaipur.", styles["table_cell"]),
            Paragraph("Breakout Core", styles["table_cell_bold"]),
        ],
        [
            Paragraph("5", styles["table_cell_bold"]),
            Paragraph("<b>Heinrich Klaasen</b> (OS)", styles["table_cell_bold"]),
            Paragraph("Marquee Auction Target", styles["table_cell"]),
            Paragraph("The world's premier spin demolisher; obliterates opposition bowling in overs 11–18.", styles["table_cell"]),
            Paragraph("70.51 (#8 Bat)", styles["table_cell_bold"]),
        ],
        [
            Paragraph("6", styles["table_cell_bold"]),
            Paragraph("<b>Dhruv Jurel</b> (RHB/WK)", styles["table_cell_bold"]),
            Paragraph("Retained Finisher", styles["table_cell"]),
            Paragraph("Death-overs finisher; fast hands and elite placement under single-digit ball equations.", styles["table_cell"]),
            Paragraph("Proven Clutch", styles["table_cell_bold"]),
        ],
        [
            Paragraph("7", styles["table_cell_bold"]),
            Paragraph("<b>Jamie Overton</b> (OS/All)", styles["table_cell_bold"]),
            Paragraph("Primary Pace Target", styles["table_cell"]),
            Paragraph("Hard-length 145 km/h seamer & lower-order power hitter; 6.25 death economy.", styles["table_cell"]),
            Paragraph("85.13 (#1 Bowl)", styles["table_cell_bold"]),
        ],
        [
            Paragraph("8", styles["table_cell_bold"]),
            Paragraph("<b>Krunal Pandya</b> (LHB/LAO)", styles["table_cell_bold"]),
            Paragraph("Domestic All-Rounder Target", styles["table_cell"]),
            Paragraph("Defensive containment spin (6.63 econ); adds crucial batting insurance at #8.", styles["table_cell"]),
            Paragraph("72.36 (#9 Bowl)", styles["table_cell_bold"]),
        ],
        [
            Paragraph("9", styles["table_cell_bold"]),
            Paragraph("<b>Kuldeep Yadav</b> (LAC)", styles["table_cell_bold"]),
            Paragraph("Marquee Spin Target", styles["table_cell"]),
            Paragraph("Premier attacking wrist-spinner; runs through opposition middle order on dry surfaces.", styles["table_cell"]),
            Paragraph("73.08 (#6 Bowl)", styles["table_cell_bold"]),
        ],
        [
            Paragraph("10", styles["table_cell_bold"]),
            Paragraph("<b>Sandeep Sharma</b> (RMF)", styles["table_cell_bold"]),
            Paragraph("Retained Specialist", styles["table_cell"]),
            Paragraph("Knuckleballs, wide yorkers, and supreme execution discipline in death overs.", styles["table_cell"]),
            Paragraph("Tactical Veteran", styles["table_cell_bold"]),
        ],
        [
            Paragraph("11", styles["table_cell_bold"]),
            Paragraph("<b>Matheesha Pathirana</b> (OS)", styles["table_cell_bold"]),
            Paragraph("Impact Death Seamer Target", styles["table_cell"]),
            Paragraph("Lethal sling yorkers; 13.58 wicket strike rate in overs 16–20 under high pressure.", styles["table_cell"]),
            Paragraph("72.69 (#7 Bowl)", styles["table_cell_bold"]),
        ],
    ]

    t_xi = Table(xi_data, colWidths=[18, 114, 100, 216, 80])
    t_xi.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#260C35")),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
    ]))
    story.append(t_xi)

    story.append(PageBreak())

    # =========================================================================
    # SECTION 7: VALIDATION, UNCERTAINTY & REPRODUCIBILITY
    # =========================================================================
    story.append(Paragraph("7. Model Validation, Confidence Intervals & Reproducibility", styles["h1"]))

    story.append(Paragraph("7.1 Empirical Case Study Validation: IPL 2023 Final Climax", styles["h2"]))
    story.append(Paragraph(
        "To rigorously validate the pressure engine against historic moments, we reconstructed the climactic final over of the <b>IPL 2023 Final</b> (Gujarat Titans vs Chennai Super Kings, rain-revised target of 171 in 15 overs, Mohit Sharma defending 13 runs off 6 balls):",
        styles["body"],
    ))

    case_study_data = [
        [
            Paragraph("<b>Ball</b>", styles["table_header"]),
            Paragraph("<b>Striker</b>", styles["table_header"]),
            Paragraph("<b>Equation</b>", styles["table_header"]),
            Paragraph("<b>Delivery Execution</b>", styles["table_header"]),
            Paragraph("<b>Runs</b>", styles["table_header"]),
            Paragraph("<b>P_win (CSK)</b>", styles["table_header"]),
            Paragraph("<b>Pressure &Psi;</b>", styles["table_header"]),
        ],
        [
            Paragraph("14.1", styles["table_cell_bold"]),
            Paragraph("Shivam Dube", styles["table_cell"]),
            Paragraph("13 off 6 (RRR 13.0)", styles["table_cell"]),
            Paragraph("Perfect wide yorker outside off", styles["table_cell"]),
            Paragraph("0 (dot)", styles["table_cell"]),
            Paragraph("48.2%", styles["table_cell"]),
            Paragraph("<b>88.4</b> (Extreme)", styles["table_cell_bold"]),
        ],
        [
            Paragraph("14.2", styles["table_cell_bold"]),
            Paragraph("Shivam Dube", styles["table_cell"]),
            Paragraph("13 off 5 (RRR 15.6)", styles["table_cell"]),
            Paragraph("Pinpoint yorker on leg stump", styles["table_cell"]),
            Paragraph("1 run", styles["table_cell"]),
            Paragraph("39.1%", styles["table_cell"]),
            Paragraph("<b>91.2</b> (Extreme)", styles["table_cell_bold"]),
        ],
        [
            Paragraph("14.3", styles["table_cell_bold"]),
            Paragraph("Ravindra Jadeja", styles["table_cell"]),
            Paragraph("12 off 4 (RRR 18.0)", styles["table_cell"]),
            Paragraph("Very full delivery on off stump", styles["table_cell"]),
            Paragraph("1 run", styles["table_cell"]),
            Paragraph("29.4%", styles["table_cell"]),
            Paragraph("<b>93.8</b> (Extreme)", styles["table_cell_bold"]),
        ],
        [
            Paragraph("14.4", styles["table_cell_bold"]),
            Paragraph("Shivam Dube", styles["table_cell"]),
            Paragraph("11 off 3 (RRR 22.0)", styles["table_cell"]),
            Paragraph("Low full toss drilled down to long-on", styles["table_cell"]),
            Paragraph("1 run", styles["table_cell"]),
            Paragraph("21.8%", styles["table_cell"]),
            Paragraph("<b>96.2</b> (Peak)", styles["table_cell_bold"]),
        ],
        [
            Paragraph("14.5", styles["table_cell_bold"]),
            Paragraph("Ravindra Jadeja", styles["table_cell"]),
            Paragraph("10 off 2 (RRR 30.0)", styles["table_cell"]),
            Paragraph("Missed yorker, driven straight down the ground for SIX", styles["table_cell"]),
            Paragraph("6 runs", styles["table_cell_bold"]),
            Paragraph("52.6%", styles["table_cell"]),
            Paragraph("<b>98.6</b> (Maximum)", styles["table_cell_bold"]),
        ],
        [
            Paragraph("14.6", styles["table_cell_bold"]),
            Paragraph("Ravindra Jadeja", styles["table_cell"]),
            Paragraph("4 off 1 (RRR 24.0)", styles["table_cell"]),
            Paragraph("Full toss on pads, clipped fine of short fine leg for FOUR", styles["table_cell"]),
            Paragraph("4 runs (CSK win)", styles["table_cell_bold"]),
            Paragraph("100.0%", styles["table_cell"]),
            Paragraph("<b>99.1</b> (Climax)", styles["table_cell_bold"]),
        ],
    ]
    t_case = Table(case_study_data, colWidths=[24, 72, 88, 168, 54, 60, 62])
    t_case.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#260C35")),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
    ]))
    story.append(t_case)

    story.append(Spacer(1, 4))
    story.append(Paragraph("7.2 Confidence Intervals & Ranking Uncertainty Analysis", styles["h2"]))
    story.append(Paragraph(
        "<b>Scientific Integrity in Sports Analytics:</b> Clutch situations represent small subsets of playing careers (~35% of balls). Bootstrap 95% confidence intervals exhibit notable overlap between adjacent ranks (e.g., Jaiswal [71.7, 96.7] vs Prabhsimran [68.3, 94.5]). In sports decision-making, point estimates provide the highest-probability ranking, but these lists must realistically be viewed as <b>elite performance tiers</b>. Sample volume directly governs precision: high-volume performers like Suryakumar Yadav (777 balls, CI width &plusmn;7.46) and Kuldeep Yadav (921 balls, CI width &plusmn;6.85) demonstrate rock-solid stability, whereas specialists with ~200 balls have wider intervals.",
        styles["body"],
    ))

    story.append(Spacer(1, 4))
    story.append(Paragraph("7.3 100% Deterministic Reproducibility Instructions", styles["h2"]))
    story.append(Paragraph(
        "Every analytical calculation, model score, and web artifact in this project can be verified and reproduced with zero manual intervention:",
        styles["body"],
    ))
    story.append(Paragraph(
        "<code>git clone https://github.com/Pranavgaikwad007/superrr-selector.git</code><br/>"
        "<code>cd superrr-selector && pip install -r requirements.txt</code><br/>"
        "<code>python -m pytest tests/ &nbsp;&nbsp;# Runs all 39 validation tests (100% pass)</code><br/>"
        "<code>python -m src.pipeline &nbsp;&nbsp;# Deterministically executes full analytical engine</code><br/>"
        "<code>cd frontend && npm install && npm run build &nbsp;&nbsp;# Compiles production React website</code>",
        styles["formula"],
    ))

    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=1.0, color=colors.HexColor("#CBD5E1"), spaceBefore=4, spaceAfter=8))
    story.append(Paragraph(
        "<b>Submission Links Summary:</b><br/>"
        "&bull; <b>Production Website:</b> <font color='#E5008A'><u><a href='https://superrr-selector.vercel.app'>https://superrr-selector.vercel.app</a></u></font><br/>"
        "&bull; <b>GitHub Repository:</b> <font color='#260C35'><u><a href='https://github.com/Pranavgaikwad007/superrr-selector'>https://github.com/Pranavgaikwad007/superrr-selector</a></u></font><br/>"
        "&bull; <b>Author:</b> Pranav Gaikwad (<code>Pranavgaikwad007</code>) | Rajasthan Royals & Unstop SupeRR Selector Season 2",
        styles["meta"],
    ))

    # Build the document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF: {target_pdf_path}")


def main():
    pdf1 = os.path.join("reports", "final_methodology_report.pdf")
    pdf2 = os.path.join("reports", "SupeRR_Selector_Methodology_and_RR_IPL2027_Strategy.pdf")
    build_pdf_report(pdf1)
    build_pdf_report(pdf2)
    print("PDF Generation complete!")


if __name__ == "__main__":
    main()
