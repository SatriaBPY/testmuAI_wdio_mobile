import {$, $$} from '@wdio/globals'

export abstract class BasePage {
  get humbergerMenu() {
    return $('~Open navigation drawer')
  }

  get registerMenu() {
    return $('android=new UiSelector().text("Register")');
  }

  get signInMenu() {
    return $('android=new UiSelector().text("Sign In")');
  }

  get contactMenu() {
    return $('android=new UiSelector().text("Contact")');
  }

  get CartIcon() {
    return $('android=new UiSelector().resourceId("cart-button")')
  }

  get cartQttIcon() {
    return $('android=new UiSelector().resourceId("cart-quantity")');
  }

  get rentalMenu() {
    return $('android=new UiSelector().resourceId("rentals-tab")');
  }
  
}