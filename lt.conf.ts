// lt.conf.ts
// @ts-ignore
import CustomReporter = require("./custom_report/custom_report");

exports.config = {
  user: process.env.LT_USERNAME,
  key: process.env.LT_ACCESS_KEY,

  specs: [
    './tests/feature/*.feature',
  ],

  exclude: [],
  maxInstances: 1,
  maxInstancesPerCapability: 1,
  hostname: "mobile-hub.lambdatest.com",
  port: 80,
  path: "/wd/hub",

  capabilities: [{
      "platformName": "android",
      "appium:automationName": "UiAutomator2",
      "appium:platformVersion": "15",
      "appium:app": "lt://APP10160362031780046038722174",
      "lt:options": {
          "deviceName": "Pixel 8 Pro",
          "isRealMobile": true,
          "build": "Test Build Lambda Test",
          "name": "Lambda Test - Cucumber",
          "project": "Practice web",
          "w3c": true,
          "video": true,
          "network": false,
          "devicelog": false
      }
  }],

  framework: "cucumber",

  cucumberOpts: {
    require: [
      "./tests/step-definitions/**/*.ts",
      "./tests/hooks.ts",
    ],
    timeout: 60000,
    backtrace: true,
    failFast: false,
    snippets: true,
    source: true,
    profile: [],
    strict: false,
    tags: [],
    tagExpression: "",
    ignoreUndefinedDefinitions: false
  },
  
  logLevel: 'warn',
  
  reporters: [
    ["spec",
      {
        symbols: { passed: "✓", failed: "✗" },
        summary: true,
        addConsoleLogs: false,
      },
    ],
    [
      CustomReporter,
      {
        stdout: true,
      },
    ],
   
    ["allure", {
      outputDir: "allure-results",
      disableWebdriverStepsReporting: false,
      disableWebdriverScreenshotsReporting: false,
      disableMochaHooks: true,
      addConsoleLogs: true,
    }]
  ],

  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  services: [
    ['lambdatest', {
      tunnel: false
    }]
  ],
};