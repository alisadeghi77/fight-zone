import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { CompetitionHttpService } from 'src/app/shared/http-services/competition-http-service';
import { CompetitionDto, UpdateCompetitionRequestDto, CreateCompetitionRequestDto } from 'src/app/shared/models/competition.models';

@Component({
  selector: 'app-competition-insert-update',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './competition-insert-update.html',
  styleUrl: './competition-insert-update.scss'
})
export class CompetitionInsertUpdate implements OnInit {
  @Input() competition?: CompetitionDto; // if passed = edit mode
  form!: FormGroup;
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
      title: ['', Validators.required],
      manager: ['', Validators.required],
      gender: ['', Validators.required],
      canRegister: [true],
      bannerImage: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      date: ['', Validators.required],
      award: [0],
      location: ['', Validators.required]
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
              title: competition.title,
              manager: competition.manager,
              gender: competition.gender,
              canRegister: competition.canRegister,
              bannerImage: competition.bannerImage,
              price: competition.price,
              date: competition.date,
              award: competition.award,
              location: competition.location
            });
          }
        },
        error: () => (this.message = 'Failed to load competition')
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