import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Review } from '../../models/review';
import { ReviewService } from '../../services/review.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { SubjectService } from '../../services/subject.service';
import Swal from 'sweetalert2';
import { min } from 'class-validator';
@Component({
    selector: 'app-review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit, AfterViewInit  {

    @ViewChild('subjectScrollContainer') subjectScrollContainer!: ElementRef<HTMLElement>;
    subjectList: string[] = ['Frontend', 'Backend', 'Database', 'AI', 'DevOps', 'Design',]; // hoặc lấy từ API
    subjectKeyword: string = '';  // Lọc theo chủ đề

    isLeftDisabled = true;
    isRightDisabled = false;
    subjectNameControl = new FormControl('');

    courseForm: FormGroup;
    resultData: Review[] = [];
    filteredCourses: Review[] = [];

    sortField: keyof Review | '' = '';
    sortAsc = false;

    p: number = 1;

    constructor(
        private reviewService: ReviewService, 
        private subjectService: SubjectService,
        private fb: FormBuilder) 
    { 
        this.courseForm = this.fb.group({
            subject_name: [''],
            courseKeyword: [''],
            minRating: ['', [Validators.min(0), Validators.max(5)]],
            minFee: ['', [Validators.min(0)]],
            maxFee: ['', [Validators.min(0)]],
        });
    }

    ngAfterViewInit() {
        this.updateScrollButtons();
    }

    ngOnInit(): void {
        this.courseForm.patchValue({
            courseKeyword: '',
            minRating: '',
            minFee: '',
            maxFee: ''
        });

        this.loadReviews();

        debugger
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
            .subscribe(() => this.loadReviews());
    }


    loadReviews(): void {
        let {courseKeyword, minRating, minFee, maxFee} = this.courseForm.value;
        const subject_name = this.subjectNameControl.value || this.subjectKeyword;
        if(!minRating) minRating = 0;
        if(!minFee) minFee = 0;
        if(!maxFee) maxFee = 0; 
        debugger
        this.reviewService.getTopRatedReviews(subject_name, courseKeyword, minRating, minFee, maxFee)
        .subscribe({
            next: (data) => {
                debugger
                this.resultData = data;
                this.updateFilteredCourses();
            },
            error: (err) => {
                debugger
                Swal.fire('Lỗi', err.error?.message || 'Không xác định', 'error');
            }
        });
    }

    updateFilteredCourses(): void {
        this.resultData.sort((a, b) => {
            const valueA = a[this.sortField as keyof Review];
            const valueB = b[this.sortField as keyof Review];

            if (typeof valueA === 'string' && typeof valueB === 'string') {
                return valueA.localeCompare(valueB) * (this.sortAsc ? 1 : -1);
            }
            return (valueA > valueB ? 1 : -1) * (this.sortAsc ? 1 : -1);
        });
    }


    sort(field: keyof Review) {
        if (this.sortField === field) this.sortAsc = !this.sortAsc;
        else {
            this.sortField = field;
            this.sortAsc = true;
        }
        this.updateFilteredCourses();
    }

    getSortIcon(field: keyof Review): string {
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
        this.loadReviews(); // Tải lại danh sách khóa học

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
