import { Given, When, Then } from '@wdio/cucumber-framework';
import RentalPage from '@pages/rental_page';
import { expect } from '@wdio/globals';
import ProductDetailPage from '@pages/product_detail_page';


Given('I navigate to the rentals page', async () => {
  await RentalPage.gotoRentalPage();
});

Then('a list of all rental products is displayed', async () => {
  await expect(RentalPage.rentalPRoduct(1)).toBeDisplayed();
});

Given('I am on the rentals page', async () => {
  await RentalPage.gotoRentalPage();
});

Then('each rental product shows a product image, name, and price', async () => {
  await expect(RentalPage.productTitle).toBeDisplayed();
  await expect(RentalPage.productPrice).toBeDisplayed();
});


When('I click on a rental product', async () => {
   await RentalPage.detailRentalProduct();
});

Then('each rental product shows a product image, name, price, rental badge and description', async () => {
  await expect(ProductDetailPage.productTitle).toBeDisplayed();
  await expect(ProductDetailPage.productPrice).toBeDisplayed();
  await expect(ProductDetailPage.productDescription).toBeDisplayed();
  await expect(ProductDetailPage.rentalBadge).toBeDisplayed();
});


Given('I have added a rental item to my cart', async () => {
  await RentalPage.gotoRentalPage();
  await RentalPage.addRentToCart();
});

When('I go to the checkout cart', async () => {
  await RentalPage.gotoCart();
});

Then('the rental item is marked with "This is a rental item"', async () => {
  await expect(RentalPage.rentMarked).toBeDisplayed();
  await expect(RentalPage.rentMarked).toHaveText('Item for rent')
});



