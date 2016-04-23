# offix-web

## Running

The application depends on [MongoDB](https://www.mongodb.org/) running on
localhost.

To install the dependencies, run `npm install`. To run the application, run
`npm start`.

## Configuration

Copy `config.sample.js` to `config.js` and fill in configuration options there.

## Development Tips

* Symlink `config.js -> config.sample.js` during development so you don't have
  to keep making changes in both files. You can do this by running
  `ln -s config.sample.js config.js`.
