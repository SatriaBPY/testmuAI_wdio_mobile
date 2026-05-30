import WDIOReporter from '@wdio/reporter';

export default class CustomReporter extends WDIOReporter {
    constructor(options) {
        super(options);
        console.log('✅ Custom Reporter initialized!');
    }

    onSuiteStart(suite) {
        console.log(`\n📁 Feature: ${suite.title}`);
        console.log('.'.repeat(50));
        
        if (suite.tests && suite.tests.length > 0) {
            suite.tests.forEach(test => {
                console.log(`📝 Scenario: ${test.title}`);
            });
        }
    }

    onTestPass(test) {
        console.log(`✅ PASSED: ${test.title}`);
    }

    onTestFail(test) {
        console.log(`❌ FAILED: ${test.title}`);
        if (test.error) {
            console.log(`Error: ${test.error.message}`);
        }
    }

    onSuiteEnd(suite) {
        console.log(`\n✅ Feature completed: ${suite.title}`);
        console.log('.'.repeat(50) + '\n');
    }
}