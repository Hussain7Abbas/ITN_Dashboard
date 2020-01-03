import { Component, OnInit, HostListener } from '@angular/core';
import { DatabaseServiceProvider } from "../database-provider.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  apiUrl = this.ITNDB.apiUrl;

  user = {
    idUs: <string> "000",
    name: <string> " ",
    phone: <Number> 0,
    gender: <Boolean> true,
    address: <string> " ",
    XM: <string> "",
    TNFX: <string> "",
    joinDay: <string> this.ITNDB.getDateTime("dateTime"),
    joinDate: <string> this.ITNDB.getDateTime("date")
  };

  XM = {id: '', password: ''}
  TNFX = {id: '', password: ''}

  users = [];

  editIdUs = "add";

  search = {searchCol: 'name', searchText: ''};

  dataCount = 0;

  loadingData = false;
  loadDataTimeOut;

  constructor(public ITNDB: DatabaseServiceProvider) { }

  ngOnInit() {
    this.loadData("2700-26-10 00:00:00");
  }

  @HostListener('window:scroll', [])
  onScroll(){
    clearTimeout(this.loadDataTimeOut);
    this.loadDataTimeOut = setTimeout(() => {
      if (!this.loadingData) {
        if (Number(window.pageYOffset + window.innerHeight) == Number(document.documentElement.scrollHeight)) {
          if (this.users.length < this.dataCount) {
            this.loadingData = true
            this.loadData(this.users[this.users.length -1].joinDay);
          }
        }
      }
    }, 1000);
  }

  loadData(joinDay: string){
    document.getElementById('loadingSVG').style.display= "block";
    this.ITNDB.getData("users", joinDay).then(users=>{
      this.dataCount = Number(String(users['message']).split('-')[0]);
      users["data"].forEach(user => {
        this.users.push(user);
      });
      console.log(this.users);
    }).then(()=>{document.getElementById('loadingSVG').style.display= "none"; this.loadingData = false;})
  }


  openModal(){
    this.editIdUs = "add";
    this.user = {idUs: "", name: " ", phone: 0, gender: true, address: " ", XM: "", TNFX: "", joinDay: this.ITNDB.getDateTime("dateTime"), joinDate: this.ITNDB.getDateTime("date")};
    this.XM = {id: '', password: ''}; this.TNFX = {id: '', password: ''};
    document.getElementById('modal-body').classList.remove('noDelayAnimation');
    document.getElementById('modal-body').style.display= "block";
    document.getElementById('modal').style.display= "flex";
}
  cancelModal(){document.getElementById('modal').style.display= "none";}

  saveModal(){
    this.user.idUs = this.XM.id;
    this.user.XM = this.XM.id + "#7#" + this.XM.password;
    this.user.TNFX = this.TNFX.id + "#7#" + this.TNFX.password;

    if (this.editIdUs == "add") {
      this.ITNDB.addData("users", this.user).then(user=>{
        this.users.unshift(user);
        this.dataCount += 1;
      });
    } else {
      this.ITNDB.updateData("users", this.user, this.editIdUs).then(()=>{});
    }
    document.getElementById('modal').style.display= "none";
  }

  deleteUser(idUs: string, i){
    document.getElementById(idUs).classList.add('rotateOutDownLeft');
    this.ITNDB.deleteData("users", idUs);
    setTimeout(() => {
      this.users.splice(i, 1);
      this.dataCount -= 1;
    }, 1000);
  }

  editUser(user){
    this.editIdUs = user.idUs;
    this.user = user;
    this.XM.id = this.user.XM.split('#7#')[0]; this.XM.password = this.user.XM.split('#7#')[1];
    this.TNFX.id = this.user.TNFX.split('#7#')[0]; this.TNFX.password = this.user.TNFX.split('#7#')[1];
    document.getElementById('modal').style.display= "flex";
  }

  rejoinUser(user){
    this.user = user;
    this.user.joinDay = this.ITNDB.getDateTime("dateTime");
    this.ITNDB.updateData("users", this.user, user.idUs)
  }

  searchUsers(){
    this.users = [];
    document.getElementById('loadingSVG').style.display= "block";
    document.getElementById('noSearchResults').style.display= "none";
    if (this.search.searchText == "") {
      this.loadData("2700-26-10 00:00:00");
    } else {
      this.ITNDB.searchData("users", this.search.searchCol , this.search.searchText).then(results=>{
        this.users = results['data'];
        this.dataCount = Number(String(results['message']).split('-')[0]);
        if (this.users.length == 0){
          document.getElementById('noSearchResults').style.display= "flex";
        }
        document.getElementById('loadingSVG').style.display= "none";
      });
    }
  }
  searchCross(){if (this.search.searchText == "") {document.getElementById('searchCross').style.display= "none";}else{document.getElementById('searchCross').style.display= "inline-flex";}}
  searchCancel(){this.search.searchText = ""; this.searchUsers();}

  userDays(joinDay: string){
    let date = new Date();
    let joinDayArray = String(joinDay.valueOf().toString().split(" ")[0]).split("-");
    let realJoinDay: Number = Number(joinDayArray[0] + joinDayArray[1] + joinDayArray[2]);
    return 30 - (Number(String(date.getFullYear()) + String(date.getMonth() + 1).padStart(2, '0') + String(date.getDate()).padStart(2, '0')) - Number(realJoinDay));
  }

}
