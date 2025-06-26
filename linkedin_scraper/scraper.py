"""
LinkedIn Job Applicant Data Scraper
-----------------------------------
This script automates extracting applicant data from a LinkedIn job post.
It will collect names, LinkedIn profile URLs, and any visible contact information.
"""

import time
import pandas as pd
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

class LinkedInScraper:
    def __init__(self):
        self.setup_driver()
        self.applicants_data = []
        
    def setup_driver(self):
        """Configure and initialize the Chrome WebDriver"""
        options = Options()
        options.add_argument("--start-maximized")
        # Uncomment the line below if you want to run in headless mode (no browser UI)
        # options.add_argument("--headless")
        
        self.driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()),
            options=options
        )
        
    def login_to_linkedin(self):
        """Open LinkedIn and wait for manual login"""
        self.driver.get("https://www.linkedin.com/login")
        print("Please log in to LinkedIn manually in the browser window.")
        print("After logging in, navigate to your job post with applicants.")
        print("Once you're on the page with the list of applicants, press Enter in this console.")
        input("Press Enter when ready...")
    
    def navigate_to_job_post(self, job_url=None):
        """Navigate to the job post page or wait for manual navigation"""
        if job_url:
            self.driver.get(job_url)
            time.sleep(3)
        
        # Wait for applicant list to appear
        try:
            WebDriverWait(self.driver, 20).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "ul.artdeco-list"))
            )
            print("Successfully found applicant list!")
        except Exception as e:
            print(f"Error finding applicant list: {e}")
            print("Please make sure you're on the job applicants page.")
            return False
        return True
    
    def extract_applicant_data(self):
        """Extract data for all visible applicants"""
        # Find all applicant list items
        applicant_items = self.driver.find_elements(By.CSS_SELECTOR, 
                                                  "ul.artdeco-list li.artdeco-list__item")
        
        print(f"Found {len(applicant_items)} applicants on current page.")
        
        for item in applicant_items:
            try:
                applicant_data = {}
                
                # Extract name
                name_element = item.find_element(By.CSS_SELECTOR, "a.app-aware-link")
                applicant_data['name'] = name_element.text.strip()
                
                # Extract profile URL
                profile_url = name_element.get_attribute('href')
                applicant_data['profile_url'] = profile_url.split('?')[0] if profile_url else ""
                
                # Extract title/headline if available
                try:
                    title_element = item.find_element(By.CSS_SELECTOR, "div.t-14.t-black--light.t-normal")
                    applicant_data['title'] = title_element.text.strip()
                except:
                    applicant_data['title'] = ""
                
                # Extract location if available
                try:
                    location_element = item.find_element(By.CSS_SELECTOR, "div.t-12.t-black--light.t-normal")
                    applicant_data['location'] = location_element.text.strip()
                except:
                    applicant_data['location'] = ""
                
                # Extract application time if available
                try:
                    time_element = item.find_element(By.CSS_SELECTOR, "div.entity-result__simple-insight-text")
                    applicant_data['application_time'] = time_element.text.strip()
                except:
                    applicant_data['application_time'] = ""
                
                self.applicants_data.append(applicant_data)
                print(f"Extracted data for: {applicant_data['name']}")
                
            except Exception as e:
                print(f"Error extracting applicant data: {e}")
    
    def scroll_through_applicants(self, max_scrolls=50):
        """Scroll through the applicant list to load more applicants"""
        scroll_count = 0
        last_height = self.driver.execute_script("return document.body.scrollHeight")
        
        while scroll_count < max_scrolls:
            # Scroll down
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)  # Wait for page to load
            
            # Extract applicants that are now visible
            self.extract_applicant_data()
            
            # Calculate new scroll height and compare with last scroll height
            new_height = self.driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                # If heights are the same, we've probably reached the end
                print("Reached the end of the page or no more applicants to load.")
                break
                
            last_height = new_height
            scroll_count += 1
            print(f"Scrolled {scroll_count} times. Found {len(self.applicants_data)} applicants so far.")
    
    def save_to_csv(self, filename="linkedin_applicants.csv"):
        """Save the extracted data to a CSV file"""
        # Convert to DataFrame and remove duplicates
        df = pd.DataFrame(self.applicants_data)
        df = df.drop_duplicates(subset=['profile_url'])
        
        # Save to CSV
        df.to_csv(filename, index=False)
        print(f"Saved {len(df)} applicants to {filename}")
        return filename
    
    def close(self):
        """Close the browser"""
        self.driver.quit()
        
def main():
    scraper = LinkedInScraper()
    
    # Login process
    scraper.login_to_linkedin()
    
    # Allow user to navigate to the job post or provide URL
    job_url = input("Enter the job post URL (or leave empty if you've navigated manually): ").strip()
    
    if job_url:
        success = scraper.navigate_to_job_post(job_url)
    else:
        success = scraper.navigate_to_job_post()
    
    if not success:
        print("Failed to find applicant list. Exiting.")
        scraper.close()
        return
    
    # Ask how many scrolls to perform
    try:
        max_scrolls = int(input("Enter maximum number of scrolls to perform (default: 50): ") or "50")
    except:
        max_scrolls = 50
    
    # Extract data by scrolling through applicants
    print(f"Starting to extract data with maximum {max_scrolls} scrolls...")
    scraper.scroll_through_applicants(max_scrolls)
    
    # Save data
    filename = input("Enter filename to save data (default: linkedin_applicants.csv): ").strip() or "linkedin_applicants.csv"
    saved_file = scraper.save_to_csv(filename)
    
    print(f"Data has been successfully saved to {saved_file}")
    print("You can now open this file in Excel or other spreadsheet software.")
    
    # Close browser
    scraper.close()

if __name__ == "__main__":
    main()
