const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
let fs = require("fs")
const { writeToPath } = require('@fast-csv/format');

// let writeStream = fs.createWriteStream('index.csv');
const startScrape =  async (urlToScrape, fileName) => {
	const browser = await puppeteer.launch({headless: false, defaultViewport: { width: 1260, height: 1260 } });
	const page = await browser.newPage();
	await page.goto(urlToScrape);
	// Click an element
	await page.waitForSelector('.product-thumb');
	const links = await page.$$eval('.product-thumb-link', (thums) => thums.map(thum => thum.href));
	// Click an element
	let data  = [];
	while( links.length > 30 ) {
		const url = links.shift();
		await page.goto(url);
		await page.waitForSelector('.pdp-content-section-body');
		let description = await page.$eval('.pdp-content-section-body .pdp-feature .pdp-feature-description span', (h5) => h5.innerText);
		let title = await page.$eval('h1.pdp-header-title', (h1) => h1.innerText);
		let price = await page.$eval('span.pdp-price-regular', (span) => span.innerText);
		let image = await page.$eval('img.pdp-hero-image', (img) => img.src);
		let obj = {
			title: title,
			description: description,
			image: image,
			price: price,
		};
		data.push(obj);

		await page.goto(urlToScrape);
	}
	writeToPath(fileName, data, { headers: true });


	// Close pupeteer
	await browser.close();
};

module.exports = {
	startScrape
};