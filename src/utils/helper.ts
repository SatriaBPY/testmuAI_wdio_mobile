import { $, $$, driver } from "@wdio/globals";
import { ChainablePromiseElement } from "webdriverio";


const TIME_OUT = 15000;

export const waitForElement = async (
  selector: ChainablePromiseElement,
  timeout: number = TIME_OUT,
): Promise<void> => {
  const element = selector;
  await element.waitForDisplayed({
    interval: 500,
    timeout,
  });
};

export const goBack = async () => {
  await driver.back();
};

export const scrollIfNeeded = async (selector: ChainablePromiseElement) => {
  await selector.waitForDisplayed({ timeout: TIME_OUT, interval: 500 });
  await selector.scrollIntoView();
}

export const tap = async (selector: ChainablePromiseElement) => {
  //await selector.waitForClickable({ timeout: TIME_OUT, interval: 500 });
  await selector.click();
};

export const fill = async (selector: ChainablePromiseElement, value: string) => {
  await selector.waitForDisplayed({ timeout: TIME_OUT, interval: 500 });
  await selector.click();
  await selector.clearValue();
  await selector.setValue(value);
  await driver.pause(500)
  await driver.pressKeyCode(66);

};

export const swipe = async (
  direction: string = "up",
): Promise<void> => {
  const { width, height } = await driver.getWindowSize();
  let startX: number, startY: number, endX: number, endY: number;
  
  switch (direction) {
    case "up":
      startX = width / 2;
      startY = height * 0.8;
      endX = width / 2;
      endY = height * 0.2;
      break;
    case "down":
      startX = width / 2;
      startY = height * 0.2;
      endX = width / 2;
      endY = height * 0.8;
      break;
    case "left":
      startX = width * 0.8;
      startY = height / 2;
      endX = width * 0.2;
      endY = height / 2;
      break;
    case "right":
      startX = width * 0.2;
      startY = height / 2;
      endX = width * 0.8;
      endY = height / 2;
      break;
    default:
      throw new Error(`Invalid direction: ${direction}`);
  }

  await driver.action('pointer', {
    parameters: { pointerType: 'touch' }
  })
  .move({ duration: 0, x: Math.floor(startX), y: Math.floor(startY) })
  .down({ button: 0 }) 
  .pause(500)         
  .move({ duration: 1000, x: Math.floor(endX), y: Math.floor(endY) })
  .up({ button: 0 }) 
  .perform();
};


export const getInnerText = async (selector: ChainablePromiseElement): Promise<string> => {
  await selector.waitForDisplayed({ timeout: TIME_OUT, interval: 500 });
  return await selector.getText();
};