import { Component, OnInit, HostListener } from '@angular/core';
import { DatabaseServiceProvider } from "../database-provider.service";

@Component({
  selector: 'app-investors',
  templateUrl: './investors.component.html',
  styleUrls: ['./investors.component.css']
})
export class InvestorsComponent implements OnInit {

  apiUrl = this.ITNDB.apiUrl;

  investor = {
    name: <string> " ",
    phone: <Number> 0,
    email: <string> " ",
    price: <Number> 0,
    date: <string> this.ITNDB.getDateTime("dateTime")
  };

  investors = [];

  editidIn = "add";

  search = {searchCol: 'name', searchText: ''};

  dataCount = 0;

  loadingData = false;
  loadDataTimeOut;

  constructor(public ITNDB: DatabaseServiceProvider) { }

  ngOnInit() {
    this.loadData("9999");
  }

  @HostListener('window:scroll', [])
  onScroll(){
    clearTimeout(this.loadDataTimeOut);
    this.loadDataTimeOut = setTimeout(() => {
      if (!this.loadingData) {
        if (Number(window.pageYOffset + window.innerHeight) == Number(document.documentElement.scrollHeight)) {
          if (this.investors.length < this.dataCount) {
            this.loadingData = true
            this.loadData(this.investors[this.investors.length -1].idIn);
          }
        }
      }
    }, 1000);
  }

  loadData(idIn: string){
    document.getElementById('loadingSVG').style.display= "block";
    this.ITNDB.getData("investors", idIn).then(investors=>{
      this.dataCount = Number(String(investors['message']).split('-')[0]);
      investors["data"].forEach(investor => {
        this.investors.push(investor);
      });
      console.log(this.investors);
    }).then(()=>{document.getElementById('loadingSVG').style.display= "none"; this.loadingData = false;})
  }

  openModal(){
    this.editidIn = "add";
    this.investor = {name: " ", phone: 0, email: " ", price: 0, date: this.ITNDB.getDateTime("dateTime")};
    document.getElementById('modal-body').classList.remove('noDelayAnimation');
    document.getElementById('modal-body').style.display= "block";
    document.getElementById('modal').style.display= "flex";
}
  cancelModal(){document.getElementById('modal').style.display= "none";}

  saveModal(){
    if (this.editidIn == "add") {
      this.ITNDB.addData("investors", this.investor).then(investor=>{
        this.investors.unshift(investor);
        this.dataCount += 1;
      });
    } else {
      this.ITNDB.updateData("investors", this.investor, this.editidIn).then(()=>{});
    }
    document.getElementById('modal').style.display= "none";
  }

  deleteinvestor(idIn: string, i){
    document.getElementById(idIn).classList.add('rotateOutDownLeft');
    this.ITNDB.deleteData("investors", idIn);
    setTimeout(() => {
      this.investors.splice(i, 1);
      this.dataCount -= 1;
    }, 1000);
  }

  editinvestor(investor){
    this.editidIn = investor.idIn;
    this.investor = investor;
    document.getElementById('modal').style.display= "flex";
  }

  closeinvestor(idIn: string, i){
    this.investors[i].status = false;
    this.ITNDB.updateData("investors", {status: false}, idIn).then(()=>{
    });
  }

  searchinvestors(){
    this.investors = [];
    document.getElementById('loadingSVG').style.display= "block";
    document.getElementById('noSearchResults').style.display= "none";
    if (this.search.searchText == "") {
      this.loadData("9999");
    } else {
      this.ITNDB.searchData("investors", this.search.searchCol , this.search.searchText).then(results=>{
        this.investors = results['data'];
        this.dataCount = Number(String(results['message']).split('-')[0]);
        if (this.investors.length == 0){
          document.getElementById('noSearchResults').style.display= "flex";
        }
        document.getElementById('loadingSVG').style.display= "none";
      });
    }
  }
  searchCross(){if (this.search.searchText == "") {document.getElementById('searchCross').style.display= "none";}else{document.getElementById('searchCross').style.display= "inline-flex";}}
  searchCancel(){this.search.searchText = ""; this.searchinvestors();}

  convertToPrice(price: Number){return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}

}
