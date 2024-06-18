const puppeteer = require('puppeteer');
const mysql = require('mysql2/promise');
const { GoogleGenerativeAI } = require('@google/generative-ai');

require('dotenv').config();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function run(prompt) {
    prompt = prompt + " in 100 words";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
}

(async () => {
    // Create a MySQL connection
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'autoquora'
    });

    // Fetch credentials from the database
    const [rows] = await connection.execute('SELECT email, password FROM credentials LIMIT 1');
    const { email, password } = rows[0];

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto('https://www.quora.com/', { waitUntil: 'networkidle2' });
        console.log('Quora page loaded.');

        await page.waitForSelector('input[name=email]', { visible: true });
        await page.waitForSelector('input[name=password]', { visible: true });
        console.log('Login form appeared.');

        await page.type('input[name=email]', email, { delay: 100 });
        console.log('Email entered.');
        await page.type('input[name=password]', password, { delay: 100 });
        console.log('Password entered.');

        await page.keyboard.press('Enter');
        console.log('Login form submitted.');

        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });
        console.log('Login completed.');

        const keyword = 'NextJS';
        const searchURL = `https://www.quora.com/search?q=${encodeURIComponent(keyword)}`;
        await page.goto(searchURL, { waitUntil: 'networkidle2', timeout: 60000 });
        console.log(`Searching for keyword: ${keyword}`);

        // Wait for the answer buttons to appear
        await page.waitForSelector('button.q-click-wrapper', { visible: true, timeout: 10000 });

        // Click the first "Answer" button found
        await page.evaluate(() => {
            const buttons = document.querySelectorAll('button.q-click-wrapper');
            for (let button of buttons) {
                if (button.textContent.trim() === 'Answer') {
                    button.click();
                    break;
                }
            }
        });
        console.log('Answer button clicked.');

        // Wait for the text area to appear where the question is displayed
        await page.waitForSelector('div.q-box.qu-pt--small', { visible: true, timeout: 10000, delay: 5000 });
        console.log('Text area appeared.');

        // Wait for the question text to appear
        await page.waitForSelector('.ModalContainerInternal___StyledFlex-s8es4q-2.gXhqYs.modal_content_inner', { visible: true, timeout: 10000 });
        console.log('Question text appeared.');

        // Extract the question text associated with the answer button
        const questionText = await page.evaluate(() => {
            const element = document.querySelector('.CssComponent__CssInlineComponent-sc-1oskqb9-1.TitleText___StyledCssInlineComponent-sc-1hpb63h-0.hiLnej');
            return element ? element.innerText.trim() : null;
        });

        console.log('Question text:', questionText);
        const answer = await run(questionText);

        // Type the generated answer into the text area
        await page.type('div.q-box.qu-pt--small', '       ' + answer, { delay: 90 });
        console.log('Answer typed.');

        // Click the "Post" button to submit the answer
        await page.waitForSelector('button.q-click-wrapper.qu-bg--blue:not([disabled])', { visible: true });
        await page.evaluate(() => {
            const button = document.querySelector('button.q-click-wrapper.qu-bg--blue');
            if (button && button.textContent.trim() === 'Post') {
                button.click();
            }
        });
        console.log('Post button clicked.');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
        await connection.end();
        console.log('Browser closed and database connection closed.');
    }
})();
