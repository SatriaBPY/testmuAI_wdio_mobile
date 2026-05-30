import { Before , After, Status} from "@wdio/cucumber-framework";
import { driver } from "@wdio/globals";

const APP_PACKAGE = 'io.testsmith.practicesoftwaretesting';
const APP_ACTIVITY = '.MainActivity';


Before({ tags: '@reset', timeout: 15000 }, async () => {
    console.log('🔄 Resetting application state...');
    
    try {
        const isRunning = await driver.isAppInstalled(APP_PACKAGE);
        
        if (!isRunning) {
            console.log('App not installed, something wrong!');
            return;
        }
        
        await driver.executeScript('mobile: shell', [{
            command: 'am',
            args: ['force-stop', APP_PACKAGE]
        }]);
        
        console.log('✓ App force stopped');
        await driver.pause(500);
        
        // Clear app data (optional - for complete reset)
        // await driver.executeScript('mobile: shell', [{
        //     command: 'pm',
        //     args: ['clear', APP_PACKAGE]
        // }]);
        
        await driver.executeScript('mobile: shell', [{
            command: 'am',
            args: ['start', '-n', `${APP_PACKAGE}/${APP_ACTIVITY}`]
        }]);
        
        await driver.pause(2000);
        
        console.log('✓ App restarted successfully');
        
    } catch (error) {
        console.error('❌ Failed to reset app:', error);
        
        console.log('Trying fallback method...');
        await driver.terminateApp(APP_PACKAGE);
        await driver.pause(1000);
        await driver.activateApp(APP_PACKAGE);
        await driver.pause(2000);
    }
});

// After(async function (scenario) {
//     const isPassed = scenario.result?.status === 'PASSED';
//     const status = isPassed ? 'passed' : 'failed';
    
//     try {
//         await driver.execute(`lambda-status=${status}`);
//         console.log(`✅ Test status updated to: ${status}`);
//     } catch (error) {
//         console.error(`❌ Failed to update status: ${error}`);
//     }
// });