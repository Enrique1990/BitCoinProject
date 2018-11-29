const displayPrice = document.querySelector(".prices");
const add = document.querySelector("#new");
const remove = document.querySelector("#remove");
const newsFeed = document.querySelector(".news_feed");

const API_KEY = "aa695439154f43959bae54898c751f12";

class PriceDisplay {
    constructor(country) {
        this.country = country;
        this.addPrice();
        this.getFlag();
        localStorage[this.country.code] = JSON.stringify(this.country);
    }

    addPrice() {
        displayPrice.innerHTML += `
            <div class = "price_container" id=${this.country.code}>
                <!--Flag Container-->
                <div class="flag_container"></div>
                <!--Price Container-->
                <div class="price">
                    <div>${this.country.name}</div>
                    <div>${this.country.rate}</div>
                </div>
                <!--Change Container-->
                <div class = "change">
                    <div> Change % </div>
                    <div>
                        ${
                            (localStorage.getItem(this.country.code) === null) ? "0.00%" :
                                ((((this.country.rate) - (JSON.parse(localStorage.getItem(this.country.code)
                                ).rate)) / (JSON.parse(localStorage.getItem(this.country.code)).rate)) * 100).toFixed(2)

                        } 
                    </div>
                </div>
            </div>
       `
    }

    getFlag() {
        fetch(`http://api.techlaunch.io:89/flags/${this.country.code}`)
            .then(res => res.json())
            .then(data => {
                const flag_container = document.querySelector(`#${this.country.code} .flag_container`);
                flag_container.innerHTML = `
            <img src = "${data.icon}" alt = "flag icon">
            `
            })
            .catch(error => {
                console.error(error);
                console.error("There was an error");
            })
    }
}
class NewsContainer {
    constructor(article) {
        ;
        /*
        author: ""
   content: ""
   description: ""
   publishedAt: ""
   source: {id: null, name: ""}
   title: ""
   url: ""
   urlToImage: ""
   */
        this.article = article;
        this.addArticle();
    }
    addArticle() {
        newsFeed.innerHTML += `
         <div class ="news_container">
         <img src = "${this.article.urlToImage}" alt="Article Image">
         <div class ="title">
            <a href= "${this.article.url}">${this.article.title}</a>
         </div>
         <div class= "description">${this.truncateDescription(this.article.description)}</div>
         <footer>
         <span class="source">${this.article.source.name}</span>
         <span class="author">${this.article.author}</span>
         </footer>

         </div>
        `
    }
    truncateDescription(description) {
        return (description.length > 200) ? description.substring(0, 201) + "..." : description;
    }
}
class Bitcoin {
    constructor() {
        this.setDefaultCountries();
        this.getPrices();
        this.getNewsStories();
    }
    setDefaultCountries() {
        console.log("Running SetDefaultCountries");
        this.countries = [
            { index: 1, code: "BCH" },
            { index: 2, code: "USD" },
            { index: 3, code: "EUR" },
            { index: 4, code: "GBP" },
            { index: 5, code: "JPY" },
            { index: 6, code: "CAD" },
        ]
    }
    getPrices() {
        console.log("Running getPrices");
        fetch('https://bitpay.com/api/rates')
            .then(res => res.json())
            .then(data => {
                console.log(data);
                displayPrice.innerHTML = "";
                this.prices = data;
                this.setPrices();
            })
            .catch(error => {
                console.log(error);
                console.log("There was an error");
            })
    }
    setPrices() {
        console.log("Running setPrices");
        for (let i = 0; i < this.countries.length; i++) {
            new PriceDisplay(this.prices[this.countries[i].index]);

        }
    }
    addCountry() {
        console.log("Running addCountry");
        const countryCode = window.prompt("Which currency code do you want to add?");
        for (let i = 0; i < this.prices.length; i++) {
            if (countryCode.toUpperCase() === this.prices[i].code) {
                console.log("found it");
                this.countries.push(
                    {
                        index: i,
                        code: this.prices[i].code
                    }
                );
                this.getPrices();
                break;
            }
        }

    }
    removeCountry() {
        console.log("Running removeCountry");
        const countryCode = window.prompt("Which currency code to you want to remove?");
        for (let i = 0; i < this.countries.length; i++) {
            if(countryCode.toUpperCase()=== this.countries[i].code){  
            this.countries = [].concat(this.countries.slice(0, i)).concat(this.countries.slice(i + 1));
            this.getPrices();
            break;
            }
        }
    }
    getNewsStories() {
        console.log("Running getNewsStories");
        const date = `${new Date().getFullYear()}-${(new Date().getMonth)}-${new Date().getDate()}`
        fetch(`https://newsapi.org/v2/everything?q=bitcoin&from=${date}&sortBy=publishedAt&apiKey=${API_KEY}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                this.articles = data.articles;
                this.addNewsStories();
            })
            .catch(error => {
                console.log(error);
            })
    }
    addNewsStories() {
        console.log("Running addNewsStories");
        for (let i = 0; i < this.articles.length; i++) {
            new NewsContainer(this.articles[i]);
        }
    }


}
const bitcoin = new Bitcoin();

add.addEventListener("click", function () {
    bitcoin.addCountry()
})
remove.addEventListener("click", function (){
    bitcoin.removeCountry();
})
// const price = new PriceDisplay(
//     {
//         code:"USD",
//         name:"Test Country",
//         rate: 999.99
//     }
// );