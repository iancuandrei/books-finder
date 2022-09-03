const puppeteer = require('puppeteer');
const promptUser = require('prompt-sync')();

const init = async () => {
	console.log('Loading genres...');
	let browser = await puppeteer.launch();
	let page = await browser.newPage();

	// access goodreads page
	await page.goto('https://www.goodreads.com/choiceawards/best-books-2020');

	// get all of the genres displayed on the page and store them in an array
	const genres: string[] = await page.$$eval('.categoryContainer h4', (genres: []) => {
		return genres.map((genre: HTMLElement) => genre.innerText);
	});

	// check if genres were scraped successfully
	if (!genres || !(genres.length > 0)) {
		console.log("Couldn't get genres.");
		process.exit();
	}

	// prompt user for genre
	// keep asking until user enters a valid input
	let pickedGenre: number;
	do {
		console.table(genres);

		// use index entered by the user to find genre in array and save it in the pickedGenre variable
		pickedGenre = Number(promptUser('Please choose a genre: '));

		// check if user chose a valid genre
		if (!genres[pickedGenre]) {
			console.log('Invalid input. Please choose a valid genre.');
		}
	} while (!genres[pickedGenre]);

	console.log('Picking book...');

	// get genres page links
	const genresLinks: string[] = await page.$$eval('.categoryContainer h4', (headings: []) =>
		headings.map((heading: HTMLElement) => {
			return heading.closest('a')?.href;
		})
	);

	if (!genresLinks) {
		console.log("Couldn't get genres links.");
		process.exit();
	}

	// navigate to the selected genre
	await Promise.all([page.goto(genresLinks[pickedGenre]), page.waitForNavigation()]);

	// get all book titles
	const books: string[] = await page.$$eval('.tooltipTrigger img', (books: []) => {
		return books.map((book: HTMLElement) => book.getAttribute('alt'));
	});

	// check if books are found
	if (!books) {
		console.log("Couldn't find book.");
		process.exit();
	}

	// pick a random book from the list
	const pickedBook: string = books[Math.floor(Math.random() * books.length)];

	console.log('Picked book: ' + pickedBook);
	console.log('Finding book on Amazon...');

	// close headless browser
	await browser.close();

	// open chromium and navigate to amazon.com
	browser = await puppeteer.launch({ headless: false, defaultViewport: null });
	page = await browser.newPage();
	await page.goto('https://www.amazon.com/');

	// add book title in the search input
	await page.evaluate(async (pickedBook: number) => {
		const searchInput: HTMLInputElement = document.querySelector('#twotabsearchtextbox')! as HTMLInputElement;
		if (searchInput) {
			searchInput.value = pickedBook + ' paperback';
		}
	}, pickedBook);

	// click search button
	await page.click('#nav-search-submit-button');

	await page.waitForNavigation();

	// open book page
	await page.click('.s-result-item h2 .a-link-normal');

	await page.waitForNavigation();

	// click buy now button
	await page.click('#buy-now-button');
};

init();
