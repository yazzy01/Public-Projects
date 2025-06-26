# LinkedIn Job Applicant Scraper

This tool helps you extract applicant data from your LinkedIn job posts, including:
- Applicant names
- LinkedIn profile URLs
- Job titles/positions
- Locations
- Application timestamps

## Requirements

- Python 3.7+
- Chrome browser installed
- Internet connection

## Setup Instructions

1. Install Python if you don't have it already: [Python Download](https://www.python.org/downloads/)

2. Install required packages:
   ```
   pip install -r requirements.txt
   ```

## How to Use

1. Run the script:
   ```
   python scraper.py
   ```

2. The script will open Chrome and load LinkedIn's login page
   - Log in manually with your LinkedIn credentials
   - Navigate to your job post page showing the list of applicants
   - Press Enter in the terminal when you're on the applicant list page

3. The script will:
   - Ask for a URL (optional, if you're already on the page)
   - Ask how many scrolls to perform (to load more applicants)
   - Begin extracting applicant data while scrolling
   - Save the data to a CSV file

4. Open the resulting CSV file in Excel or another spreadsheet application

## Privacy Notes

- This tool is for personal use only
- Respect LinkedIn's terms of service and privacy policies
- Do not use extracted data in ways that violate privacy laws
