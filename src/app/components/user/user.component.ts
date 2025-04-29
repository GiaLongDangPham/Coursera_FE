import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    userForm: FormGroup;
    users: User[] = [];
    p: number = 1;
    editingIndex: number | null = null;

    constructor(private fb: FormBuilder, private userService: UserService) {
        this.userForm = this.fb.group({
            id: ['', Validators.required],
            username: ['', [Validators.required]],
            password: ['12345678', [Validators.required, Validators.minLength(8)]],
            dob: ['2000-09-09'],
            fname: ['Gia'],
            lname: ['Long'],
            email: ['gialong@gmail.com', [Validators.required, Validators.email]],
            phone: ['0123456789'],
        });
    }

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.userService.getAllUsers().subscribe({
            next: (res) => {
                this.users = res.result; 
            },
            error: (err) => alert("Không thể load người dùng: " + err.error.message)
        });
    }

    isValidAge(dob: string): boolean {
        const birthDate = new Date(dob);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        return age >= 13;
    }

    submitForm() {
        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched();
            alert('Vui lòng nhập đầy đủ và đúng định dạng!');
            return;
        }
    
        if (this.editingIndex !== null) {
            this.userService.updateUser(this.userForm.value).subscribe({
                next: () => {
                    // alert('Cập nhật người dùng thành công.');
                    Swal.fire('Thành công!', 'Đã cập nhật người dùng.', 'success'),
                    this.editingIndex = null;
                    this.userForm.reset();
                    
                },
                error: (err) => {
                    Swal.fire('Lỗi', err.error?.message || 'Không xác định', 'error');
                },
                complete: () => {
                    this.loadUsers();
                }
            });
        } else {
            this.userService.insertUser(this.userForm.value).subscribe({
                next: () => {
                    Swal.fire('Thành công!', 'Đã thêm người dùng.', 'success'),
                    this.userForm.reset();
                },
                error: (err) => {
                    Swal.fire('Lỗi', err.error?.message || 'Không xác định', 'error');
                },
                complete: () => {
                    this.loadUsers();
                }
            });
        }
    }
    

    editUser(user: User) {
        this.userForm.patchValue(user);
        this.editingIndex = 1;
    }

    deleteUser(id: number) {
        Swal.fire({
            title: 'Bạn chắc chắn muốn xoá người dùng này?',
            html: `
              <p>Hành động này sẽ xóa cả:</p>
              <ul style="text-align: left;">
                <li>Địa chỉ người dùng</li>
                <li>Các vai trò, các đánh giá và những chứng chỉ của người này</li>
                <li>Các buổi học của người này đã học</li>
              </ul>
              <p>Bạn có thể chọn Xoá tất cả để xóa cả các đơn hàng, mã giảm giá, các khóa học người này cung cấp, ...</p>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xoá',
            denyButtonText: 'Xoá tất cả',
            showDenyButton: true,
            cancelButtonText: 'Huỷ',
            focusCancel: true
        }).then((result) => {
            debugger
            if (result.isConfirmed || result.isDenied) {
                const force = result.isDenied; // nếu chọn "Xoá cưỡng bức" thì true
                this.userService.deleteUser(id, force).subscribe({
                    next: () => Swal.fire('Thành công!', 'Đã xoá người dùng.', 'success'),
                    error: err => Swal.fire('Lỗi', err.error?.message || 'Không xác định', 'error'),
                    complete: () => this.loadUsers()
                });
            }
        });
    }

    cancelEdit() {
        this.editingIndex = null;
        this.userForm.reset();
    }
    
}
