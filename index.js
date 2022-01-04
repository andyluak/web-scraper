/** https://www.evo.com/shop/snowboard/snowboards */

const PORT = 12347;

const { default: axios } = require('axios');
const axions = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const fs = require('fs');

const url = 'https://www.evo.com/shop/snowboard/snowboards';

let results = [];
axios(url)
.then( response => {
	let html = response.data
	const $ = cheerio.load(html);
	$('.product-thumb-details').each(function(i, elem) {
		const name = $(this).find('.product-thumb-title').text();
		const price = $(this).find('.product-thumb-price').text();
		const image = $(this).find('.product-thumb-image').attr('src');
		const link = 'evo.com' + $(this).find('.product-thumb-link').attr('href');
		const data = {
			name: name,
			price: price,
			image: image,
			link: link
		};
		results.push(data);

	});
	fs.writeFile ("input.json", JSON.stringify(results), function(err) {
		if (err) throw err;
		console.log('complete');
		}
	);
})

// Init express
const app = express();

app.listen( PORT, ()=> console.log('sal running on port ' + PORT ) );

