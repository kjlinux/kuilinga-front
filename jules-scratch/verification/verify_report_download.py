from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Login
        page.goto("http://localhost:3000/login")
        email_input = page.get_by_label("Email")
        expect(email_input).to_be_enabled()
        email_input.fill("test@example.com")
        page.get_by_label("Password").fill("password")
        page.get_by_role("button", name="Login").click()

        # Navigate to reports
        page.wait_for_url("http://localhost:3000/")
        page.get_by_role("link", name="Reports").click()
        page.wait_for_url("http://localhost:3000/reports")

        # Select a report
        page.get_by_role("button", name="Select a report").click()
        page.get_by_role("option", name="Organization Presence Report").click()

        # Check for download button
        download_button = page.get_by_role("button", name="Download")
        expect(download_button).to_be_visible()

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/verification.png")

    finally:
        context.close()
        browser.close()

with sync_playwright() as playwright:
    run(playwright)