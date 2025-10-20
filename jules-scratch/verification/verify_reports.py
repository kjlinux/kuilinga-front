
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Log in
    page.goto("http://localhost:3000/login")
    page.get_by_label("Email").fill("test@test.com")
    page.get_by_label("Mot de passe").fill("password")
    page.get_by_role("button", name="Se connecter").click()
    page.wait_for_url("http://localhost:3000/")

    # Go to reports page
    page.get_by_role("link", name="Rapports").click()
    page.wait_for_url("http://localhost:3000/reports")

    # Select R2 report
    page.get_by_role("combobox").first.click()
    page.get_by_label("Analyse Comparative").click()
    page.screenshot(path="jules-scratch/verification/verification_r2.png")

    # Select R3 report
    page.get_by_role("combobox").first.click()
    page.get_by_label("Utilisation des Terminaux").click()
    page.screenshot(path="jules-scratch/verification/verification_r3.png")

    # Select R4 report
    page.get_by_role("combobox").first.click()
    page.get_by_label("Audit Utilisateurs et Rôles").click()
    page.screenshot(path="jules-scratch/verification/verification_r4.png")

    # Select R8 report
    page.get_by_role("combobox").first.click()
    page.get_by_label("Rapport d'Anomalies").click()
    page.screenshot(path="jules-scratch/verification/verification_r8.png")

    # Select R11 report
    page.get_by_role("combobox").first.click()
    page.get_by_label("Export Paie").click()
    page.screenshot(path="jules-scratch/verification/verification_r11.png")

    # Select R14 report
    page.get_by_role("combobox").first.click()
    page.get_by_label("Validation des Heures").click()
    page.screenshot(path="jules-scratch/verification/verification_r14.png")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
