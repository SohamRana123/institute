const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting dashboard access test...');
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: null
  });
  
  try {
    const page = await browser.newPage();
    
    // Enable console log from the browser
    page.on('console', msg => console.log('BROWSER:', msg.text()));
    
    // Enable request logging
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        console.log(`REQUEST: ${request.method()} ${request.url()}`);
        const headers = request.headers();
        if (headers.authorization) {
          console.log(`Authorization header: ${headers.authorization.substring(0, 20)}...`);
        }
      }
    });
    
    // Enable response logging
    page.on('response', async response => {
      if (response.url().includes('/api/')) {
        console.log(`RESPONSE: ${response.status()} ${response.url()}`);
        try {
          const contentType = response.headers()['content-type'];
          if (contentType && contentType.includes('application/json')) {
            const responseBody = await response.json();
            console.log('Response body:', JSON.stringify(responseBody, null, 2));
          }
        } catch (e) {
          console.log('Could not parse response body');
        }
      }
    });
    
    // Step 1: Navigate to login page
    console.log('\n1. Navigating to login page...');
    await page.goto('http://localhost:3000/teacher-login', { waitUntil: 'networkidle0' });
    
    // Step 2: Fill in login form
    console.log('\n2. Filling login form...');
    await page.type('input[name="email"]', 'teacher@institute.com');
    await page.type('input[name="password"]', 'password123');
    
    // Step 3: Submit login form
    console.log('\n3. Submitting login form...');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    
    // Step 4: Check if redirected to dashboard
    console.log('\n4. Checking current URL...');
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('/teacher-dashboard')) {
      console.log('✅ Successfully redirected to dashboard');
    } else {
      console.log('❌ Failed to redirect to dashboard');
    }
    
    // Step 5: Check cookies
    console.log('\n5. Checking cookies...');
    const cookies = await page.cookies();
    console.log('Cookies:', cookies.map(c => `${c.name}=${c.value ? 'present' : 'empty'}`));
    
    // Step 6: Check if dashboard content is loaded
    console.log('\n6. Checking dashboard content...');
    try {
      await page.waitForSelector('h1', { timeout: 5000 });
      const heading = await page.$eval('h1', el => el.textContent);
      console.log(`Dashboard heading: ${heading}`);
      console.log('✅ Dashboard content loaded successfully');
    } catch (error) {
      console.log('❌ Failed to load dashboard content:', error.message);
    }
    
    // Step 7: Test direct navigation to dashboard in a new tab
    console.log('\n7. Testing direct navigation to dashboard in a new tab...');
    const newPage = await browser.newPage();
    
    // Enable console log from the browser for new tab
    newPage.on('console', msg => console.log('BROWSER (new tab):', msg.text()));
    
    await newPage.goto('http://localhost:3000/teacher-dashboard', { waitUntil: 'networkidle0' });
    
    const newTabUrl = newPage.url();
    console.log(`New tab URL: ${newTabUrl}`);
    
    if (newTabUrl.includes('/teacher-dashboard')) {
      console.log('✅ Successfully accessed dashboard directly');
    } else {
      console.log('❌ Failed to access dashboard directly, redirected to:', newTabUrl);
    }
    
    // Step 8: Check if dashboard content is loaded in new tab
    console.log('\n8. Checking dashboard content in new tab...');
    try {
      await newPage.waitForSelector('h1', { timeout: 5000 });
      const heading = await newPage.$eval('h1', el => el.textContent);
      console.log(`Dashboard heading in new tab: ${heading}`);
      console.log('✅ Dashboard content loaded successfully in new tab');
    } catch (error) {
      console.log('❌ Failed to load dashboard content in new tab:', error.message);
    }
    
    console.log('\nTest completed!');
  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await browser.close();
  }
})();