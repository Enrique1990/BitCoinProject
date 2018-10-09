const results = document.querySelector(".container");
const btnSetPrice = document.querySelector("#btnSetPrice");

class BitCoin {
 constructor(price) {
   this.price = price;
   this.data = [];
   this.rates = [];
   this.rate = 0;
   this.tabla = [];
   this.getPrices();
 }

 getPrices() {
   $.ajax({
     url: "https://bitpay.com/api/rates",
     dataType: "json",
     success: data => {
       this.data = data;
       this.getRates();
     },
     error: error => {
       console.log("There was an error");
     }
   });
 }

 setPrice() {
   var nprice = prompt("Please enter a new code", "New Code");
   if (nprice != null) {
     this.price = nprice.toUpperCase();
     this.validate();
   }
 }

 refresh() {
   results.innerHTML = "";
   this.validate();
 }

 validate() {
   this.data.forEach(fcode => {
     if (fcode.code === this.price) {
       this.getPrices();
     }
   });
 }

 getRates() {
   var usd = this.getUSD();
   var eur = this.getEUR();
   var gbp = this.getGBP();
   var epj = this.getEPJ();
   var cad = this.getCAD();

   this.rates.push(usd);
   this.rates.push(eur);
   this.rates.push(gbp);
   this.rates.push(epj);
   this.rates.push(cad);
   this.rates.push(this.getNewCoin(this.price));
   this.tabla.push("BTC/" + this.price);
   this.displayTable();
 }

 getNewCoin(btc) {
   btc = btc.toUpperCase();
   let nbtc = this.data.filter(nbt => nbt.code === btc);
   this.rate = nbtc[0].rate;
   return nbtc[0].rate;
 }

 getUSD() {
   var usd = this.data.filter(usd => usd.code === "USD");
   this.tabla.push("BTC/USD");
   return usd[0].rate;
 }
 getEUR() {
   var eur = this.data.filter(eur => eur.code === "EUR");
   this.tabla.push("BTC/EUR");
   return eur[0].rate;
 }
 getGBP() {
   var gbp = this.data.filter(gbp => gbp.code === "GBP");
   this.tabla.push("BTC/GBP");
   return gbp[0].rate;
 }
 getEPJ() {
   var jpy = this.data.filter(jpy => jpy.code === "JPY");
   this.tabla.push("BTC/JPY");
   return jpy[0].rate;
 }
 getCAD() {
   var cad = this.data.filter(cad => cad.code === "CAD");
   this.tabla.push("BTC/CAD");
   return cad[0].rate;
 }

 displayTable() {
   let _tabla = new Set(this.tabla);
   let tabla = [];
   for (let t of _tabla) {
     tabla.push(t);
   }
   let _rate = new Set(this.rates);
   let rate = [];
   for (let j of _rate) {
     rate.push(j);
   }

   let data = `
     <table>
     <thead>
       <tr>
       <th>Price </th>
   `;

   for (let i = 0; i < tabla.length; i++) {
     data += `

     <th>${tabla[i]}</th>

     `;
   }

   data += ` </tr>
   </thead>
   <tbody>
    <tr> <td>1</td>`;

   let _row = ``;

   for (let k = 0; k < rate.length; k++) {
     _row += `
     <td>${rate[k]}</td>
     `;
   }
   _row += ` </tr>
   </tbody>
   </table>
   `;

   data += _row;

   results.innerHTML = data;
 }
}

let newBT = new BitCoin("ALL");

btnSetPrice.addEventListener("click", () => {
 newBT.setPrice();
});




