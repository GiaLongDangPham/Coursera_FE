import { Component } from '@angular/core';

@Component({
  selector: 'app-root',  // Đặt selector để Angular nhận diện component này
  templateUrl: './app.component.html',  // Template HTML của component
  styleUrls: ['./app.component.scss']  // CSS của component
})
export class AppComponent {
  title = 'ShopappAngular';  // Biến title có thể sử dụng trong template
}
