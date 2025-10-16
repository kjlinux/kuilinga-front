import re
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Login
    page.goto("http://localhost:3000/login")
    expect(page.get_by_role("heading", name="KUILINGA")).to_be_visible()
    page.get_by_placeholder("votre@email.com").fill("admin@example.com")
    page.get_by_placeholder("••••••••").fill("string")
    page.get_by_role("button", name="Se connecter").click()

    # Check for error message or successful login
    error_message = page.locator(".text-red-600")
    try:
        expect(error_message).to_be_visible(timeout=5000)
        print(f"Login failed with error: {error_message.inner_text()}")
        # Take a screenshot of the error
        page.screenshot(path="jules-scratch/verification/login_error.png")
        # Stop the script if login fails
        return
    except:
        # If no error message, expect redirection to dashboard
        expect(page).to_have_url("http://localhost:3000/dashboard", timeout=10000)


    # Navigate to Organizations and take screenshot
    page.goto("http://localhost:3000/organizations")
    expect(page.get_by_role("heading", name="Gestion des organisations")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/organizations.png")

    # Navigate to Employees and take screenshot
    page.goto("http://localhost:3000/employees")
    expect(page.get_by_role("heading", name="Gestion des employés")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/employees.png")

    # Navigate to Sites and take screenshot
    page.goto("http://localhost:3000/sites")
    expect(page.get_by_role("heading", name="Gestion des sites")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/sites.png")

    # Navigate to Departments and take screenshot
    page.goto("http://localhost:3000/departments")
    expect(page.get_by_role("heading", name="Gestion des départements")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/departments.png")

    # Navigate to Devices and take screenshot
    page.goto("http://localhost:3000/devices")
    expect(page.get_by_role("heading", name="Gestion des terminaux")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/devices.png")

    # Navigate to Leaves and take screenshot
    page.goto("http://localhost:3000/leaves")
    expect(page.get_by_role("heading", name="Gestion des congés")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/leaves.png")

    # Navigate to Attendance and take screenshot
    page.goto("http://localhost:3000/attendance")
    expect(page.get_by_role("heading", name="Présences en temps réel")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/attendance.png")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)