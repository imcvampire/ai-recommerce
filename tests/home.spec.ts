import { expect, test } from '@playwright/test'

test.describe('Home', () => {
  test('can submit and get recommendation', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('textbox', { name: 'Product name' }).click()
    await page.getByRole('textbox', { name: 'Product name' }).fill('iPhone 16')

    await page.getByRole('combobox', { name: 'Condition' }).click()
    await page.getByRole('option', { name: 'Good' }).click()

    await page.getByRole('textbox', { name: 'Notes' }).click()
    await page.getByRole('textbox', { name: 'Notes' }).fill("It's still working fine")

    await page.getByRole('button', { name: 'Submit' }).click()

    const marketingTextarea = page.getByRole('textbox', { name: 'Marketing text' })
    await expect(marketingTextarea).not.toBeEmpty()
    await expect(marketingTextarea).not.toBeEditable()

    const categoryText = page.getByRole('textbox', { name: 'Category' })
    await expect(categoryText).not.toBeEmpty()
    await expect(categoryText).not.toBeEditable()
  })
})
