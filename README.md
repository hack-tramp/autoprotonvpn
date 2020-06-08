# autoprotonvpn
requirements:<br>
- NodeJS (tested on v.10.16.0)<br>
- Puppeteer<br>

```
$node proton.js
username: pHaFaRi33coqh
pwd: 3.b._WDVxAxSf58fRxRs
email: 6belkhadsz@nypinterest.com
try your new ProtonVPN account ;-)
```

<b>What is it?</b><br>
<br>
Just run the NodeJS file and it will create a new ProtonVPN account, with a random username and password<br>
<br>
<b>How does it work?</b> <br>
<br>
This script uses disposable email from generator.email, and headless chrome (puppeteer)<br>
to fill out the registration form, receive the verification email at the disposable address,<br>
and complete the registration process.<br>
<br>
<b>Troubleshooting / to do</b><br><br>
This will only work as long as the email domains from generator.email are not blocked by ProtonVPN - sometimes they are, so just try again. 

Once ProtonVPN add protections such as recaptcha, this script will not work. 

To-do<br>
- delete verification email
- use promise / await version of requests module
