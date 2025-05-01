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
// Import ModalModule từ ngx-bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
import { HotCourseComponent } from './components/hot-course/hot-course.component';
@NgModule({
  declarations: [    
    HeaderComponent,
    FooterComponent, 
    UserComponent, 
    ReviewComponent, 
    AppComponent, HotCourseComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    NgxPaginationModule,
    AppRoutingModule,
    ModalModule.forRoot()  // Thêm ModalModule vào imports
  ],
  providers: [
    
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
