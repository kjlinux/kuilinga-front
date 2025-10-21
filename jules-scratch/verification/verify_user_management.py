from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:3000/login")
    page.screenshot(path="jules-scratch/verification/login-page.png")
    page.wait_for_selector('input[name="email"]')
    page.get_by_label("Email").fill("test@test.com")
    page.get_by_label("Mot de passe").fill("password")
    page.get_by_role("button", name="Se connecter").click()
    page.wait_for_url("http://localhost:3000/dashboard")
    page.goto("http://localhost:3000/users")
    page.wait_for_selector("text=Users")
    page.screenshot(path="jules-scratch/verification/users-page.png")
    page.goto("http://localhost:3000/roles")
    page.wait_for_selector("text=Roles")
    page.screenshot(path="jules-scratch/verification/roles-page.png")
    page.goto("http://localhost:3000/permissions")
    page.wait_for_selector("text=Permissions")
    page.screenshot(path="jules-scratch/verification/permissions-page.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
