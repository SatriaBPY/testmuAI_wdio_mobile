import { BasePage } from "@pages/base_page";
import { $, $$, driver, expect } from "@wdio/globals";
import { waitForElement, goBack, swipe } from "@utils/helper";
import { byCategory, byBrand, bySortOption } from "../test_data/types";
import { ChainablePromiseElement } from "webdriverio";

class HomePage extends BasePage {
  get switchToGridBtn() {
    return $("~Switch to grid view");
  }

  get switchToListBtn() {
    return $("~Switch to list view");
  }

  //use index for product, addToCart, productDetails, productTitel, productPrice, decreseBtn, increaseBtn, quantity start from 0 = 1
  product(index: string) {
    return $(`android=new UiSelector().resourceId("product-item-${index}")`);
  }

  get searchField() {
    return $('android=new UiSelector().resourceId("search-input")');
  }

  get clearSearch() {
    return $("~Clear search");
  }

  private addToCart(index: string) {
    return $(
      `android=new UiSelector().resourceId("add-to-cart-button").instance(${index})`,
    );
  }

  private addToFavBtn(index: string) {
    return $(
      `android=new UiSelector().resourceId("favorite-button").instance(${index})`,
    );
  }

  private productDetails(index: string) {
    return $(`android=new UiSelector().resourceId("product-details-${index}")`);
  }

  productTitles(index: string) {
    return this.productDetails(index).$(
      `android=new UiSelector().resourceId("product-title")`,
    );
  }

  productTitleIndex1(index: number = 1) {
    return $(
      `android=new UiSelector().resourceId("product-title").instance(${index})`,
    );
  }

  get arrayProductTitle(){
    return $$('android=new UiSelector().resourceId("product-title")');
  }

  productPrice(index: string) {
    return this.productDetails(index).$(
      `android=new UiSelector().resourceId("product-price")`,
    );
  }

  private decreseBtn(index: string) {
    return $(
      `android=new UiSelector().resourceId("decrease-button").instance(${index})`,
    );
  }

  private increaseBtn(index: string) {
    return $(
      `android=new UiSelector().resourceId("increase-button").instance(${index})`,
    );
  }

  private quantity(index: string) {
    return $(
      `android=new UiSelector().resourceId("quantity").instance(${index})`,
    );
  }

  get filterBtn() {
    return $("~Filter and sort");
  }

  get SortBy() {
    return $('android=new UiSelector().text("Select Sorting Option")');
  }

  get nameAZ() {
    return $("~Name (A-Z)");
  }

  get nameZA() {
    return $("~Name (Z-A)");
  }

  get priceLowHigh() {
    return $("~Price (Low-High)");
  }

  get priceHighLow() {
    return $("~Price (High-Low)");
  }

  get filterByCategoryBtn() {
    return $('android=new UiSelector().text("Select Categories")');
  }

  filterByCategoryBtnAfterFilter(index: number = 1) {
    return $(
      `android=new UiSelector().text("Select Categories (${index} selected)")`,
    );
  }

  private categoryOption(category: string) {
    return $(`~${category}`).$(`android=new UiSelector().text("${category}")`);
  }

  get closeFilterBtn() {
    return $("~Close filter and sort");
  }

  get filterByBrandBtn() {
    return $('android=new UiSelector().text("Select Brands")');
  }

  filterByBrandAfterFilter(index: number = 1) {
    return $(`android=new UiSelector().text("Select Brands (${index} selected)")`);
  }

  private brandOption(brand: string) {
    return $(`android=new UiSelector().description("Brand name ${brand}")`);
  }

  private submitBtn(index: string) {
    return $(
      `android=new UiSelector().description("Submit").instance(${index})`,
    );
  }

  get applyBtn() {
    return $("~APPLY");
  }

  get rentalTab() {
    return $('android=new UiSelector().resourceId("rentals-tab")');
  }

  get productTab() {
    return $('android=new UiSelector().resourceId("products-tab")');
  }

  get notProduct() {
    return $('android=new UiSelector().resourceId("empty-product-list")');
  }

  /*

     METHODS

  */

  async productList(index: string) {
    await this.product(index).waitForDisplayed();
  }

  async switchToGrid() {
    await waitForElement(this.switchToGridBtn);
    await this.switchToGridBtn.click();
  }

  async resetSearch() {
    await waitForElement(this.clearSearch);
    await this.clearSearch.click();
    await driver.pause(500);
  }

  async productTitle(index: string) {
    await this.productTitles(index).waitForDisplayed();
  }

  async gotoHomePage(maxRetries: number = 5) {
    let retries = 0;
    await waitForElement(this.productTitleIndex1(1), 5000).catch(() => false);
    let isDisplayed = await this.productTitleIndex1(1).isDisplayed({});

    while (!isDisplayed && retries < maxRetries) {
      await goBack();
      await driver.pause(500);
      isDisplayed = await this.productTitleIndex1(1).isDisplayed({});
      retries++;
    }

    if (!isDisplayed) {
      throw new Error("Product element not found after navigating back.");
    }
  }
  async notResult() {
    await waitForElement(this.notProduct);
  }

  async filterDisplayed(index: number = 1): Promise<ChainablePromiseElement> {
    const beforFilter = await this.filterByCategoryBtn.isDisplayed();
    const afterFilter =
      await this.filterByCategoryBtnAfterFilter(index).isDisplayed();
    if (beforFilter) {
      return this.filterByCategoryBtn;
    }
    return this.filterByCategoryBtnAfterFilter(index);
  }

  async filterByBrandDisplayed(index: number = 1): Promise<ChainablePromiseElement> {
    const beforeFilter = await this.filterByBrandBtn.isDisplayed()
    const afterFilter = await this.filterByBrandAfterFilter(index) 
    if (beforeFilter) {
      return this.filterByBrandBtn;
    }
    return this.filterByBrandAfterFilter(index);
  }

  async filterByCategory(option: byCategory): Promise<void> {
    await waitForElement(this.filterBtn);
    await this.filterBtn.click();
    // await waitForElement(this.filterByCategoryBtn);
    // await this.filterByCategoryBtn.click();
    //
    await this.filterDisplayed(1);
    const filterBtn = await this.filterDisplayed(1);
    await filterBtn.click();
    await driver.pause(500);
    const isKeyboardOpen = await driver.isKeyboardShown();
    if (isKeyboardOpen) {
      await driver.pressKeyCode(4);
      await driver.pause(300);
    }
    await waitForElement(this.categoryOption(option));
    await this.categoryOption(option).click();
    await this.applyBtn.scrollIntoView();
    await this.applyBtn.click();
  }

  async filterByBrand(option: byBrand): Promise<void> {
    await waitForElement(this.filterBtn);
    await this.filterBtn.click();
    await this.filterByBrandDisplayed(1);
    const filterBtn = await this.filterByBrandDisplayed(1);
    await filterBtn.click();
    await driver.pause(500);
    const isKeyboardOpen = await driver.isKeyboardShown();
    if (isKeyboardOpen) {
      await driver.pressKeyCode(4);
      await driver.pause(300);
    }
    await waitForElement(this.categoryOption(option));
    await this.categoryOption(option).click();
    await this.applyBtn.scrollIntoView();
    await this.applyBtn.click();
  }

  async searchProductMatching(containsText: string): Promise<void> {
      let scrollAttempts = 0;
      const maxScrolls = 20;
      
      while (scrollAttempts < maxScrolls) {
          const products = await this.arrayProductTitle
          
          for (const product of products) {
              const text = await product.getText();
              if (text && text.includes(containsText)) {
                  console.log(`Found "${containsText}" in product "${products.length}"`);
                  await product.scrollIntoView();
                  return;
              }
          }
          await swipe("up");
          scrollAttempts++;
      }
      
      throw new Error(`❌ "${containsText}" not found after scrolling entire page`);
  }

  async sortingOption(option: bySortOption): Promise<ChainablePromiseElement> {
    const maping: Record<bySortOption, ChainablePromiseElement> = {
      "Price (Low-High)": this.priceLowHigh,
      "Price (High-Low)": this.priceHighLow,
      "Name (A-Z)": this.nameAZ,
      "Name (Z-A)": this.nameZA,
    }
    return maping[option];
  }

  async filterBySorting(option: bySortOption) {
    await waitForElement(this.filterBtn);
    await this.filterBtn.click();
    await waitForElement(this.SortBy);
    await this.SortBy.click();
    await driver.pause();
    const keyboardOpen = await driver.isKeyboardShown();
    if (keyboardOpen) {
      await driver.pressKeyCode(4);
      await driver.pause(300);
    }
    await waitForElement(await this.sortingOption(option))
    await (await this.sortingOption(option)).click();
    await this.applyBtn.scrollIntoView();
    await this.applyBtn.click();
    
  }
  
}

export default new HomePage();
