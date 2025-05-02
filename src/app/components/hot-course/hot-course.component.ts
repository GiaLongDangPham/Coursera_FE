import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TrendCourseService } from 'src/app/services/hot-trend.service';
import { debounceTime } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { TrendCourseResponse } from '../../models/trend-course';
import { SubjectService } from '../../services/subject.service';
@Component({
    selector: 'app-hot-course',
    templateUrl: './hot-course.component.html',
    styleUrls: ['./hot-course.component.scss']
})
export class HotCourseComponent implements OnInit, AfterViewInit {

    @ViewChild('subjectScrollContainer') subjectScrollContainer!: ElementRef<HTMLElement>;
    subjectList: string[] = ['Frontend', 'Backend', 'Database', 'AI', 'DevOps', 'Design',]; // hoặc lấy từ API
    subjectKeyword: string = '';  // Lọc theo chủ đề
    isLeftDisabled = true;
    isRightDisabled = false;
    subjectNameControl = new FormControl('');

    trendCourseForm: FormGroup;
    resultData: TrendCourseResponse[] = [];
    filteredCourses: TrendCourseResponse[] = [];

    sortField: keyof TrendCourseResponse | '' = '';
    sortAsc = true;

    p: number = 1;
    
    constructor(
        private fb: FormBuilder,
        private trendCourseService: TrendCourseService,
        private subjectService: SubjectService
    ) {
        const today = new Date();
        const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
        const formattedDate = thirtyDaysAgo.toISOString().split('T')[0]; // Định dạng 'yyyy-MM-dd'

        this.trendCourseForm = this.fb.group({
            date_desire: [formattedDate],
            top: [10, [Validators.required, Validators.min(1)]],
            subject_name: ['']
        });
    }

    ngAfterViewInit() {
        this.updateScrollButtons();
    }

    ngOnInit(): void {
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);

        const formattedDate = thirtyDaysAgo.toISOString().slice(0, 10);

        this.trendCourseForm.patchValue({
            date_desire: formattedDate,
            top: 10,
            // subject_name: ''
        });

        // Gọi ban đầu
        this.getTrendedCourses();

        this.subjectService.getAllSubjects().subscribe({
            next: (subjects) => {
                this.subjectList = subjects;
    
                // Đợi Angular render lại view mới update scroll
                setTimeout(() => {
                    this.updateScrollButtons();
                }, 0);
            },
            error: (err) => console.error('Lỗi khi load subject:', err)
        });

        this.subjectNameControl.valueChanges
                    .pipe(debounceTime(300))
                    .subscribe(() => this.getTrendedCourses());
    }

    getTrendedCourses(): void {
        const { date_desire, top} = this.trendCourseForm.value;
        const subject_name = this.subjectNameControl.value || this.subjectKeyword;
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

    scrollSubjects(direction: 'left' | 'right') {
        const container = this.subjectScrollContainer.nativeElement;
        const scrollAmount = 200;

        if (direction === 'left') {
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }

        // Wait for scroll animation
        setTimeout(() => this.updateScrollButtons(), 300);
    }

    onScroll() {
        this.updateScrollButtons();
    }

    updateScrollButtons() {
        const container = this.subjectScrollContainer.nativeElement;
        const scrollLeft = container.scrollLeft;
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;
    
        // Nếu không cần scroll (nội dung ngắn)
        if (scrollWidth <= clientWidth + 1) {  // +1 để chống lệch nhỏ
            this.isLeftDisabled = true;
            this.isRightDisabled = true;
        } else {
            this.isLeftDisabled = scrollLeft <= 0;
            this.isRightDisabled = scrollLeft + clientWidth >= scrollWidth - 1;
        }
    }

    onSelectSubject(subject: string) {
        if (this.subjectNameControl.value === subject) {
            this.subjectNameControl.setValue(''); // Bỏ chọn
            this.subjectKeyword = ''; // Xóa bộ lọc subject
        } else {
            this.subjectNameControl.setValue(subject); // Chọn subject mới
            this.subjectKeyword = subject; // Cập nhật bộ lọc subject
        }
        this.getTrendedCourses(); // Tải lại danh sách khóa học

        // 🔥 Bonus: Scroll to selected subject
        setTimeout(() => {
            const container = this.subjectScrollContainer.nativeElement;
            const subjectElements = container.querySelectorAll('.subject-chip');
            const selectedElement = Array.from(subjectElements).find(el => el.textContent?.trim() === subject);

            if (selectedElement) {
                (selectedElement as HTMLElement).scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center',
                    block: 'nearest'
                });
            }
        }, 0);
    }
}
