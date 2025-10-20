
import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Collect console messages
        console_messages = []
        page.on("console", lambda msg: console_messages.append(msg.text))

        await page.goto("http://localhost:3000/login")

        # Wait for the page to load
        await expect(page.get_by_label("Email")).to_be_visible()

        await page.screenshot(path="jules-scratch/verification/verification.png")

        await browser.close()

        # Check for the warning message
        uncontrolled_warning = "Select is changing from uncontrolled to controlled"
        start_transition_warning = "v7_startTransition"
        relative_splat_path_warning = "v7_relativeSplatPath"

        found_uncontrolled_warning = any(uncontrolled_warning in msg for msg in console_messages)
        found_start_transition_warning = any(start_transition_warning in msg for msg in console_messages)
        found_relative_splat_path_warning = any(relative_splat_path_warning in msg for msg in console_messages)


        if found_uncontrolled_warning or found_start_transition_warning or found_relative_splat_path_warning:
            print("Verification failed: Warnings found.")
            if found_uncontrolled_warning:
                print("- Uncontrolled to controlled warning found.")
            if found_start_transition_warning:
                print("- v7_startTransition warning found.")
            if found_relative_splat_path_warning:
                print("- v7_relativeSplatPath warning found.")
        else:
            print("Verification successful: No warnings found.")

if __name__ == "__main__":
    asyncio.run(main())
