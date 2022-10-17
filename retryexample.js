import fetch from "node-fetch";
//const fetch = require('node-fetch');

const fetchWithRetry = (url, numberOfRetry) => {
    return new Promise((resolve, reject) => {
        let attempts = 1;

        const fetch_retry = (url, n) => {

            return fetch(url).then(res => {

                const status = res.status;

                if(status === 200) {
                    return resolve(res);
                }
                else if (n === 1) {
                    throw reject("Error in getting http data");
                }
                else {
                    console.log("Retry again: Got back " + status);
                    console.log("With delay " + attempts * 3000);
                    setTimeout(() => {
                        attempts++;

                        fetch_retry(url, n - 1);
                    }, attempts * 3000);
                }
            }).catch(function (error) {
                if (n === 1) {
                    reject(error)
                }
                else {
                    setTimeout(() => {
                        attempts++
                        fetch_retry(url, n - 1);
                    }, attempts * 3000);
                }
            });
        }
        return fetch_retry(url, numberOfRetry);
    });
}

fetchWithRetry("https://httpbin.org/status/200,408", 3).then(x => console.log("Finally " + x.status)).catch(e => {
    console.log(e);
});
