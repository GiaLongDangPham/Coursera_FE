import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

    username: string = 'admin';
    password: string = '12345678';
    isLoggedIn: boolean = false; // Biến trạng thái đăng nhập

    loggedInUsername: string = '';

    constructor(private authService: AuthService) {}

    ngOnInit() {
        // Kiểm tra xem người dùng đã đăng nhập chưa
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            this.isLoggedIn = true; // Nếu đã đăng nhập, set biến isLoggedIn thành true
            this.loggedInUsername = localStorage.getItem('username') || '';
            this.hideOverlay(); // Ẩn lớp mờ
        } else {
            this.isLoggedIn = false; // Nếu chưa đăng nhập, hiển thị lớp mờ
            this.showOverlay();
        }
    }

    // Hiển thị lớp mờ
    showOverlay() {
        const overlay = document.getElementById('overlay');
        if (overlay) {
            overlay.style.display = 'block';
        }
    }

    // Ẩn lớp mờ
    hideOverlay() {
        const overlay = document.getElementById('overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    onLogin(): void {
        this.authService.login(this.username, this.password).subscribe({
            next: () => {
                Swal.fire('Thành công!', 'Đã đăng nhập thành công.', 'success');
                const modalElement = document.getElementById('loginModal');
                if (modalElement) {
                    const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
                    modalInstance.hide();
                }

                setTimeout(() => {
                    // Xóa backdrop nếu còn
                    const backdrop = document.querySelector('.modal-backdrop');
                    if (backdrop) backdrop.remove();

                    // Xóa class `modal-open` khỏi body
                    document.body.classList.remove('modal-open');

                    // Reset style overflow (Bootstrap đôi khi để lại overflow: hidden)
                    document.body.style.overflow = 'auto';
                    document.documentElement.style.overflow = 'auto';
                    document.body.style.paddingRight = '0';
                    // Nếu bạn có dùng width 100vw hoặc các layout chiếm hết màn hình
                    // thì có thể cần reset thêm:
                    document.body.style.width = 'auto';
                    document.documentElement.style.width = 'auto';
                }, 400); // Đợi modal đóng xong (Bootstrap fade: 300ms)

                // Lưu trạng thái đăng nhập vào localStorage để không hiển thị lớp mờ khi tải lại trang
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', this.username); // thêm dòng này

                this.isLoggedIn = true;
                this.loggedInUsername = this.username; // Cập nhật tên người dùng đã đăng nhập

                // Ẩn lớp mờ
                this.hideOverlay();

                this.username = '';
                this.password = '';
            },
            error: (err) => {
                alert('Error: ' + err.error.message);
            }
        });
    }

    onLogout(): void {
        localStorage.setItem('isLoggedIn', 'false');
        this.isLoggedIn = false;
        this.showOverlay(); // Hiển thị lại lớp mờ khi người dùng đăng xuất
    }

}
