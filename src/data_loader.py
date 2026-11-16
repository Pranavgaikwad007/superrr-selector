"""Data loader module for SupeRR Selector Season 2.

Handles automatic archive discovery, safe extraction of raw datasets,
and schema-aware ingestion of all CSV data tables.
"""

from pathlib import Path
from typing import Any, Dict, Optional, Union
import zipfile
import pandas as pd


def find_dataset_zip(search_dir: Union[str, Path] = ".") -> Optional[Path]:
    """Locate the dataset ZIP archive automatically in the workspace.

    Args:
        search_dir: Directory to search in.

    Returns:
        Path to the zip file, or None if not found.
    """
    search_path = Path(search_dir)
    # Search for known patterns or any zip containing data pack
    for zip_candidate in search_path.glob("*.zip"):
        if "data_pack" in zip_candidate.name.lower() or "superr" in zip_candidate.name.lower():
            return zip_candidate
    # Fallback to any .zip file
    zips = list(search_path.glob("*.zip"))
    return zips[0] if zips else None


def extract_raw_dataset(
    zip_path: Union[str, Path],
    target_dir: Union[str, Path] = "data/raw",
    force: bool = False,
) -> Dict[str, Path]:
    """Extract only valid CSV datasets from zip, ignoring macOS artifacts and PDFs.

    Args:
        zip_path: Path to dataset zip archive.
        target_dir: Target directory for raw files.
        force: If True, overwrite existing files.

    Returns:
        Dictionary of extracted file names to their extracted paths.
    """
    zip_file = Path(zip_path)
    dest_dir = Path(target_dir)
    dest_dir.mkdir(parents=True, exist_ok=True)

    extracted_files: Dict[str, Path] = {}

    with zipfile.ZipFile(zip_file, "r") as z:
        for member in z.infolist():
            if member.is_dir():
                continue
            filename = Path(member.filename).name
            # Skip hidden files, system files, OS artifacts, and PDFs
            if (
                not filename
                or filename.startswith(".")
                or "__MACOSX" in member.filename
                or not filename.lower().endswith(".csv")
            ):
                continue

            target_path = dest_dir / filename
            if not target_path.exists() or force:
                with z.open(member) as src, open(target_path, "wb") as dst:
                    dst.write(src.read())

            extracted_files[filename] = target_path

    return extracted_files


def categorize_competition(comp_name: str, match_format: str) -> str:
    """Categorize competition into IPL, T20I, or Other_T20.

    Args:
        comp_name: Competition name string.
        match_format: Match format string (T20, T20I, etc.).

    Returns:
        'IPL', 'T20I', or 'Other_T20'.
    """
    comp_upper = str(comp_name).upper()
    if "IPL" in comp_upper or "INDIAN PREMIER LEAGUE" in comp_upper:
        return "IPL"
    elif str(match_format).strip().upper() == "T20I":
        return "T20I"
    else:
        return "Other_T20"


def load_competitions(data_dir: Union[str, Path] = "data/raw") -> pd.DataFrame:
    """Load and prepare competitions dataset."""
    path = Path(data_dir) / "competitions.csv"
    if not path.exists():
        raise FileNotFoundError(f"competitions.csv not found at {path}")

    df = pd.read_csv(path, encoding="utf-8-sig")
    for col in ["comp_name", "match_format", "season"]:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip()

    df["competition_category"] = [
        categorize_competition(name, fmt)
        for name, fmt in zip(df["comp_name"], df["match_format"])
    ]
    df["is_eligible_competition"] = df["competition_category"].isin(["IPL", "T20I"])
    return df


def load_teams(data_dir: Union[str, Path] = "data/raw") -> pd.DataFrame:
    """Load and prepare teams dataset."""
    path = Path(data_dir) / "teams.csv"
    if not path.exists():
        raise FileNotFoundError(f"teams.csv not found at {path}")

    df = pd.read_csv(path, encoding="utf-8-sig")
    if "team_name" in df.columns:
        df["team_name"] = df["team_name"].astype(str).str.strip()
    return df


def load_matches(data_dir: Union[str, Path] = "data/raw") -> pd.DataFrame:
    """Load and prepare matches dataset."""
    path = Path(data_dir) / "matches.csv"
    if not path.exists():
        raise FileNotFoundError(f"matches.csv not found at {path}")

    df = pd.read_csv(path, encoding="utf-8-sig")
    if "match_date" in df.columns:
        df["match_date"] = pd.to_datetime(df["match_date"], errors="coerce")

    str_cols = ["home_team", "away_team", "toss_opted", "result", "stage", "venue_country"]
    for col in str_cols:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip().replace("nan", pd.NA)

    return df


def load_ball_by_ball(data_dir: Union[str, Path] = "data/raw") -> pd.DataFrame:
    """Load and prepare ball-by-ball dataset."""
    path = Path(data_dir) / "ball_by_ball.csv"
    if not path.exists():
        raise FileNotFoundError(f"ball_by_ball.csv not found at {path}")

    df = pd.read_csv(path, encoding="utf-8-sig")

    # Clean text columns
    str_cols = [
        "striker_name",
        "non_striker_name",
        "bowler_name",
        "batting_type",
        "bowling_type",
        "dismissal_type",
        "extras_type",
        "pace_or_spin",
        "stroke",
        "delivery_style",
        "over_or_around",
        "on_or_off",
    ]
    for col in str_cols:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip().replace("nan", pd.NA)

    # Fill numerical nulls in scoring columns
    for num_col in ["runs", "extras1_runs", "extras_2_runs"]:
        if num_col in df.columns:
            df[num_col] = pd.to_numeric(df[num_col], errors="coerce").fillna(0).astype(int)

    if "is_wicket" in df.columns:
        df["is_wicket"] = df["is_wicket"].astype(bool)
    if "is_four" in df.columns:
        df["is_four"] = df["is_four"].astype(bool)
    if "is_six" in df.columns:
        df["is_six"] = df["is_six"].astype(bool)

    return df


def load_player_mapping(data_dir: Union[str, Path] = "data/raw") -> pd.DataFrame:
    """Load and prepare competition-team-player mapping dataset."""
    path = Path(data_dir) / "competition_team_player_mapping.csv"
    if not path.exists():
        raise FileNotFoundError(f"competition_team_player_mapping.csv not found at {path}")

    df = pd.read_csv(path, encoding="utf-8-sig")
    for col in ["comp_name", "team_name", "player_name"]:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip()
    return df


def load_playing_eleven(data_dir: Union[str, Path] = "data/raw") -> pd.DataFrame:
    """Load and prepare playing eleven dataset."""
    path = Path(data_dir) / "playing_eleven.csv"
    if not path.exists():
        raise FileNotFoundError(f"playing_eleven.csv not found at {path}")

    df = pd.read_csv(path, encoding="utf-8-sig")
    return df


def load_all_datasets(data_dir: Union[str, Path] = "data/raw") -> Dict[str, pd.DataFrame]:
    """Load all raw datasets into a dictionary.

    Args:
        data_dir: Path to directory containing raw CSV files.

    Returns:
        Dictionary of DataFrame objects.
    """
    return {
        "competitions": load_competitions(data_dir),
        "teams": load_teams(data_dir),
        "matches": load_matches(data_dir),
        "ball_by_ball": load_ball_by_ball(data_dir),
        "competition_team_player_mapping": load_player_mapping(data_dir),
        "playing_eleven": load_playing_eleven(data_dir),
    }
