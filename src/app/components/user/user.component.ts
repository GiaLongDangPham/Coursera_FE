import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

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
                    alert('Cập nhật người dùng thành công.');
                    this.editingIndex = null;
                    this.userForm.reset();
                    
                },
                error: (err) => {
                    console.error(err);
                    alert('Error: ' + (err.error?.message || 'Không xác định'));
                },
                complete: () => {
                    this.loadUsers();
                }
            });
        } else {
            this.userService.insertUser(this.userForm.value).subscribe({
                next: () => {
                    alert('Thêm người dùng thành công.');
                    this.userForm.reset();
                },
                error: (err) => {
                    console.error(err);
                    alert('Error: ' + (err.error?.message || 'Không xác định'));
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
        const confirmDelete = confirm('Bạn có chắc chắn muốn xóa người dùng này không?');
        if (!confirmDelete) return;
        this.userService.deleteUser(id).subscribe({
            next: () => {
                alert('Xóa người dùng thành công.');
            },
            error: (err) => {
                console.error(err);
                alert('Error: ' + (err.error?.message || 'Không xác định'));
            },
            complete: () => {
                this.loadUsers();
            }
        });
    }

    cancelEdit() {
        this.editingIndex = null;
        this.userForm.reset();
    }
    
}
