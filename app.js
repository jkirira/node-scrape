const axios = require('axios')
const cheerio = require('cheerio');
const { children } = require('cheerio/lib/api/traversing');
const express = require('express')
const connection = require('./connection')

const port = process.env.PORT || 3000;

const app = express()



const base_url = 'https://www.myjobmag.co.ke'

var currentpagejobs = []

function getPageURLs(url){

    axios(url)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            job_divs = $('.job-info');
            job_divs.each((i, job_div) => {
                $(job_div).children().each((i, ul) => {

                    if ( $(ul).children('.sub-job-sec').html() ){

                        sub_job_list = $(ul).children('.sub-job-sec').children('ul')
                        $(sub_job_list).children().each((i, li) => {

                            job_title = $(li).text()
                            job_url = $(li).children('a').attr('href')
                            
                            currentpagejobs.push( { job_title: job_title, job_url : job_url } )
                            
                        })
                    } else {
                        job_title = $(ul).children('.mag-b').text().trim()
                        job_url = $(ul).children('.mag-b').children('h2').children('a').attr('href')
                                
                        currentpagejobs.push( { job_title: job_title, job_url : job_url } )   
                    }
                    
                })
            })

            // console.log(currentpagejobs)
            // console.log("---------------------------------")
            // console.log("---------------------------------")

    }).then(() => {
        scrape()
    })
   
}


function scrape(){
    if(currentpagejobs.length > 1){
        currentpagejobs.forEach((link) => {
            job_page = base_url + link.job_url
            console.log(job_page)
            axios(job_page)
                .then(response => {
                    const page_html = response.data
                    const $$ = cheerio.load(page_html)
                    job_data = []
                    job_data["company"] = $$('.job-industry').children().first().next().text().replace(/View Jobs at\s/, '')
                    job_data["job_name"] = $$('.read-h1').children().first().text().trim()
                    job_data["posted_at"] = $$('#posted-date').last().text().replace(/Posted:\s/, '')
                    job_data["deadline"] = $$('.read-date-sec').children().first().next().text().replace(/Deadline:\s/, '')

                    // console.log(job_data['job_name']+" ; "+job_data['posted_at']+" ; "+job_data['deadline'])
                    // console.log(deadline)
                    job_data["job_type"] = $$('.job-key-info').children().first().children('.jkey-info').text()
                    job_data["qualification"] = $$('.job-key-info').children().first().next().children('.jkey-info').text()
                    job_data["experience"] = $$('.job-key-info').children().first().next().next().children('.jkey-info').text()
                    job_data["location"] = $$('.job-key-info').children().first().next().next().next().children('.jkey-info').text()
                    job_data["job_field"] = $$('.job-key-info').children().last().children('.jkey-info').text().trim()
                    return job_data
                    // console.log(job_data)
                }).then((job_data) => {
                    
                    console.log('jobs', job_data)
                    query = "INSERT INTO jobs SET ?"
                    connection.query(query, job_data, (err) => {
                        if(err) throw err;
                        console.log("record inserted!")
                    })
                })
        })
    } else {
        console.log(currentpagejobs)
        console.log('error')
    }
}



function getPages(x){
    for(i=0; i<x; i++){
        currenturl = base_url + "/page/" + (i+1)
        getPageURLs(currenturl)
    }
};


getPages(1)




app.listen(port, () => {
    console.log("server running")
})