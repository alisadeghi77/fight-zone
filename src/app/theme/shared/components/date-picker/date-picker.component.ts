import { Component, Input, Output, EventEmitter, forwardRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import * as moment from 'jalali-moment';

@Component({
    selector: 'app-date-picker',
    imports: [CommonModule, FormsModule],
    templateUrl: './date-picker.component.html',
    styleUrl: './date-picker.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatePickerComponent),
            multi: true
        }
    ]
})
export class DatePickerComponent {
    @Output() dateChange = new EventEmitter<string>();
    @Input() set dateInput(value: string) {
        if (value && value != this.gregorianDate) {
            this.setGregorianDate(value);
        }
    }

    persianDate: string = '';
    gregorianDate: string = '';

    persianToGregorian(persianDateString: string): string | null {
        if (!persianDateString || typeof persianDateString !== 'string') {
            return null;
        }

        try {
            const persianMoment = moment(persianDateString, 'jYYYY/jMM/jDD');

            if (!persianMoment.isValid()) {
                return null;
            }

            return persianMoment.format('YYYY-MM-DD');
        } catch (error) {
            console.error('Error converting Persian date:', error);
            return null;
        }
    }

    gregorianToPersian(gregorianDateString: string): string | null {
        if (!gregorianDateString || typeof gregorianDateString !== 'string') {
            return null;
        }

        try {
            const gregorianMoment = moment(gregorianDateString, 'YYYY-MM-DD');

            if (!gregorianMoment.isValid()) {
                return null;
            }

            return gregorianMoment.format('jYYYY/jMM/jDD');
        } catch (error) {
            console.error('Error converting Gregorian date:', error);
            return null;
        }
    }

    isValidPersianDate(persianDateString: string): boolean {
        if (!persianDateString || typeof persianDateString !== 'string' || persianDateString.length !== 10) {
            return false;
        }

        try {
            const persianMoment = moment(persianDateString, 'jYYYY/jMM/jDD');
            return persianMoment.isValid();
        } catch (error) {
            return false;
        }
    }

    private updateGregorianDate(): void {
        if (this.persianDate) {
            const gregorian = this.persianToGregorian(this.persianDate);
            if (gregorian) {
                this.gregorianDate = gregorian;
                this.dateChange.emit(gregorian);
            }
        }
    }

    onPersianDateChange(event: any): void {
        const value = event.target.value;
        this.persianDate = value;

        if (value && this.isValidPersianDate(value)) {
            this.updateGregorianDate();
        }
    }

    setPersianDate(persianDate: string): void {
        this.persianDate = persianDate;
        this.updateGregorianDate();
    }

    setGregorianDate(gregorianDate: string): void {
        this.gregorianDate = gregorianDate;
        if (gregorianDate) {
            const persian = this.gregorianToPersian(gregorianDate);
            if (persian) {
                this.persianDate = persian;
            }
        } else {
            this.persianDate = '';
        }
    }
}
