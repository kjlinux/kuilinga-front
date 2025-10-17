from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Verify Deletion Dialog
    page.goto("http://localhost:3000/departments")
    page.wait_for_selector("text=Gestion des départements")
    page.get_by_role("button", name="Supprimer").first.click()
    page.screenshot(path="jules-scratch/verification/01_confirmation_dialog.png")
    page.get_by_role("button", name="Confirmer").click()
    page.wait_for_selector("text=Département supprimé avec succès !")
    page.screenshot(path="jules-scratch/verification/02_toast_notification.png")

    # Verify Attendance Page Pagination
    page.goto("http://localhost:3000/attendance")
    page.wait_for_selector("text=Présences en temps réel")
    page.screenshot(path="jules-scratch/verification/03_attendance_page.png")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)