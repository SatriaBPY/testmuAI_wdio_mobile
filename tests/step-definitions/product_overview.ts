import { Given, Then, When } from "@wdio/cucumber-framework";
import { driver, expect } from "@wdio/globals";
import HomePage from "@pages/home_page";
import ProductDetailPage from "@pages/product_detail_page";
import { fill } from "@utils/helper";

Given("I am on the home page", async () => {
  await HomePage.gotoHomePage()
});

Then("a list of product cards is displayed", async () => {
  await expect(HomePage.product("1")).toBeDisplayed();
});

Then("a grid of product cards is displayed", async () => {
  await HomePage.switchToGrid();
  await expect(HomePage.product("1")).toBeDisplayed();
});

Then("each card shows a product image, name, and price", async () => {
  await expect(HomePage.productTitles("1")).toBeDisplayed();
  await expect(HomePage.productTitles("1")).toHaveText("Combination Pliers");
  await expect(HomePage.productPrice("1")).toBeDisplayed();
});

When('I click on a product card', async () => {
  await HomePage.productTitles("1").click();
  
});

Then('I am navigated to the product detail page', async () => {
  await expect(ProductDetailPage.productPrice).toBeDisplayed();
  await expect(ProductDetailPage.productDescription).toBeDisplayed();
  
});

When('I enter a search query "Com" and submit', async () => {
  await fill(HomePage.searchField, "Com")
  await driver.pause(5000);
});

Then('the product grid updates to show only matching products', async () => {
  await expect(HomePage.product("1")).toBeDisplayed();
  await expect(HomePage.productTitles('1')).toHaveText(/Com/);
  await HomePage.resetSearch()
});


When('I enter a search query with exactly 40 characters and submit', async () => {
  await fill(HomePage.searchField, "Combination".padEnd(40, "X"))
  await driver.pause(5000);
});

Then('system shows "No products found" message', async () => {
  await HomePage.notResult();
  await expect(HomePage.notProduct).toBeDisplayed();
  await expect(HomePage.notProduct).toHaveText("No products found :(");
  await HomePage.resetSearch();
});

When('I enter a search query "Co" and submit', async () => {
  await fill(HomePage.searchField, "Co")
  await driver.pause(5000);
});

When('I enter a search query with 41 characters and submit', async () => {
  await fill(HomePage.searchField, "Combination".padEnd(41, "X"))
  await driver.pause(5000);
});

When('I enter a search query "@#$%^&" and submit', async () => {
  await fill(HomePage.searchField, "@#$%^&")
  await driver.pause(5000);
});



When('I enter a search query "   " and submit', async () => {
  await fill(HomePage.searchField, " ")
  await driver.pause(5000);
});


// AC5 – Category filter

Given('I check one category checkbox in the sidebar', async () => {
  await HomePage.filterByCategory('Hammer')
});

Then('the product grid updates to show only products from that category', async () => {
  await expect(HomePage.productTitleIndex1(1)).toBeDisplayed();
  await expect(HomePage.productTitleIndex1(1)).toHaveText(/Hammer/);
});

Given('I check multiple category checkboxes in the sidebar', async () => {
   await HomePage.filterByCategory('Wrench')
});

Then('the product grid updates to show only products from those selected categories', async () => {
  await HomePage.searchProductMatching('Wrench')
});


Given('I check one brand checkbox in the sidebar', async () => {
  await HomePage.filterByBrand('Brand name 1')
});

Then('the product grid updates to show only products from that brand', async () => {
  await expect(HomePage.productTitleIndex1(1)).toBeDisplayed();
  
});

Given('I check multiple brand checkboxes in the sidebar', async () => {
  await HomePage.filterByBrand('Brand name 2')
});

Then('the product grid updates to show only products from those selected brands', async () => {
   await expect(HomePage.productTitleIndex1(1)).toBeDisplayed();
});


Given(/^I select sort option "(.*)"$/, async (sortOption: string) => {
  const sort = sortOption as "Name (A-Z)" | "Name (Z-A)" | "Price (High-Low)" | "Price (Low-High)";
  console.log(`Selecting sort option: ${sortOption}`);
  await HomePage.filterBySorting(sort);
});

Then(/^the product grid reloads with products ordered by "(.*)"$/, async (sortOption: string) => {
  console.log(`Verifying product grid sorted by: ${sortOption}`);
  await expect(HomePage.productTitleIndex1(1)).toBeDisplayed();
});