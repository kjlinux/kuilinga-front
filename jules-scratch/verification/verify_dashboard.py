from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the login page and log in
        page.goto("http://localhost:3000/login")
        page.get_by_label("Email").fill("admin@kuilinga.com")
        page.get_by_label("Mot de passe").fill("adminpassword")
        page.get_by_role("button", name="Se connecter").click()

        # Check for error message if navigation fails
        try:
            expect(page).to_have_url("http://localhost:3000/dashboard", timeout=5000)
        except Exception:
            error_message = page.locator("p.text-red-600").text_content()
            print(f"Login failed. Error message: {error_message}")
            browser.close()
            exit(1)

        # Take a screenshot of the entire page
        page.screenshot(path="jules-scratch/verification/dashboard.png", full_page=True)

        browser.close()

if __name__ == "__main__":
    run()