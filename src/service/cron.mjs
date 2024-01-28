import axios from 'axios';
import cron from 'node-cron';

const triggerDataCollect = async () => {
  try {
    await axios.get('http://127.0.0.1:3000/api/scraper/collect');
  } catch (error) {
    //
  }
};

cron.schedule('21 * * * *', () => {
  console.log('Running a task every hour :19 minute');
  triggerDataCollect().catch(() => {
    // do nothing
  });
  // run through every search, scrape data, save and create history of cars
});

cron.schedule('0 0 * * *', () => {
  console.log('Running a task every midnight (do nothing now)');

  // create agregated data about the current search data (without scrape)
});
