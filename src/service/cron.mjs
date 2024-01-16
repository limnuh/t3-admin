import cron from 'node-cron';

cron.schedule('12 * * * *', () => {
  console.log('Running a task every hour :12 minute');

  // run through every search, scrape data, save and create history of cars
});

cron.schedule('0 0 * * *', () => {
  console.log('Running a task every midnight');

  // create agregated data about the current search data (without scrape)
});
