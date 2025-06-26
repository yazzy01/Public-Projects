/**
 * LinkedIn Applicant Data Scraper (Browser Console Script) - ENHANCED VERSION
 * 
 * HOW TO USE:
 * 1. Go to your LinkedIn job posting with applicants list
 * 2. Open browser console (F12 or Right-click > Inspect > Console)
 * 3. Copy and paste this entire script into the console
 * 4. Press Enter to run the script
 * 5. The script will extract applicant data
 * 6. When finished, it will prompt you to download a CSV file
 */

// Main scraper function
async function scrapeLinkedInApplicants() {
    // Helper to wait for a specified amount of time
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    // Function to convert object array to CSV
    function convertToCSV(objArray) {
        if (!objArray || objArray.length === 0) {
            console.error("No data to convert to CSV");
            return "";
        }
        
        const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
        
        // Define header fields and order - only keep what's really needed
        const headers = ["name", "title", "location", "email", "phone", "cv_link"];
        
        // Create CSV header row
        let str = headers.map(header => `"${header}"`).join(",") + "\r\n";

        // Add data rows in the same order as headers
        for (const item of array) {
            str += headers.map(header => {
                // Get the value or empty string if null/undefined
                let value = item[header] || "";
                
                // Clean specific fields
                if (header === "email") {
                    // Extract just the email address using regex
                    const emailMatch = value.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
                    value = emailMatch ? emailMatch[0] : "";
                } 
                else if (header === "phone") {
                    // Extract just the phone number
                    const phoneMatch = value.match(/(?:\+|00)[0-9\s\(\)\-]{7,}|[0-9\s\(\)\-]{7,}/);
                    value = phoneMatch ? phoneMatch[0].replace(/\s+/g, '') : "";
                }
                else if (header === "cv_link") {
                    // Make sure it's a valid URL
                    if (!value.startsWith('http')) {
                        value = "";
                    }
                }
                else if (header === "title" || header === "location") {
                    // Clean up title and location
                    value = value.replace(/\s+/g, ' ').trim();
                }
                
                return `"${value}"`;
            }).join(",") + "\r\n";
        }
        
        return str;
    }

    // Function to download data as CSV
    function downloadCSV(data, filename = 'linkedin_applicants.csv') {
        if (!data) {
            console.error("No data to download");
            return;
        }
        
        const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    console.log('LinkedIn Applicant Scraper (ENHANCED VERSION) starting...');
    console.log('This script is specifically designed for your LinkedIn applicants page.');
    
    // Store all applicants
    const allApplicants = [];
    
    // Extract from current page
    await extractCurrentPage();
    
    // Check and navigate to next page if available
    await navigateAndExtractNextPage();
    
    // Proceed with finishing and downloading CSV
    finishExtraction(allApplicants);
    
    // Function to extract data from the current page
    async function extractCurrentPage() {
        console.log('Extracting data from current page...');
        
        // First, get info from currently selected profile if any
        const currentInfo = extractInfoFromRightPanel();
        
        // Get all applicant cards from the left column
        const applicantCards = document.querySelectorAll('.artdeco-list__item, [class*="applicant"], [class*="entity-result"]');
        
        if (applicantCards.length === 0) {
            console.log('No applicant cards found on current page. Looking for alternative elements...');
            
            // Try to find any links that might be applicant profiles
            const profileLinks = Array.from(document.querySelectorAll('a[href*="/in/"]'))
                .filter(link => {
                    const hasText = link.textContent.trim().length > 0;
                    const notInNav = !link.closest('nav, header, footer, [class*="nav"], [class*="menu"]');
                    return hasText && notInNav;
                });
            
            for (const link of profileLinks) {
                try {
                    const name = cleanText(link.textContent);
                    const profileUrl = link.href.split('?')[0];
                    
                    // Add to collection
                    allApplicants.push(createApplicantObject(name, "", "", "", "", "", profileUrl));
                } catch (error) {
                    console.error('Error processing a profile link:', error);
                }
            }
        } else {
            console.log(`Found ${applicantCards.length} applicant cards on current page.`);
            
            // Process each applicant card
            for (const card of applicantCards) {
                try {
                    // Extract name and profile URL
                    const nameElement = card.querySelector('a[href*="/in/"]') || card.querySelector('a');
                    if (!nameElement) continue;
                    
                    const name = cleanText(nameElement.textContent);
                    const profileUrl = nameElement.href ? nameElement.href.split('?')[0] : "";
                    
                    // Extract title and location
                    let title = "";
                    let location = "";
                    
                    const titleElement = card.querySelector('.entity-result__primary-subtitle, .job-title, .t-14');
                    if (titleElement) {
                        title = cleanText(titleElement.textContent);
                    }
                    
                    const locationElement = card.querySelector('.entity-result__secondary-subtitle, .location, .t-12');
                    if (locationElement) {
                        location = cleanText(locationElement.textContent);
                    }
                    
                    // Check if this card is the selected one
                    const isSelected = card.classList.contains('selected') || 
                                     card.classList.contains('active') || 
                                     card.getAttribute('aria-selected') === 'true' ||
                                     card.classList.contains('jobs-applicants-list__card--is-selected');
                    
                    // Extract email, phone, CV link if this is the selected card
                    let email = "";
                    let phone = "";
                    let cvLink = "";
                    
                    if (isSelected) {
                        email = currentInfo.email;
                        phone = currentInfo.phone;
                        cvLink = currentInfo.cv_link;
                    }
                    
                    // Add to collection
                    allApplicants.push(createApplicantObject(name, title, location, email, phone, cvLink, profileUrl));
                } catch (error) {
                    console.error('Error processing an applicant card:', error);
                }
            }
        }
    }
    
    // Function to navigate to next page and extract data
    async function navigateAndExtractNextPage() {
        // Look for pagination controls
        const nextPageButton = document.querySelector(
            '.artdeco-pagination__button--next:not(.artdeco-button--disabled), ' +
            'button[aria-label="Next page"], ' +
            'button.next, ' +
            'a.next'
        );
        
        if (nextPageButton && !nextPageButton.disabled) {
            console.log('Found next page button, attempting to navigate...');
            
            // Click the next page button
            nextPageButton.click();
            
            // Wait for new page to load
            console.log('Waiting for next page to load...');
            await sleep(3000);
            
            // Extract data from the new page
            await extractCurrentPage();
            
            // Recursively check for more pages
            await navigateAndExtractNextPage();
        } else {
            console.log('No more pages or next page button not found.');
        }
    }
    
    // Function to clean text data
    function cleanText(text) {
        if (!text) return "";
        return text.replace(/\s+/g, ' ').trim();
    }
    
    // Function to create a standardized applicant object
    function createApplicantObject(name, title, location, email, phone, cvLink, profileUrl) {
        return {
            name: name || "",
            title: title || "",
            location: location || "",
            email: email || "",
            phone: phone || "",
            cv_link: cvLink || "",
            profile_url: profileUrl || ""
        };
    }
    
    // Function to extract email, phone, and CV link from the right panel
    function extractInfoFromRightPanel() {
        const info = {
            email: "",
            phone: "",
            cv_link: ""
        };
        
        try {
            // EXTRACT EMAIL
            // First, look for a dedicated email section/field
            const emailElements = [
                document.querySelector('.pv-contact-info__contact-type a[href^="mailto:"]'),
                document.querySelector('a[href^="mailto:"]'),
                document.querySelector('.pv-contact-info__ci-container .pv-contact-info__ci-container a')
            ].filter(Boolean);
            
            for (const element of emailElements) {
                if (element) {
                    info.email = element.textContent.trim() || element.href.replace('mailto:', '');
                    if (info.email) break;
                }
            }
            
            // If no email found, try more aggressive search
            if (!info.email) {
                // Look for any element with email-like content
                const allElements = document.querySelectorAll('*');
                for (const el of allElements) {
                    if (el.textContent && el.textContent.includes('@') && 
                        !el.closest('nav, header, footer') && 
                        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(el.textContent)) {
                        
                        const emailMatch = el.textContent.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
                        if (emailMatch) {
                            info.email = emailMatch[0];
                            break;
                        }
                    }
                }
            }
            
            // EXTRACT PHONE NUMBER
            // First, look for a dedicated phone section/field
            const phoneElements = [
                document.querySelector('.pv-contact-info__contact-type span.t-14'),
                document.querySelector('[aria-label="Phone number"]'),
                document.querySelector('.pv-contact-info__ci-container .pv-contact-info__ci-container span')
            ].filter(Boolean);
            
            for (const element of phoneElements) {
                if (element) {
                    const phone = element.textContent.trim();
                    if (phone && /\+?[\d\s\(\)\-]{7,}/.test(phone)) {
                        info.phone = phone;
                        break;
                    }
                }
            }
            
            // If no phone found, try more aggressive search
            if (!info.phone) {
                // Look for any element with phone-like content
                const allElements = document.querySelectorAll('*');
                for (const el of allElements) {
                    const text = el.textContent;
                    if (text && !el.closest('nav, header, footer') && 
                        /\+?[\d\s\(\)\-]{7,}/.test(text)) {
                        
                        const phoneMatch = text.match(/\+?[\d\s\(\)\-]{7,}/);
                        if (phoneMatch) {
                            info.phone = phoneMatch[0];
                            break;
                        }
                    }
                }
            }
            
            // EXTRACT CV LINK
            // Look for download buttons
            const downloadButtons = [
                document.querySelector('a.download-button, a[download]'),
                document.querySelector('a.ember-view[href*="download"]'),
                document.querySelector('a[href*="resume"], a[href*="cv"]'),
                document.querySelector('a:has(> span:contains("Download"))'),
                ...Array.from(document.querySelectorAll('a')).filter(a => 
                    a.textContent && 
                    a.textContent.toLowerCase().includes('download') && 
                    a.href)
            ].filter(Boolean);
            
            for (const button of downloadButtons) {
                if (button && button.href) {
                    info.cv_link = button.href;
                    break;
                }
            }
            
        } catch (error) {
            console.error('Error extracting contact info:', error);
        }
        
        return info;
    }
    
    // Function to finish extraction and download CSV
    function finishExtraction(applicants) {
        console.log(`Extraction complete! Found ${applicants.length} applicants.`);
        
        if (applicants.length > 0) {
            // Remove duplicates based on profile URL
            const uniqueApplicants = [];
            const seenUrls = new Set();
            
            for (const applicant of applicants) {
                if (applicant.profile_url && !seenUrls.has(applicant.profile_url)) {
                    seenUrls.add(applicant.profile_url);
                    uniqueApplicants.push(applicant);
                } else if (!applicant.profile_url) {
                    // Keep applicants without profile URLs (shouldn't happen but just in case)
                    uniqueApplicants.push(applicant);
                }
            }
            
            console.log(`After removing duplicates: ${uniqueApplicants.length} unique applicants.`);
            
            // Generate and download CSV
            const csv = convertToCSV(uniqueApplicants);
            downloadCSV(csv);
            
            console.log('CSV file has been created and download started.');
            console.log('CSV contains ONLY the clean data you requested:');
            console.log('- Names and job titles');
            console.log('- Clean email addresses only (no extra text)');
            console.log('- Clean phone numbers only (no labels)');
            console.log('- CV download links when available');
            
            console.log('IMPORTANT: For complete data collection:');
            console.log('1. Use this script on BOTH pages of applicants');
            console.log('2. Click each applicant one by one and run the script again to get their contact info');
            
            return uniqueApplicants;
        } else {
            console.log('No applicant data found.');
            
            alert('No applicant data found. Please make sure you are on the correct LinkedIn page with applicants visible.');
            
            return [];
        }
    }
}

// Run the scraper
console.log('Starting LinkedIn applicant data extraction...');
scrapeLinkedInApplicants().then(() => {
    console.log('Scraper execution complete.');
}).catch(err => {
    console.error('Scraper failed:', err);
});
