const axios = require('axios');
const { default: chalk } = require('chalk');
const cheerio = require('cheerio');
const readlineSync = require('readline-sync');
const fs = require('fs');

const url = 'https://generator.email/inbox6/';

function encodeBase64(str) {
    return Buffer.from(str).toString('base64');
}

const { faker } = require('@faker-js/faker');



function randomEmail(domain = 'gmailku.my.id') {
    const firstName = faker.person.firstName();  // Menggunakan faker.person.firstName()
    const lastName = faker.person.lastName();

    const cleanFirstName = firstName.replace(/[^a-zA-Z]/g, ''); 
    const cleanLastName = lastName.replace(/[^a-zA-Z]/g, '');   

    const emailName = `${cleanFirstName.toLowerCase()}1${cleanLastName.toLowerCase()}`;

    return {
        name: emailName,
        email: `${emailName}@${domain}`
    };
}
async function register(email, password) {
    console.log(`    Registration with email ${email} in process..`)
    if (!email || typeof email !== 'string') {
        throw new Error('Email harus berupa string');
    }

    if (!password || typeof password !== 'string') {
        throw new Error('Password harus berupa string');
    }

    const encodedPassword = encodeBase64(password);
    
    const data = {
        password: encodedPassword, 
        rePassword: encodedPassword, 
        username: "NEW_USER_NAME_02", 
        email: email 
    };

    try {
        const response = await axios.post('https://gw.sosovalue.com/usercenter/email/anno/sendRegisterVerifyCode/V2', data);
        console.log(chalk.green(`    Registration with email ${email} succeed`))
        console.log(chalk.cyan(`    Waiting for email verification code....`))
        return response.data; 
    } catch (error) {
        console.error(chalk.red('[-] Error:', error.response ? error.response.data : error.message));
        throw error; 
    }
}

async function verifEmail(email, password, verifyCode, invitationCode) {
    if (!email || typeof email !== 'string') {
        throw new Error('Email harus berupa string');
    }
    if (!password || typeof password !== 'string') {
        throw new Error('Password harus berupa string');
    }
    if (!verifyCode || typeof verifyCode !== 'string') {
        throw new Error('VerifyCode harus berupa string');
    }
    if (!invitationCode || typeof invitationCode !== 'string') {
        throw new Error('InvitationCode harus berupa string');
    }

    const encodedPassword = encodeBase64(password);

    const data = {
        password: encodedPassword,
        rePassword: encodedPassword, 
        username: "NEW_USER_NAME_02", 
        email: email,
        verifyCode: verifyCode,
        invitationCode: invitationCode,
        invitationFrom: null
    };

    try {
        const response = await axios.post('https://gw.sosovalue.com/usercenter/user/anno/v3/register', data);
        if(response.data.code === 0){
            console.log(chalk.bgGreen(`[-] Account successfully created with referral code ${invitationCode}`)); 
        }
        return response.data; 
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error; 
    }
}



async function getOTPLogin(email) {
    if (!email || typeof email !== 'string') {
        throw new Error('Email harus berupa string');
    }

    const data = {
        email: email
    };

    try {
        const response = await axios.post('https://gw.sosovalue.com/usercenter/email/anno/sendNewDeviceVerifyCode', data);
        if(response.data.code === 0){
            console.log(chalk.cyan(`    OTP code successfully sent`)); 
        }
        return response.data; 
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error; 
    }
}


async function verifLogin(email, password, verifyCode) {
    if (!email || typeof email !== 'string') {
        throw new Error('Email harus berupa string');
    }
    if (!password || typeof password !== 'string') {
        throw new Error('Password harus berupa string');
    }
    if (!verifyCode || typeof verifyCode !== 'string') {
        throw new Error('VerifyCode harus berupa string');
    }
    
    const encodedPassword = encodeBase64(password);

    const data = {
		isDifferent: true,
        password: encodedPassword,
        loginName: email,
		type: 'portal',
        verifyCode: verifyCode,
    };

    try {
        const response = await axios.post('https://gw.sosovalue.com/authentication/auth/v2/emailPasswordLogin', data);
        if(response.data.code === 0){
            console.log(chalk.bold.green(`    Successful login, your wallet address ${response.data.data.walletAddress}`)); 
        }
        return response.data; 
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error; 
    }
}

async function loginToken(token, email,passwords) {
  try {
    const response = await axios.get('https://gw.sosovalue.com/authentication/user/getUserInfo', {
      headers: {
        'Authorization': `Bearer ${token}`,
        
      }
    });
	fs.appendFileSync('results.txt', `${email}|${passwords}|${response.data.data.invitationCode}|isRobot: ${response.data.data.isRobot}|isSuspicious: ${response.data.data.isSuspicious}\n`, 'utf8');

    return response;

  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}



async function getOTP(email,index = 0) {
  try {
    const response = await axios.get(url, {
      headers: {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'max-age=0',
        'cookie': `_gid=GA1.2.2095327855.1735069411; __gads=ID=52c0ef95ece1dcd3:T=1723296851:RT=1735074556:S=ALNI_MY-N05jLZ5xHVJagROLPVaB7iMLRw; __gpi=UID=00000ebb7726ad8a:T=1723296851:RT=1735074556:S=ALNI_MZmpm9iDReVIrzNmydV67PPYNJhQw; __eoi=ID=50b40b8c429867d1:T=1723296851:RT=1735074556:S=AA-AfjYcohPcYMEyMXK2GgCw44zC; embx=%5B%kudanil%40gmailku.my.id%22%2C%${email}%40gmailku.my.id%22%5D; _gat_gtag_UA_35796116_32=1; _ga=GA1.2.1660632963.1723296850; surl=gmailku.my.id/${email}; FCNEC=%5B%5B%22AKsRol-Lci8hCqIvO_xclbprHLQSsPjFOFt6Pu7w2kyTOo7Ahz83hFD5UlFG9kiq9pVZq23iGbdhLjdGucomp2CbWu2ZinNJRZYX3Xox3-XDAQ1imUiw8JveMOGFIHmDhh-EG1jHAFbEhKA-9N1aQd-DPg26Dn263A%3D%3D%22%5D%5D; _ga_1GPPTBHNKN=GS1.1.1735073618.15.1.1735074641.40.0.0`,
        'priority': 'u=0, i',
        'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
      }
    });

    const html = response.data;

    const $ = cheerio.load(html);

    const containerElements = $('.e7m.container.to1').eq(2).html();
    const regex = /SoSoValue\s*-\s*(\d+)/;
    const match = containerElements.match(regex);
    if (match) {
        console.log(chalk.green("    Code OTP: ", match[index].replace('SoSoValue - ','').trim()));
        return match[index].replace('SoSoValue - ','').trim();
      } else {
        return false;
      }

  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
(async () => {
	
    const invite = readlineSync.question('[+] Invite code: ');
    const password = readlineSync.question('[+] Password: '); 
    const jumlahAkun = readlineSync.questionInt('[+] Number of Accounts You Wish to Create: ');

    for (let i = 0; i < jumlahAkun; i++) {
        console.log(chalk.bgMagenta(`[+] Creating Account -${i + 1}:`));

        const randEmail = randomEmail(); 

        const regis = await register(randEmail.email, password);
        if(regis.code !== 0){
            console.log(chalk.bold.red(`    Email ${randEmail.email} Already Used for Another Account`))
            continue;
        }

        let otp = false;
        while (otp === false) {
            otp = await getOTP(randEmail.name); 
           
        }

        const verif = await verifEmail(randEmail.email, password, otp, invite);

        console.log(`    Account ${i + 1} Created Successfully: ${randEmail.email}`);
		console.log(`    Trying to Login to Account ${randEmail.email}`);
		const regLogin = await getOTPLogin(randEmail.email);
		if(regLogin.code !== 0){
				console.log(chalk.bold.red(`    Login request failed, account skin ${randEmail.email}`));
				continue;
		}
		await delay(5000);
		let optLogin = false;
	
		while (optLogin === false) {
            optLogin = await getOTP(randEmail.name,1); 
           
        }
		const verifLogins = await verifLogin(randEmail.email,password,optLogin);
		if(verifLogins.code !== 0){
			console.log(chalk.bold.red(`    Login request failed, account skin ${randEmail.email}`));
			continue;
		}
		const login = await loginToken(verifLogins.data.token,randEmail.email,password);
		if(login.data.code !== 0){
			console.log(chalk.bold.red(`    Login request failed, account skin ${randEmail.email}`))
			continue;
		}
		console.log(`    Successfully logged in with data:`)
		console.log(chalk.bold.cyan(`     -> Username: ${login.data.data.username}`));
		console.log(chalk.bold.cyan(`     -> invitationCode: ${login.data.data.invitationCode}`));
		console.log(chalk.bold.cyan(`     -> totalInvitations: ${login.data.data.totalInvitations}`));
		console.log(chalk.bold.cyan(`     -> isRobot: ${login.data.data.isRobot}`));
		console.log(chalk.bold.cyan(`     -> isSuspicious: ${login.data.data.isSuspicious}`));
		console.log(chalk.bold.cyan(`     -> walletAddress: ${verifLogins.data.walletAddress}`));
    }

  console.log("\n=== End of Process ===\n");

	
})();
