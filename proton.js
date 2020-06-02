const puppeteer = require('puppeteer');
const request = require('request');
const querystring = require('querystring');
const cryptoRandomString = require('crypto-random-string');
const crypto = require('crypto');

const verbose = false;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

async function delay(ms) {
  return await new Promise(resolve => setTimeout(resolve, ms));
}

	
(async() => {

	var browser, pg;
	var load_pg =  await new Promise(function(resolve, reject) {(async function load_pg() {  
	try {
	
		var email, emlprm;
		
		request({
                    url : 'https://generator.email/'
            }, function (error, response, body) {
			if (verbose) console.error('error:', error); // Print the error if one occurred
			if (verbose) console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
			email = body.substr(body.indexOf('id="email_ch_text">')+19);
			email = email.substring(0,email.indexOf('<'));
			emlprm = email.split('@');
			emlprm = querystring.stringify({ surl: emlprm[1]+'/'+emlprm[0]});
			if (verbose) console.log('disposable email: '+email);
			
		});
		
		await delay(1000);
		
	   browser = await puppeteer.launch({headless: true, args: ['--disable-web-security']});	
	   pg = await browser.newPage();
	   
	   //puppeteer anti detection measures:  https://intoli.com/blog/not-possible-to-block-chrome-headless/
	   // Pass the User-Agent Test.
	   await pg.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
		// Pass the Webdriver Test. 
		await pg.evaluateOnNewDocument(() => {
		  Object.defineProperty(navigator, 'webdriver', {
		    get: () => false,
		  });
		});	   
	   // Pass the Permissions Test.
	   await pg.evaluateOnNewDocument(() => {
		  const originalQuery = window.navigator.permissions.query;
		  return window.navigator.permissions.query = (parameters) => (
		    parameters.name === 'notifications' ?
		      Promise.resolve({ state: Notification.permission }) :
		      originalQuery(parameters)
		  );
	   });
	   if (verbose) console.log('pptr anti detection measures applied')
	   await delay(100);
	   	   
	   await pg.goto('https://account.protonvpn.com/signup',{waitUntil: 'load', timeout: 0});	 
	   if (verbose) console.log('on first signup page');
	   await pg.waitForSelector('button.pm-button--primary', { timeout: 0});
	   await pg.click('div.plan-card:nth-child(1) > div:nth-child(3) > button:nth-child(4)');	
		if (verbose) console.log('signup form page');

		var uname = cryptoRandomString({length: 13, characters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'});
		console.log('username: '+uname);
		var pwd = cryptoRandomString({length: 20, characters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_!.'});
		console.log('pwd: '+pwd);
		console.log('email: '+email)
		await delay(10000);
		for(let i=0;i<1;i++){
			await delay(500);
			await pg.keyboard.press('Tab');	
			if (verbose) console.log('pressed tab');
		}
		await pg.keyboard.type(uname, {delay: 100});
		await delay(500);
		await pg.keyboard.press('Tab');	
		if (verbose) console.log('pressed tab');	
		await pg.keyboard.type(pwd, {delay: 100});
		await delay(500);
		await pg.keyboard.press('Tab');	
		if (verbose) console.log('pressed tab');	
		await pg.keyboard.type(pwd, {delay: 100});
		await delay(500);
		await pg.keyboard.press('Tab');	
		if (verbose) console.log('pressed tab');	
		await pg.keyboard.type(email, {delay: 100});		
		await delay(500);
		for(let i=0;i<3;i++){
			await delay(500);
			await pg.keyboard.press('Tab');	
			if (verbose) console.log('pressed tab');
		}		
		await pg.keyboard.press('Enter');		
		if (verbose) console.log('pressed return');			
		
		await delay(10000);
		for(let i=0;i<3;i++){
			await delay(500);
			await pg.keyboard.press('Tab');	
			if (verbose) console.log('pressed tab');
		}		
		await pg.keyboard.press('Enter');		
		if (verbose) console.log('pressed return');	
		//wait 40 seconds to ensure verification email sent/recd
		await delay(40000);
		var vcode;
		//check disposable email for verification code
		request({
                    url : 'https://generator.email/',
                    headers : {'Cookie' : emlprm}
            }, function (error, response, body) {
			vcode = body.substr(body.indexOf('Proton verification code')+24);
			vcode = vcode.substring(vcode.indexOf('2em">')+5,vcode.indexOf('</code>'));
			if (verbose) console.log('code : '+vcode);
		});
		await delay(5000);
		await pg.keyboard.type(vcode, {delay: 100});
		await delay(500);
		await pg.keyboard.press('Tab');	
		if (verbose) console.log('pressed tab');	
		await delay(500);
		await pg.keyboard.press('Enter');		
		if (verbose) console.log('pressed return');	
		await delay(5000);
		console.log('try your new ProtonVPN account ;-)')
		browser.close();
		
				
   } catch(e) {
   	console.log('loading page failed, retrying...');
   	await delay(1000);
   	browser.close();
   	return load_pg();
   };
   })();});   
   

	
	
})();
