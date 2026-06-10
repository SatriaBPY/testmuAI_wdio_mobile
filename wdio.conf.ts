import { browser } from "@wdio/globals";
import CustomReporter from "./custom_report/custom_report";
import allureReporter from "@wdio/allure-reporter";

export const config: WebdriverIO.Config = {
  runner: "local",
  tsConfigPath: "./tsconfig.json",

  port: 4723,

  specs: [
    // './tests/feature/product_overview.feature',
    // './tests/feature/rental_product.feature',
    // './tests/feature/product_detail.feature',
    "./tests/feature/*.feature",
  ],

  exclude: [],

  maxInstances: 1,
  maxInstancesPerCapability: 1,

  capabilities: [
    // {
    //   platformName: "Android",
    //   "appium:automationName": "UiAutomator2",
    //   "appium:udid": "4x69v4toz5torglr",
    //   "appium:appPackage": "io.testsmith.practicesoftwaretesting",
    //   "appium:appActivity": "io.testsmith.practicesoftwaretesting.MainActivity",
    //   "appium:noReset": false,
    // },
    {
      platformName: "Android",
      "appium:automationName": "UiAutomator2",
      "appium:deviceName": process.env.DEVICE_0_NAME || "Pixel 6",
      "appium:platformVersion": "14.0",
      "appium:app": "./apps/app-debug.apk",
      "appium:appPackage": "io.testsmith.practicesoftwaretesting",
      "appium:appActivity": "io.testsmith.practicesoftwaretesting.MainActivity",
      "appium:noReset": false,
      "appium:fullReset": false,
      "appium:newCommandTimeout": 240,
      "appium:udid": process.env.DEVICE_0_UDID || "emulator-5554",
      "appium:adbExecTimeout": 60000,
    },
  ],

  // Level of logging verbosity: trace | debug | info | warn | error | silent
  logLevel: "info",
  //
  // Set specific log levels per logger
  // loggers:
  // - webdriver, webdriverio
  // - @wdio/browserstack-service, @wdio/lighthouse-service, @wdio/sauce-service
  // - @wdio/mocha-framework, @wdio/jasmine-framework
  // - @wdio/local-runner
  // - @wdio/sumologic-reporter
  // - @wdio/cli, @wdio/config, @wdio/utils
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  logLevels: {
    webdriver: "warn",
    "@wdio/appium-service": "warn",
    "@wdio/local-runner": "warn",
  },
  //
  // If you only want to run your tests until a specific amount of tests have failed use
  // bail (default is 0 - don't bail, run all tests).
  bail: 0,
  //
  // Set a base URL in order to shorten url command calls. If your `url` parameter starts
  // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
  // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
  // gets prepended directly.
  // baseUrl: 'http://localhost:8080',
  //
  // Default timeout for all waitFor* commands.
  waitforTimeout: 10000,
  //
  // Default timeout in milliseconds for request
  // if browser driver or grid doesn't send response
  connectionRetryTimeout: 120000,
  //
  // Default request retries count
  connectionRetryCount: 3,
  //
  // Test runner services
  // Services take over a specific job you don't want to take care of. They enhance
  // your test setup with almost no effort. Unlike plugins, they don't add new
  // commands. Instead, they hook themselves up into the test process.
  services: [
    [
      "appium",
      {
        args: {
          relaxedSecurity: true,

          // allowInsecure: ['adb_shell']

          allowInsecure: ["uiautomator2:adb_shell"],
        },
        command: "appium",
      },
    ],
  ],
  // Framework you want to run your specs with.
  // The following are supported: Mocha, Jasmine, and Cucumber
  // see also: https://webdriver.io/docs/frameworks
  //
  // Make sure you have the wdio adapter package for the specific framework installed
  // before running any tests.
  framework: "cucumber",

  //
  // The number of times to retry the entire specfile when it fails as a whole
  // specFileRetries: 1,
  //
  // Delay in seconds between the spec file retry attempts
  // specFileRetriesDelay: 0,
  //
  // Whether or not retried spec files should be retried immediately or deferred to the end of the queue
  // specFileRetriesDeferred: false,
  //
  // Test reporter for stdout.
  // The only one supported by default is 'dot'
  // see also: https://webdriver.io/docs/dot-reporter
  reporters: [
    [
      "spec",
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
    ["allure", { outputDir: "allure-results" }],
  ],

  // If you are using Cucumber you need to specify the location of your step definitions.
  cucumberOpts: {
    require: [
      // './tests/step-definitions/product_overview.ts',
      // './tests/step-definitions/rental_product.ts',
      // './tests/step-definitions/product_detail.ts',
      "./tests/step-definitions/**/*.ts",
      "./tests/hooks.ts",
    ],

    backtrace: false,

    dryRun: false,

    failFast: false,

    name: [],
    // <boolean> hide step definition snippets for pending steps
    snippets: true,
    // <boolean> hide source uris
    source: true,
    // <boolean> fail if there are any undefined or pending steps
    strict: false,
    // <string> (expression) only execute the features or scenarios with tags matching the expression
    tagExpression: "",
    // <number> timeout for step definitions
    timeout: 60000,
    // <boolean> Enable this config to treat undefined definitions as warnings.
    ignoreUndefinedDefinitions: false,

    order: "defined",
    format: ["summary", "progress"],
    formatOptions: {
      snippetInterface: "async-await",
      snippetSyntax: undefined,
    },
  },

  //
  // =====
  // Hooks
  // =====
  // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
  // it and to build services around it. You can either apply a single function or an array of
  // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
  // resolved to continue.
  /**
   * Gets executed once before all workers get launched.
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   */
  // onPrepare: function (config, capabilities) {
  // },
  /**
   * Gets executed before a worker process is spawned and can be used to initialize specific service
   * for that worker as well as modify runtime environments in an async fashion.
   * @param  {string} cid      capability id (e.g 0-0)
   * @param  {object} caps     object containing capabilities for session that will be spawn in the worker
   * @param  {object} specs    specs to be run in the worker process
   * @param  {object} args     object that will be merged with the main configuration once worker is initialized
   * @param  {object} execArgv list of string arguments passed to the worker process
   */
  // onWorkerStart: function (cid, caps, specs, args, execArgv) {
  // },
  /**
   * Gets executed just after a worker process has exited.
   * @param  {string} cid      capability id (e.g 0-0)
   * @param  {number} exitCode 0 - success, 1 - fail
   * @param  {object} specs    specs to be run in the worker process
   * @param  {number} retries  number of retries used
   */
  // onWorkerEnd: function (cid, exitCode, specs, retries) {
  // },
  /**
   * Gets executed just before initialising the webdriver session and test framework. It allows you
   * to manipulate configurations depending on the capability or spec.
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   * @param {string} cid worker id (e.g. 0-0)
   */
  // beforeSession: function (config, capabilities, specs, cid) {
  // },
  /**
   * Gets executed before test execution begins. At this point you can access to all global
   * variables like `browser`. It is the perfect place to define custom commands.
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs        List of spec file paths that are to be run
   * @param {object}         browser      instance of created browser/device session
   */
  // before: function (capabilities, specs) {
  // },
  /**
   * Runs before a WebdriverIO command gets executed.
   * @param {string} commandName hook command name
   * @param {Array} args arguments that command would receive
   */
  // beforeCommand: function (commandName, args) {
  // },
  /**
   * Cucumber Hooks
   *
   * Runs before a Cucumber Feature.
   * @param {string}                   uri      path to feature file
   * @param {GherkinDocument.IFeature} feature  Cucumber feature object
   */
  // beforeFeature: function (uri, feature) {
  // },
  /**
   *
   * Runs before a Cucumber Scenario.
   * @param {ITestCaseHookParameter} world    world object containing information on pickle and test step
   * @param {object}                 context  Cucumber World object
   */
  // beforeScenario: function (world, context) {
  // },
  /**
   *
   * Runs before a Cucumber Step.
   * @param {Pickle.IPickleStep} step     step data
   * @param {IPickle}            scenario scenario pickle
   * @param {object}             context  Cucumber World object
   */
  // beforeStep: function (step, scenario, context) {
  // },
  /**
   *
   * Runs after a Cucumber Step.
   * @param {Pickle.IPickleStep} step             step data
   * @param {IPickle}            scenario         scenario pickle
   * @param {object}             result           results object containing scenario results
   * @param {boolean}            result.passed    true if scenario has passed
   * @param {string}             result.error     error stack if scenario failed
   * @param {number}             result.duration  duration of scenario in milliseconds
   * @param {object}             context          Cucumber World object
   */
  afterStep: async function (step, scenario, { passed, error, duration }) {
    if (!passed) {
      const pngScreenshot = await browser.takeScreenshot();

      allureReporter.addAttachment(
        `Screenshot Failure: ${step.text}`,
        Buffer.from(pngScreenshot, "base64"),
        "image/png",
      );
    }
  },
  /**
   *
   * Runs after a Cucumber Scenario.
   * @param {ITestCaseHookParameter} world            world object containing information on pickle and test step
   * @param {object}                 result           results object containing scenario results
   * @param {boolean}                result.passed    true if scenario has passed
   * @param {string}                 result.error     error stack if scenario failed
   * @param {number}                 result.duration  duration of scenario in milliseconds
   * @param {object}                 context          Cucumber World object
   */
  // afterScenario: function (result) {
  //   if (res) {
  //     browser.saveScreenshot(`error-screenshots/${result.pickle.name}.png`);
  //   }
  // },
  /**
   *
   * Runs after a Cucumber Feature.
   * @param {string}                   uri      path to feature file
   * @param {GherkinDocument.IFeature} feature  Cucumber feature object
   */
  // afterFeature: function (uri, feature) {
  // },

  /**
   * Runs after a WebdriverIO command gets executed
   * @param {string} commandName hook command name
   * @param {Array} args arguments that command would receive
   * @param {number} result 0 - command success, 1 - command error
   * @param {object} error error object if any
   */
  // afterCommand: function (commandName, args, result, error) {
  // },
  /**
   * Gets executed after all tests are done. You still have access to all global variables from
   * the test.
   * @param {number} result 0 - test pass, 1 - test fail
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  // after: function (result, capabilities, specs) {
  // },
  /**
   * Gets executed right after terminating the webdriver session.
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  // afterSession: function (config, capabilities, specs) {
  // },
  /**
   * Gets executed after all workers got shut down and the process is about to exit. An error
   * thrown in the onComplete hook will result in the test run failing.
   * @param {object} exitCode 0 - success, 1 - fail
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {<Object>} results object containing test results
   */
  // onComplete: function(exitCode, config, capabilities, results) {
  // },
  /**
   * Gets executed when a refresh happens.
   * @param {string} oldSessionId session ID of the old session
   * @param {string} newSessionId session ID of the new session
   */
  // onReload: function(oldSessionId, newSessionId) {
  // }
  /**
   * Hook that gets executed before a WebdriverIO assertion happens.
   * @param {object} params information about the assertion to be executed
   */
  // beforeAssertion: function(params) {
  // }
  /**
   * Hook that gets executed after a WebdriverIO assertion happened.
   * @param {object} params information about the assertion that was executed, including its results
   */
  // afterAssertion: function(params) {
  // }
};
