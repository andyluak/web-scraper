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
		headless: true,
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
		/*
		let terrain = "",
			ability_level ="",
			rocker_type ="",
			shape="",
			flex_rating="",
			core=""

		try {
			terrain = await page.$eval('li.spec-terrain .pdp-spec-list-description', (span) => span.innerText); //prettier-ignore
		} catch (err) {}

		try {
			ability_level = await page.$eval('li.spec-ability-level .pdp-spec-list-description', (span) => span.innerText); //prettier-ignore
		} catch (err) {}

		try { 
			rocker_type = await page.$eval('li.spec-rocker-type .pdp-spec-list-description', (span) => span.innerText); //prettier-ignore
		} catch (err) {}

		try {
			shape = await page.$eval('li.spec-shape .pdp-spec-list-description', (span) => span.innerText); //prettier-ignore
		} catch (err) {}

		try {
			flex_rating = await page.$eval('li.spec-flex-rating .pdp-spec-list-description', (span) => span.innerText); //prettier-ignore
		} catch (err) {}

		try {
			core = await page.$eval('li.spec-core-laminates .pdp-spec-list-description', (span) => span.innerText); //prettier-ignore
		} catch (err) {}

		console.log(terrain,ability_level,rocker_type,shape,flex_rating,core);
**/

		/*
		let ability_level, flex_rating, lacing_system, binding_style;
		try {
			ability_level = await page.$eval('li.spec-ability-level .pdp-spec-list-description', (span) => span.innerText); //prettier-ignore
			flex_rating = await page.$eval('li.spec-flex-rating .pdp-spec-list-description', (span) => span.innerText); //prettier-ignore
			lacing_system = await page.$eval('li.spec-lacing-system .pdp-spec-list-description', (span) => span.innerText); //prettier-ignore
			binding_style = await page.$eval('li.spec-binding-style .pdp-spec-list-description', (span) => span.innerText); //prettier-ignore
		} catch (err) {}
		console.log(ability_level, flex_rating, lacing_system, binding_style);
*/
		let ability_level, flex_rating, binding_style;

		/*
		try {
			ability_level = await page.$eval('li.spec-ability-level .pdp-spec-list-description', (span) => span.innerText); //prettier-ignore
			flex_rating = await page.$eval('li.spec-flex-rating .pdp-spec-list-description', (span) => span.innerText); //prettier-ignore
			binding_style = await page.$eval('li.spec-binding-style .pdp-spec-list-description', (span) => span.innerText); //prettier-ignore
		} catch (err) {}
		console.log(ability_level, flex_rating, binding_style);
*/
		/*
		let material,
			style,
			venting,
			audio,
			removable_ear_pads,
			adjustable_fit,
			weight;

		try {
			material = await page.$eval( 'li.spec-material .pdp-spec-list-description', (span) => span.innerText); //prettier-ignore
			style = await page.$eval( 'li.spec-helmet-style .pdp-spec-list-description', (span) => span.innerText); //prettier-ignore
			venting = await page.$eval( 'li.spec-helmet-venting .pdp-spec-list-description', (span) => span.innerText); //prettier-ignore
			audio = await page.$eval( 'li.spec-audio .pdp-spec-list-description', (span) => span.innerText); //prettier-ignore
			removable_ear_pads = await page.$eval( 'li.spec-removable-ear-pads .pdp-spec-list-description', (span) => span.innerText); //prettier-ignore
			adjustable_fit = await page.$eval( 'li.spec-adjustable-fit .pdp-spec-list-description', (span) => span.innerText); //prettier-ignore
			weight = await page.$eval( 'li.spec-weight .pdp-spec-list-description', (span) => span.innerText); //prettier-ignore
		} catch (err) {}

		console.log(
			material,
			style,
			venting,
			audio,
			removable_ear_pads,
			adjustable_fit,
			weight
		);
		*/

		/*
		let frameSize, lens_type, quick_lens, helmet_compatible;

		try {
			frameSize = await page.$eval( 'li.spec-frame-size .pdp-spec-list-description', (span) => span.innerText); //prettier-ignore
			lens_type = await page.$eval( 'li.spec-lens-type .pdp-spec-list-description', (span) => span.innerText); //prettier-ignore
			quick_lens = await page.$eval( 'li.spec-quick-changing-lens-system .pdp-spec-list-description', (span) => span.innerText); //prettier-ignore
			helmet_compatible = await page.$eval( 'li.spec-helmet-compatible .pdp-spec-list-description', (span) => span.innerText); //prettier-ignore
		} catch (err) {}

		console.log(frameSize, lens_type, quick_lens, helmet_compatible);
		*/

		let glove_warmth, material, insulation, cuff_style;

		try {
			glove_warmth = await page.$eval( 'li.spec-glove-warmth .pdp-spec-list-description', (span) => span.innerText); //prettier-ignore
			material = await page.$eval( 'li.spec-material .pdp-spec-list-description', (span) => span.innerText); //prettier-ignore
			insulation = await page.$eval( 'li.spec-insulation .pdp-spec-list-description', (span) => span.innerText); //prettier-ignore
			cuff_style = await page.$eval( 'li.spec-cuff-style .pdp-spec-list-description', (span) => span.innerText); //prettier-ignore
		} catch (err) {}

		console.log(glove_warmth, material, insulation, cuff_style);
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
			sized: ["S", "M", "L", "XL"],
			stock: stock,
			type: "beanies",
			gender: "men",
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
	"https://www.evo.com/shop/snowboard/gloves/kids/s_average-rating-desc",
	"zkids_gloves.json"
);
/* 
SNOWBOARDS 
https://www.evo.com/shop/snowboard/snowboards/womens/rpp_200
https://www.evo.com/shop/snowboard/snowboards/mens/rpp_200
https://www.evo.com/shop/snowboard/snowboards/boys/girls/kids/s_average-rating-desc/rpp_200

BOOTS 
https://www.evo.com/shop/snowboard/boots/mens/price_150-200/price_200-300/price_300-500/price_500-700/flex-rating_medium/flex-rating_soft/flex-rating_stiff/flex-rating_very-stiff/s_price-desc/rpp_200
https://www.evo.com/shop/snowboard/boots/womens/price_150-200/price_200-300/price_300-500/price_500-700/flex-rating_medium/flex-rating_soft/flex-rating_stiff/flex-rating_very-stiff/s_price-desc/rpp_200
https://www.evo.com/shop/snowboard/boots/boys/girls/kids/price_100-150/price_150-200/price_200-300/price_300-500/price_500-700/price_50-100/flex-rating_medium/flex-rating_soft/flex-rating_stiff/flex-rating_very-stiff/s_price-desc/rpp_200

BINDINGS 
https://www.evo.com/shop/snowboard/bindings/mens/flex-rating_medium/flex-rating_soft/flex-rating_stiff/flex-rating_very-stiff/rpp_200
https://www.evo.com/shop/snowboard/bindings/womens/flex-rating_medium/flex-rating_soft/flex-rating_stiff/flex-rating_very-stiff/s_average-rating-desc/rpp_200
https://www.evo.com/shop/snowboard/bindings/boys/girls/kids/flex-rating_medium/flex-rating_soft/flex-rating_stiff/flex-rating_very-stiff/s_average-rating-desc/rpp_200

HELMETS 

https://www.evo.com/shop/snowboard/helmets/mens/s_price-desc/rpp_200
https://www.evo.com/shop/snowboard/helmets/womens/s_price-desc/rpp_200
https://www.evo.com/shop/snowboard/helmets/boys/girls/kids/s_price-desc/rpp_200

GOGGLES 

https://www.evo.com/shop/snowboard/goggles/mens/s_price-desc/rpp_100
https://www.evo.com/shop/snowboard/goggles/womens/s_price-desc/rpp_100
https://www.evo.com/shop/snowboard/goggles/boys/girls/kids/s_price-desc/rpp_200

GLOVES

https://www.evo.com/shop/snowboard/gloves/mens/s_average-rating-desc
https://www.evo.com/shop/snowboard/gloves/womens/s_average-rating-desc
https://www.evo.com/shop/snowboard/gloves/kids/s_average-rating-desc

*/
