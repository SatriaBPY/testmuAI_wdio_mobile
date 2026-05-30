import { tap, waitForElement } from "@utils/helper";
import { BasePage } from "./base_page";
import { $ } from "@wdio/globals";


class RentalPage extends BasePage {
  get rentalListProduct() {
    return $('android=new UiSelector().resourceId("rental-list")');
  }

  rentalPRoduct(index: 1 | 2 | 3) {
    if (index === 1) {
      return $('android=new UiSelector().resourceId("product-item-27")');
    } else if (index === 2) {
      return $('android=new UiSelector().resourceId("product-item-28")');
    } else if (index === 3) {
      return $('android=new UiSelector().resourceId("product-item-29")');
    }
  }

  get productTitle() {
    return $('android=new UiSelector().resourceId("product-details-27")');
  } 

  get productPrice() {
    return this.productTitle.$('android=new UiSelector().resourceId("product-price")')
  }

  get addFirstRntTocartBtn() {
    return $('android=new UiSelector().resourceId("add-to-cart-button").instance(0)');
  }

  get rentMarked() {
    return $('android=new UiSelector().resourceId("rental-text")')
  }
  

  async gotoRentalPage() {
    await waitForElement(this.rentalMenu)
    await tap(this.rentalMenu);
    await waitForElement(this.productTitle)
    await waitForElement(this.rentalListProduct);
  }

  async detailRentalProduct() {
    await waitForElement(this.productTitle);
    await tap(this.productTitle);
  }

  async addRentToCart() {
    await tap(this.addFirstRntTocartBtn);
  }

  async gotoCart() {
    await tap(this.CartIcon)
  }
  
}

export default new RentalPage();