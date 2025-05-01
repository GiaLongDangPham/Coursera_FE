// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './components/user/user.component'
import { ReviewComponent } from './components/review/review.component';
import { HotCourseComponent } from './components/hot-course/hot-course.component';

const routes: Routes = [
    { path: 'app-user', component: UserComponent },
    { path: 'app-review', component: ReviewComponent },
    { path: 'app-hot-course', component: HotCourseComponent },
    { path: '', redirectTo: '/app-user', pathMatch: 'full' }  // Đặt đường dẫn mặc định
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
