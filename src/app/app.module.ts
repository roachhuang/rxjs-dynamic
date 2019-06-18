import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; 
import { FormsModule } from '@angular/forms';

import { ToArrayPipe } from './to-array.pipe';
import { AppComponent } from './app.component';
import { CounterComponent } from './counter.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ ToArrayPipe, AppComponent, CounterComponent  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
