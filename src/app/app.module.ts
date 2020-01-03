import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { SignalsComponent } from './signals/signals.component';
import { InvestorsComponent } from './investors/investors.component';
import { StocksComponent } from './stocks/stocks.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SettingsComponent } from './settings/settings.component';
import { DatabaseServiceProvider } from "./database-provider.service";
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UsersComponent,
    SignalsComponent,
    InvestorsComponent,
    StocksComponent,
    SidebarComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [DatabaseServiceProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
