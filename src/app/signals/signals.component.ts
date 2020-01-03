import { Component, OnInit, HostListener } from '@angular/core';
import { DatabaseServiceProvider } from "../database-provider.service";

@Component({
  selector: 'app-signals',
  templateUrl: './signals.component.html',
  styleUrls: ['./signals.component.css']
})
export class SignalsComponent implements OnInit {

  apiUrl = this.ITNDB.apiUrl;

  signal = {
    action: <Boolean> true,
    pairs: <string> "",
    tp: <Number> 0.0,
    sl: <Number> 0.0,
    lotXM: <Number> 1,
    lotTNFX: <Number> 1,
    status: <Boolean> true,
    date: <string> this.ITNDB.getDateTime("dateTime")
  };

  signals = [];

  editidSi = "add";

  search = {searchCol: 'pairs', searchText: ''};

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
          if (this.signals.length < this.dataCount) {
            this.loadingData = true
            this.loadData(this.signals[this.signals.length -1].idSi);
          }
        }
      }
    }, 1000);
  }

  loadData(idSi: string){
    document.getElementById('loadingSVG').style.display= "block";
    this.ITNDB.getData("signals", idSi).then(signals=>{
      this.dataCount = Number(String(signals['message']).split('-')[0]);
      signals["data"].forEach(signal => {
        this.signals.push(signal);
      });
      console.log(this.signals);
    }).then(()=>{document.getElementById('loadingSVG').style.display= "none"; this.loadingData = false;})
  }

  openModal(){
    this.editidSi = "add";
    this.signal = {action: true, pairs: "", tp: 0.0, sl: 0.0, lotXM: 1, lotTNFX: 1, status: true, date: this.ITNDB.getDateTime("dateTime")};
    document.getElementById('modal-body').classList.remove('noDelayAnimation');
    document.getElementById('modal-body').style.display= "block";
    document.getElementById('modal').style.display= "flex";
}
  cancelModal(){document.getElementById('modal').style.display= "none";}

  saveModal(){
    if (this.editidSi == "add") {
      this.ITNDB.addData("signals", this.signal).then(signal=>{
        this.signals.unshift(signal);
        this.dataCount += 1;
      });
    } else {
      this.ITNDB.updateData("signals", this.signal, this.editidSi).then(()=>{});
    }
    document.getElementById('modal').style.display= "none";
  }

  deleteSignal(idSi: string, i){
    document.getElementById(idSi).classList.add('rotateOutDownLeft');
    this.ITNDB.deleteData("signals", idSi);
    setTimeout(() => {
      this.signals.splice(i, 1);
      this.dataCount -= 1;
    }, 1000);
  }

  editSignal(signal){
    this.editidSi = signal.idSi;
    this.signal = signal;
    document.getElementById('modal').style.display= "flex";
  }

  closeSignal(idSi: string, i){
    this.signals[i].status = false;
    this.ITNDB.updateData("signals", {status: false}, idSi).then(()=>{
    });
  }

  searchSignals(){
    this.signals = [];
    document.getElementById('loadingSVG').style.display= "block";
    document.getElementById('noSearchResults').style.display= "none";
    if (this.search.searchText == "") {
      this.loadData("9999");
    } else {
      if (this.search.searchCol == 'action') {if (this.search.searchText == 'شراء') {this.search.searchText = "1"}else if (this.search.searchText == 'بيع'){this.search.searchText = "0"}}
      this.ITNDB.searchData("signals", this.search.searchCol , this.search.searchText).then(results=>{
        this.signals = results['data'];
        this.dataCount = Number(String(results['message']).split('-')[0]);
        if (this.signals.length == 0){
          document.getElementById('noSearchResults').style.display= "flex";
        }
        document.getElementById('loadingSVG').style.display= "none";
      });
    }
  }
  searchCross(){if (this.search.searchText == "") {document.getElementById('searchCross').style.display= "none";}else{document.getElementById('searchCross').style.display= "inline-flex";}}
  searchCancel(){this.search.searchText = ""; this.searchSignals();}

  getAction(action:boolean){if (action) {return "شراء"}else{return "بيع"}}
  cardClass(status: boolean, action: boolean){if (status) {if (action) {return "card-buy"}else{return "card-sell"}}else{return "card-close"}}
  cardImg(status: boolean, action: boolean){if (status) {if (action) {return "buyIcon.png"}else{return "sellIcon.png"}}else{if (action) {return "buyIconB.png"}else{return "sellIconB.png"}}}

}
