const axios = require('axios');
const cheerio = require('cheerio');
const { Client } = require('pg');
const express = require("express")
const cors = require("cors")
const app = express()

app.use(cors({
    origin: "*",
    // optionsSuccessStatus: 200
}));

app.use(express.json())

app.post('/', async (req, res) => {
    console.log("req received")
    console.log(req.body)
    const url = `https://de.indeed.com/jobs?q=${req.body.jobTitle}&l=&from=searchOnDesktopSerp`;
    const apiKey = "be608c635565a46f7d18b61113ffe3df9f2e6cda"
    try {
        const response = await axios({
            url: 'https://api.zenrows.com/v1/',
            method: 'GET',
            params: {
                'url': url,
                'apikey': apiKey,
                'js_render': 'true',
                'premium_proxy': 'true',
            },
        })
        const $ = cheerio.load(response.data);
        const jobs = [];
        $('li.css-5lfssm').each((index, element) => {
            const title = $(element).find('[id^="jobTitle"]').text().trim();
            const company = $(element).find('[data-testid="company-name"]').text().trim();
            const location = $(element).find('[data-testid="text-location"]').text().trim();
            jobs.push({ company, title, location });
        })

        // for (const job of jobs) {
        //     try {
        //         await client.query(
        //           'INSERT INTO jobs (title, company, location) VALUES ($1, $2, $3)',
        //           [job.title, job.company, job.location]
        //         );
        //     } catch (error) {
        //         console.log(error)
        //     }
        //   }
        console.log(jobs)
        res.json(JSON.stringify({ jobs }))
    } catch (error) {
        console.log(error)
    }
})
app.get('/', (req, res) => {
    res.send("request done")
})

app.listen(5000, () => console.log('Server is running on localhost:5000'));