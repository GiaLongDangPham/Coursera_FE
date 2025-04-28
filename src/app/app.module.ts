import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule} from '@angular/common/http';
import { UserComponent } from './components/user/user.component'
import { NgxPaginationModule } from 'ngx-pagination';
import { ReviewComponent } from './components/review/review.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';

@NgModule({
  declarations: [    
    HeaderComponent,
    FooterComponent, 
    UserComponent, 
    ReviewComponent, 
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    NgxPaginationModule,
    AppRoutingModule
  ],
  providers: [
    
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
