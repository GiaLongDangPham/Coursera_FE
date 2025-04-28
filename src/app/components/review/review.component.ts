import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Review } from '../../models/review';
import { ReviewService } from '../../services/review.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { SubjectService } from '../../services/subject.service';
@Component({
    selector: 'app-review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit, AfterViewInit  {

    @ViewChild('subjectScrollContainer') subjectScrollContainer!: ElementRef<HTMLElement>;

    reviews: Review[] = [];
    filteredReviews: Review[] = [];
    subjectList: string[] = ['Frontend', 'Backend', 'Database', 'AI', 'DevOps', 'Design',]; // hoặc lấy từ API

    subjectKeyword: string = '';  // Lọc theo chủ đề
    courseKeyword: string = '';   // Lọc theo khoá học
    minRating: number = 0.0;      // Lọc theo rating tối thiểu

    sortField = '';
    sortAsc = true;

    courseNameControl = new FormControl('');
    subjectNameControl = new FormControl('');
    ratingControl = new FormControl();
    p: number = 1;

    isLeftDisabled = true;
    isRightDisabled = false;

    constructor(private reviewService: ReviewService, private subjectService: SubjectService) { }

    ngAfterViewInit() {
        this.updateScrollButtons();
    }

    ngOnInit(): void {
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

        this.courseNameControl.valueChanges
            .pipe(debounceTime(300))
            .subscribe(() => this.updateFilteredReviews());

        this.subjectNameControl.valueChanges
            .pipe(debounceTime(300))
            .subscribe(() => this.updateFilteredReviews());

        this.ratingControl.valueChanges
            .pipe(debounceTime(300))
            .subscribe(() => this.updateFilteredReviews());
    }


    loadReviews(): void {
        debugger
        this.reviewService.getTopRatedReviews(this.subjectKeyword, this.courseKeyword, this.minRating).subscribe({
            next: (data) => {
                this.reviews = data;
                this.updateFilteredReviews();
            },
            error: (err) => {
                alert('Error loading reviews: ' + err.message);
            }
        });
    }

    updateFilteredReviews(): void {
        let courseText = this.courseNameControl.value?.toLowerCase() || '';
        let minRating = this.ratingControl.value || 0;

        let data = this.reviews.filter(r =>
            r.courseName.toLowerCase().includes(courseText) &&
            r.ratingScore >= minRating  // Lọc theo ratingScore
        );

        if (this.sortField) {
            data = data.sort((a, b) => {
                const valueA = a[this.sortField as keyof Review];
                const valueB = b[this.sortField as keyof Review];

                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    return valueA.localeCompare(valueB) * (this.sortAsc ? 1 : -1);
                }
                return (valueA > valueB ? 1 : -1) * (this.sortAsc ? 1 : -1);
            });
        }

        this.filteredReviews = data;
    }

    sort(field: keyof Review) {
        if (this.sortField === field) this.sortAsc = !this.sortAsc;
        else {
            this.sortField = field;
            this.sortAsc = true;
        }
        this.updateFilteredReviews();
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
