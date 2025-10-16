from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Login
    page.goto("http://localhost:3000/login")
    page.wait_for_load_state("networkidle")
    page.screenshot(path="jules-scratch/verification/login_page.png")
    page.get_by_placeholder("exemple@gmail.com").fill("admin@example.com")
    page.get_by_placeholder("Mot de passe").fill("adminpassword")
    page.get_by_role("button", name="Se connecter").click()
    page.wait_for_url("http://localhost:3000/")

    # Navigate to Organizations page and take screenshot
    page.goto("http://localhost:3000/organizations")
    page.wait_for_selector("text=Gestion des organisations")
    page.screenshot(path="jules-scratch/verification/organizations.png")

    # Navigate to Employees page and take screenshot
    page.goto("http://localhost:3000/employees")
    page.wait_for_selector("text=Gestion des employés")
    page.screenshot(path="jules-scratch/verification/employees.png")

    # Navigate to Sites page and take screenshot
    page.goto("http://localhost:3000/sites")
    page.wait_for_selector("text=Gestion des sites")
    page.screenshot(path="jules-scratch/verification/sites.png")

    # Navigate to Departments page and take screenshot
    page.goto("http://localhost:3000/departments")
    page.wait_for_selector("text=Gestion des départements")
    page.screenshot(path="jules-scratch/verification/departments.png")

    # Navigate to Devices page and take screenshot
    page.goto("http://localhost:3000/devices")
    page.wait_for_selector("text=Gestion des terminaux")
    page.screenshot(path="jules-scratch/verification/devices.png")

    # Navigate to Attendances page and take screenshot
    page.goto("http://localhost:3000/attendance")
    page.wait_for_selector("text=Présences en temps réel")
    page.screenshot(path="jules-scratch/verification/attendances.png")

    # Navigate to Leaves page and take screenshot
    page.goto("http://localhost:3000/leaves")
    page.wait_for_selector("text=Gestion des congés")
    page.screenshot(path="jules-scratch/verification/leaves.png")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)