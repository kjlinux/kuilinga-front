from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Log in
    page.goto("http://localhost:3000/login")
    page.locator('input[type="email"]').fill("kouassi.jean@example.com", timeout=60000)
    page.locator('input[type="password"]').fill("strongpassword123")
    page.locator('button[type="submit"]').click()

    # Wait for navigation to complete
    expect(page).to_have_url("http://localhost:3000/", timeout=60000)

    # Go to reports page
    page.goto("http://localhost:3000/reports")
    expect(page.get_by_text("Sélection du Rapport")).to_be_visible()

    # Test R17 - Mon Relevé de Présence
    page.locator('.SelectTrigger').click()
    page.get_by_text("Mon Relevé de Présence").click()
    page.get_by_role("button", name="Générer la prévisualisation").click()
    expect(page.get_by_text("Prévisualisation du Rapport")).to_be_visible(timeout=10000)
    expect(page.get_by_text("Employé: Jean Kouassi")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/report_r17.png")

    # Test R18 - Mon Récapitulatif Mensuel
    page.locator('.SelectTrigger').click()
    page.get_by_text("Mon Récapitulatif Mensuel").click()
    page.locator('input[placeholder="Entrez une année"]').fill("2024")
    page.locator('input[placeholder="Entrez un mois"]').fill("10")
    page.get_by_role("button", name="Générer la prévisualisation").click()
    expect(page.get_by_text("Prévisualisation du Rapport")).to_be_visible(timeout=10000)
    expect(page.get_by_text("Période: 2024-10")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/report_r18.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)