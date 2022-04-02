const puppeteer = require("puppeteer");

let fs = require("fs");
const request = require("request");

const downloadImage = async (url, path) => {
	let imageFolder = path.split("/")[0];
	if (!fs.existsSync(imageFolder)) {
		fs.mkdirSync(imageFolder);
	}

	request(url).pipe(fs.createWriteStream(path));
};

const formatTitle = (title) =>title.replace(/\s+/g, "-").toLowerCase().replace(/\d{4}/g, ""); //prettier-ignore

const getBrand = (title) => title.split("-")[0];

const formatPrice = (price) => price.replace(/[a-zA-Z]/g, "").trim().replace(/[$]/g, ""); //prettier-ignore

const generateRandomNumber = (min, max ) => Math.floor(Math.random() * (max - min + 1)) + min; //prettier-ignore

const getSnowboardSizes = () => {
	const sizes = [
		"138",
		"142",
		"146",
		"150",
		"158",
		"164",
		"148",
		"152",
		"162",
		"168",
	];
	const numberOfSizes = generateRandomNumber(1, 6);

	// pluck random sizes
	const randomSizes = sizes
		.sort(() => 0.5 - Math.random())
		.slice(0, numberOfSizes);

	return randomSizes;
};

// let writeStream = fs.createWriteStream('index.csv');
const startScrape = async (urlToScrape, fileName, category) => {
	const browser = await puppeteer.launch({
		headless: false,
		defaultViewport: { width: 1260, height: 1260 },
	});
	const page = await browser.newPage();
	await page.goto(urlToScrape);
	// Click an element
	await page.waitForSelector(".product-thumb");
	const links = await page.$$eval(".product-thumb-link", (thums) =>
		thums.map((thum) => thum.href)
	);
	// Click an element
	let data = [];
	while (links.length != 0) {
		const url = links.shift();
		await page.goto(url);
		await page.waitForSelector(".pdp-content-section-body");
		let description = "";
		try {
			description = await page.$eval(
				"div.pdp-details-content p",
				(h5) => h5.innerText
			);
		} catch (error) {}

		let title = await page.$eval(
			"h1.pdp-header-title",
			(h1) => h1.innerText
		);
		let formattedTitle = formatTitle(title);

		let brand = getBrand(formattedTitle);

		let price = 0;
		try {
			price = await page.$eval(
				"span.pdp-price-display",
				(span) => span.innerText
			);
			price = formatPrice(price);
		} catch (err) {}

		console.log(price);

		let stock = price > 0 ? generateRandomNumber(1, 250) : 0;

		const image = await page.$eval(".pdp-hero-image", (img) => img.src);
		const imageName = `${Date.now()}.jpg`;
		const imagePath = `images/${imageName}`;
		await downloadImage(image, imagePath);

		let sizes = getSnowboardSizes();

		let obj = {
			title: title,
			formattedTitle: formattedTitle,
			brand: brand,
			description: description,
			image: imageName,
			price: price,
			sized: sizes,
			stock: stock,
		};
		data.push(obj);
		imagesSrc = [];
		await page.goto(urlToScrape);
	}
	fs.writeFile(fileName, JSON.stringify(data), (err) => {
		if (err) throw err;
		console.log("File created");
	});

	// Close pupeteer
	await browser.close();
};

startScrape(
	"https://www.evo.com/shop/snowboard/snowboards/kids",
	"kids-snowboards.json"
);
