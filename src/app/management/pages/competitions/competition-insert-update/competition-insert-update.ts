import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { CompetitionHttpService } from 'src/app/shared/http-services/competition-http-service';
import { CompetitionDto } from 'src/app/shared/models/competition.models';
import { FileUploadComponent } from 'src/app/theme/shared/components/file-upload/file-upload.component';
import { DatePickerComponent } from 'src/app/theme/shared/components/date-picker/date-picker.component';

@Component({
  selector: 'app-competition-insert-update',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FileUploadComponent, DatePickerComponent],
  templateUrl: './competition-insert-update.html',
  styleUrl: './competition-insert-update.scss'
})
export class CompetitionInsertUpdate implements OnInit {
  @Input() competition?: CompetitionDto; // if passed = edit mode
  form!: FormGroup;
  jsonForm!: FormGroup;
  isEdit = false;
  message = '';
  competitionId?: string;


  constructor(
    private fb: FormBuilder,
    private competitionService: CompetitionHttpService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isEdit = !!this.competition;

    this.form = this.fb.group({
      competitionTitle: ['', Validators.required],
      licenseFileId: [''],
      bannerFileId: [''],
      competitionDate: ['', Validators.required],
      competitionAddress: ['', Validators.required]
    });

    this.jsonForm = this.fb.group({
      jsonParams: ['', this.jsonValidator]
    });

    this.route.paramMap
      .pipe(
        switchMap(params => {
          const id = params.get('id');
          if (id) {
            this.isEdit = true;
            this.competitionId = id;
            return this.competitionService.getCompetitionById(id);
          }
          return [];
        })
      )
      .subscribe({
        next: (competition: CompetitionDto) => {
          if (competition) {
            this.form.patchValue({
              competitionTitle: competition.title,
              competitionAddress: competition.location,
              competitionDate: competition.date
            });
          }
        },
        error: () => (this.message = 'Failed to load competition')
      });
  }

  onFileUploaded(event: any, field: string): void {
    this.form.patchValue({
      [field]: event
    });
  }

  onDateChange(gregorianDate: string): void {
    console.log('Gregorian date:', gregorianDate);
    this.form.patchValue({
      competitionDate: gregorianDate
    });
  }

  // JSON validator function
  jsonValidator(control: any) {
    if (!control.value || control.value.trim() === '') {
      return null; // No error for empty values
    }
    
    try {
      JSON.parse(control.value);
      return null; // Valid JSON
    } catch (error) {
      return { invalidJson: true }; // Invalid JSON
    }
  }

  updateCompetitionParams(): void {
    if (!this.competitionId) {
      this.message = 'Competition ID not found';
      return;
    }

    if (this.jsonForm.invalid) {
      this.message = 'Please fix JSON errors before updating';
      return;
    }

    const jsonParams = this.jsonForm.get('jsonParams')?.value;
    if (!jsonParams || !jsonParams.trim()) {
      this.message = 'Please enter JSON parameters';
      return;
    }

    this.competitionService.updateCompetitionParams(this.competitionId, jsonParams)
      .subscribe({
        next: () => {
          this.message = 'Competition parameters updated successfully ✅';
        },
        error: (error) => {
          this.message = 'Error updating competition parameters ❌';
          console.error('Error:', error);
        }
      });
  }

  save(): void {
    if (this.form.invalid) {
      this.message = 'Please fill required fields.';
      return;
    }

    if (this.isEdit && this.competitionId) {
      this.competitionService.updateCompetition(this.competitionId, this.form.value)
        .subscribe({
          next: () => {
            this.message = 'Competition updated successfully ✅';
            this.router.navigate(['/competitions']);
          },
          error: () => this.message = 'Error updating competition ❌'
        });
    } else {
      this.competitionService.createCompetition(this.form.value)
        .subscribe({
          next: () => {
            this.message = 'Competition created successfully ✅';
            this.router.navigate(['/competitions']);
          },
          error: () => this.message = 'Error creating competition ❌'
        });
    }
  }
}