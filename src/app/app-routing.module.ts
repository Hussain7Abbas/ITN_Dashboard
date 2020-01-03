import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { SignalsComponent } from './signals/signals.component';
import { InvestorsComponent } from './investors/investors.component';
import { StocksComponent } from './stocks/stocks.component';
import { SettingsComponent } from './settings/settings.component';


const routes: Routes = [
  {path: "", redirectTo: "home", pathMatch: "full"},
  {path: "home", component:HomeComponent},
  {path: "users", component:UsersComponent},
  {path: "signals", component:SignalsComponent},
  {path: "investors", component:InvestorsComponent},
  {path: "stocks", component:StocksComponent},
  {path: "settings", component:SettingsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
