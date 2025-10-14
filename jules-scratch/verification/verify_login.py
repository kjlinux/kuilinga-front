from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Listen for console events and print them
    page.on("console", lambda msg: print(f"CONSOLE LOG: {msg.text}"))

    page.goto("http://localhost:3001/login", wait_until="networkidle")

    # Give the page a moment longer to settle if needed, just in case.
    page.wait_for_timeout(1000)

    page.screenshot(path="jules-scratch/verification/login_page_debug.png")

    # The rest of the script will likely fail, but we'll get console output.
    try:
        page.locator("#email").fill("test@example.com")
        page.locator("#password").fill("password")
        page.get_by_role("button", name="Se connecter").click()
        expect(page).to_have_url("http://localhost:3001/dashboard")
        page.screenshot(path="jules-scratch/verification/dashboard.png")
    except Exception as e:
        print(f"Script failed as expected: {e}")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
