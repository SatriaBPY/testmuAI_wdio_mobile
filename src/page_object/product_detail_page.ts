import { BasePage } from "@pages/base_page";
import { tap, waitForElement } from "@utils/helper";
import {$,$$} from "@wdio/globals"

class ProductDetailPage extends BasePage {

  get productTitle() {
    return $('android=new UiSelector().resourceId("product-title")')
  }
  get productPrice() {
    return $('android=new UiSelector().resourceId("product-price")');
  }

  get productDescription() {
    return $('android=new UiSelector().resourceId("product-description")')
  }

  get decreseBtn() {
    return $('android=new UiSelector().resourceId("decrease-button")')
  }

  get increaseBtn() {
    return $('android=new UiSelector().resourceId("increase-button")')
  }

  get qttText() {
    return $('android=new UiSelector().resourceId("quantity")');
  }

  get addToCartBtn() {
    return $('android=new UiSelector().resourceId("add-to-cart-button")')
  }

  get closeProductDetailbtn() {
    return $('~Close product details')
  }

  get rentalBadge() {
    return $('android=new UiSelector().text("Rental")');
  }

  async qtt(option: 'Increase' | 'Decrease', X: number = 1) {
    for (let i = 0; i < X; i++) {
      if (option === 'Increase') {
        await waitForElement(this.increaseBtn)
        await tap(this.increaseBtn)
      } else {
        await waitForElement(this.decreseBtn)
        await tap(this.decreseBtn)
      }
    }
  }

  async relatedProducts(): Promise<string> {
    await waitForElement(this.productTitle)
    const title = await this.productTitle.getText()
    return title    
  }
}

export default new ProductDetailPage();