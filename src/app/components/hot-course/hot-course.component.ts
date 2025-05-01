import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrendCourseService } from 'src/app/services/hot-trend.service';
import Swal from 'sweetalert2';
import { TrendCourseResponse } from '../../models/trend-course';

@Component({
    selector: 'app-hot-course',
    templateUrl: './hot-course.component.html',
    styleUrls: ['./hot-course.component.scss']
})
export class HotCourseComponent implements OnInit {

    trendCourseForm: FormGroup;
    resultData: TrendCourseResponse[] = [];
    filteredCourses: TrendCourseResponse[] = [];

    sortField: keyof TrendCourseResponse | '' = '';
    sortAsc = true;

    p: number = 1;
    
    constructor(
        private fb: FormBuilder,
        private trendCourseService: TrendCourseService
    ) {
        this.trendCourseForm = this.fb.group({
            date_desire: ['2024-04-01'],
            top: [10, [Validators.required, Validators.min(1)]],
            subject_name: ['']
        });
    }

    ngOnInit(): void {
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);

        const formattedDate = thirtyDaysAgo.toISOString().slice(0, 10);

        this.trendCourseForm.patchValue({
            date_desire: formattedDate,
            top: 10,
            subject_name: ''
        });

        // Gọi ban đầu
        this.getTrendedCourses();
    }

    getTrendedCourses(): void {
        const { date_desire, top, subject_name } = this.trendCourseForm.value;

        this.trendCourseService.getTrendingCourses(date_desire, top, subject_name).subscribe({
            next: (data) => {
                this.resultData = data || [];
                this.updateFilteredCourses();
            },
            error: (err) => {
                Swal.fire('Lỗi', err.error?.message || 'Không xác định', 'error');
            }
        });
    }

    updateFilteredCourses(): void {
        this.resultData.sort((a, b) => {
            const valueA = a[this.sortField as keyof TrendCourseResponse];
            const valueB = b[this.sortField as keyof TrendCourseResponse];

            if (typeof valueA === 'string' && typeof valueB === 'string') {
                return valueA.localeCompare(valueB) * (this.sortAsc ? 1 : -1);
            }
            return (valueA > valueB ? 1 : -1) * (this.sortAsc ? 1 : -1);
        });
    }

    sort(field: keyof TrendCourseResponse): void {
        if (this.sortField === field) {
            this.sortAsc = !this.sortAsc;
        } else {
            this.sortField = field;
            this.sortAsc = true;
        }
        this.updateFilteredCourses();
    }

    getSortIcon(field: keyof TrendCourseResponse): string {
        if (this.sortField !== field) return 'fa fa-sort';
        return this.sortAsc ? 'fa fa-sort-up' : 'fa fa-sort-down';
    }
}
