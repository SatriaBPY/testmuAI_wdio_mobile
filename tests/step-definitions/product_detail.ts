import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';
import HomePage from '@pages/home_page';
import ProductDetailPage from '@pages/product_detail_page';
import { tap, waitForElement } from '@utils/helper';


Given('I am on the product detail page for a product that is in stock', async () => {
  await HomePage.gotoHomePage();
  await HomePage.productTitleIndex1(1).click();
});

Then('the product image, name, description, price, category badge, and brand badge are shown', async () => {
  await expect(ProductDetailPage.productPrice).toBeDisplayed()
  await expect(ProductDetailPage.productDescription).toBeDisplayed();
  
});

Then(/^a quantity input field is displayed with plus \(\+\) and minus \(-\) buttons$/, async () => {
  await expect(ProductDetailPage.qttText).toBeDisplayed();
  await expect(ProductDetailPage.decreseBtn).toBeDisplayed();
  await expect(ProductDetailPage.increaseBtn).toBeDisplayed();
});

Then('the default quantity is 1', async () => {
  await expect(ProductDetailPage.qttText).toHaveText('1');
});

When('I click the plus button', async () => {
  await tap(ProductDetailPage.increaseBtn);
});

Then('the quantity increases by 1', async () => {
  await expect(ProductDetailPage.qttText).toHaveText('2')
});

Given('the quantity is 5', async () => {
  await ProductDetailPage.qtt('Increase', 4)
  await expect(ProductDetailPage.qttText).toHaveText('5')
});

When('I click the minus button', async () => {
  await ProductDetailPage.qtt('Decrease')
});

Then('the quantity decreases to 4', async () => {
  await expect(ProductDetailPage.qttText).toHaveText('4')
});

Given('the quantity is 1', async () => {
  await expect(ProductDetailPage.qttText).toHaveText('1')
});

Then('the quantity remains at 1', async () => {
  await expect(ProductDetailPage.qttText).toHaveText('1')
});


Given(/^a valid quantity.*is selected$/, async () => {
  await ProductDetailPage.qtt("Increase", 2)
  await expect(ProductDetailPage.qttText).toHaveText('3')
});

When('I click the "Add to Cart" button', async () => {
  await tap(ProductDetailPage.addToCartBtn);
});

Then('the product is added to the cart with quantity 3', async () => {
  await expect(ProductDetailPage.cartQttIcon).toHaveText('3')
});

