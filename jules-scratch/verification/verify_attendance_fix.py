from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    try:
        context = browser.new_context()
        page = context.new_page()

        # Log in to the application
        page.goto("http://localhost:3000/login")
        page.get_by_label("Email").fill("test@example.com")
        page.get_by_label("Mot de passe").fill("password")
        page.get_by_role("button", name="Se connecter").click()

        # Navigate to the attendance page
        page.goto("http://localhost:3000/attendance")

        # Wait for the table to be visible
        expect(page.get_by_role("table")).to_be_visible()

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/verification.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)