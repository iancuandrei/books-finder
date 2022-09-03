# Books Finder

Choose a genre and a random book will be picked and added to your shopping cart on Amazon.
The app was developed and tested on Ubuntu WSL 2 running on Windows 11.

## Usage

Clone repository

```bash
git clone https://github.com/iancuandrei/books-finder.git
```

Start app

```bash
cd books-finder && npm install && npm run build-start
```

## Technologies Used

- Node.js
- TypeScript
- Puppeteer

## Possible Improvements

- Make sure that the picked book on Amazon is the right one. Check if the title and the author are the same by looking in the html elements that contain them.
- Right now I'm assuming that the paperback version of the book is in stock. We can check if the paperback version is in stock and if it isn't, check the other versions (hardcover, kindle, audiobook).
- If the paperback version isn't in stock, the "buy now" button might change, so that needs to be addressed.
