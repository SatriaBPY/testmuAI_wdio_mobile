# Mobile Automation Framework - Tools Shop

This project is a mobile test automation framework for the **Tools Shop** application (Android) using **WebdriverIO**, **Appium**, and **Cucumber**. The framework is designed with professional standards, supports cloud execution (LambdaTest), and integrates with CI/CD using GitHub Actions and Docker.

## 🚀 Key Features

- **Behavior-Driven Development (BDD)**: Utilizes Cucumber to write test scenarios in human-readable language.
- **Page Object Model (POM)**: Clean and maintainable code structure by separating page logic from test scenarios.
- **Cloud Execution (LambdaTest)**: Direct integration with LambdaTest for testing on real mobile devices in the cloud.
- **Dockerized Environment**: Tests can be run inside Docker containers to ensure environment consistency.
- **CI/CD Integration**: Automated testing workflow using GitHub Actions.
- **Advanced Reporting**: 
  - **Allure Reporter**: Detailed visual reports with screenshots and test steps.
  - **Custom Reporter**: Clean and informative console output for real-time test monitoring.
- **Automated Step Generation**: Utility to automatically generate boilerplate step definitions from `.feature` files.
- **TypeScript Support**: Type-safety and modern JavaScript features for robust development.

## 🛠️ Tech Stack

- **Framework**: [WebdriverIO v9](https://webdriver.io/)
- **Test Runner**: [Cucumber](https://cucumber.io/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Driver**: [Appium (UiAutomator2)](http://appium.io/)
- **Cloud Testing**: [LambdaTest](https://www.lambdatest.com/)
- **Reporting**: Allure Report & Custom Reporter
- **Environment**: Docker & GitHub Actions

## 📂 Project Structure

```text
testmuAI_wdio_mobile/
├── .github/workflows/    # GitHub Actions configuration
├── custom_report/        # Custom reporter implementation
├── src/
│   ├── page_object/      # Page Object Model implementation
│   ├── test_data/        # Test data and type definitions
│   └── utils/            # Helper and test utilities
├── tests/
│   ├── feature/          # Cucumber feature files (.feature)
│   ├── step-definitions/ # Step definition implementations
│   └── hooks.ts          # Test setup & teardown
├── Dockerfile            # Docker container configuration
├── lt.conf.ts            # LambdaTest-specific configuration
└── wdio.conf.ts          # Main WebdriverIO configuration
```

## ⚙️ Environment Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd testmuAI_wdio_mobile
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Ensure you have LambdaTest credentials and set them as environment variables:
   - `LT_USERNAME`
   - `LT_ACCESS_KEY`

## 🏃 Running Tests

### Local (via LambdaTest)
To run tests on LambdaTest from your local machine:
```bash
npm run lt
```

### Using Docker
1. **Build Image**:
   ```bash
   docker build -t mobile-automation .
   ```
2. **Run Container**:
   ```bash
   docker run -e LT_USERNAME=your_user -e LT_ACCESS_KEY=your_key mobile-automation
   ```

### Step Generation Utility
If you add new scenarios in `.feature` files, you can generate boilerplate step definitions with:
```bash
npm run generate
```

## 📊 Reporting

### Allure Report
After the tests are completed, you can generate and open the Allure report:
```bash
npm run allure:clean
npm run allure:open
```

### Custom Console Report
The framework displays clean logs in the terminal during test execution:
```text
📁 Feature: Product Overview
..................................................
📝 Scenario: Product list is displayed with correct information
✅ PASSED: Product list is displayed with correct information
```

## 🧪 Test Scenarios
Current test coverage includes:
- **Product Overview**: Pagination, search (with Boundary Value Analysis), category/brand filtering, and sorting.
- **Product Detail**: Verification of product detail information.
- **Rental Process**: Product rental workflow.

---
Built with ❤️ for better test automation.
