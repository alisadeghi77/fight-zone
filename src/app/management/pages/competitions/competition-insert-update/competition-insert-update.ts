import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, switchMap } from 'rxjs';
import { CompetitionHttpService } from 'src/app/shared/http-services/competition-http-service';
import { CompetitionDto } from 'src/app/shared/models/competition.models';
import { BaseResponseModel } from "src/app/shared/models/base-response.model";
import { FileUploadComponent } from 'src/app/theme/shared/components/file-upload/file-upload.component';
import { DatePickerComponent } from 'src/app/theme/shared/components/date-picker/date-picker.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ParticipantsHttpService } from 'src/app/shared/http-services/participants-http-service';
import { CreateParticipantRequestByAdminDto, ParticipantDto, RegisterStatus } from 'src/app/shared/models/participant.models';
import { UserHttpService } from 'src/app/shared/http-services/user-http-service';
import { MinimalUserDto } from 'src/app/shared/models/user.models';
import { SearchUserByRoleComponenet } from 'src/app/management/shared/search-user-by-role-componenet/search-user-by-role-componenet';
import { RegisterParamsCompetitionComponent } from 'src/app/management/shared/register-params-competition/register-params-competition';

@Component({
  selector: 'app-competition-insert-update',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FileUploadComponent, DatePickerComponent, SearchUserByRoleComponenet, NgbNavModule, RegisterParamsCompetitionComponent],
  templateUrl: './competition-insert-update.html',
  styleUrl: './competition-insert-update.scss'
})
export class CompetitionInsertUpdate implements OnInit {
  @Input() competition?: CompetitionDto; // if passed = edit mode
  form!: FormGroup;
  jsonForm!: FormGroup;
  participantForm!: FormGroup;
  active = 1;
  isEdit = false;
  message = '';
  competitionId?: string;


  constructor(
    private fb: FormBuilder,
    private participantsHttpService: ParticipantsHttpService,
    private competitionService: CompetitionHttpService,
    private UserService: UserHttpService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      title: ['', Validators.required],
      licenseImageId: [''],
      bannerImageId: [''],
      date: ['', Validators.required],
      address: ['', Validators.required]
    });

    this.jsonForm = this.fb.group({
      jsonParams: ['', this.jsonValidator]
    });

    this.participantForm = this.fb.group({
      participantId: [''],
      phoneNumber: ['', Validators.maxLength(11)],
      firstName: [''],
      lastName: [''],

      coachId: [''],
      coachPhoneNumber: ['', Validators.maxLength(11)],

      competitionId: [0],
      params: [[]],
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
        next: (response: BaseResponseModel<CompetitionDto>) => {
          const competition = response.data;
          if (response) {
            this.form.patchValue({
              title: competition.title,
              address: competition.address,
              date: competition.date,
              bannerImageId: competition.bannerImageId,
              licenseImageId: competition.licenseImageId,
            });
            this.jsonForm.patchValue({
              jsonParams: competition.registerParams
            });
          }
        },
        error: (response) => (this.message = response.error.errorMessages[0].message)
      });

    this.loadParticipants();
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

  jsonValidator(control: any) {
    if (!control.value) {
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
      this.competitionService.updateCompetition({ id: this.competitionId, ...this.form.value })
        .subscribe({
          next: () => {
            this.message = 'Competition updated successfully ✅';
          },
          error: () => this.message = 'Error updating competition ❌'
        });
    } else {
      this.competitionService.createCompetition(this.form.value)
        .subscribe({
          next: (response) => {
            this.router.navigate(['management/competitions/edit/', response.data]);
          },
          error: (response) => this.message = response.error.errorMessages[0].message || 'Error creating competition ❌'
        });
    }
  }

  participantsInput = new FormControl('');
  participantsFilteredData: ParticipantDto[] = [];
  participantsData: ParticipantDto[] = [];
  registerStatus = RegisterStatus;
  registerParticipant(): void {
    this.participantForm.patchValue({ competitionId: +this.competitionId });

    if (this.participantForm.invalid) {
      this.message = 'Please fill all required fields for participant registration.';
      return;
    }

    if (!this.competitionId) {
      this.message = 'Competition ID not found';
      return;
    }

    const participantData: CreateParticipantRequestByAdminDto = {
      ...this.participantForm.value
    };

    this.participantsHttpService.createParticipant(participantData)
      .subscribe({
        next: (response) => {
          this.message = 'Participant registered successfully ✅';
          this.participantForm.patchValue({
            participantId: '',
            phoneNumber: '',
            firstName: '',
            lastName: '',
            coachId: '',
            coachPhoneNumber: '',
            competitionId: 0,
            params: []
          })

          setTimeout(() => {
            const firstInput = document.querySelector('#searchInput') as HTMLInputElement;
            if (firstInput) {
              firstInput.focus();
            }
          }, 100);

          this.loadParticipants();
        },
        error: (error) => {
          this.message = error.error?.errorMessages?.[0]?.message || 'Error registering participant ❌';
          console.error('Error:', error);
        }
      });
  }

  loadParticipants(): void {
    if (!this.competitionId) return;

    this.participantsInput.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      this.participantsFilteredData = value ?
        this.participantsData
          .filter(f => f.coachPhoneNumber.toLocaleLowerCase().includes(value.toLocaleLowerCase()) || f.coachFullName.toLocaleLowerCase().includes(value.toLocaleLowerCase()) || f.participantFullName.toLocaleLowerCase().includes(value.toLocaleLowerCase()) || f.participantPhoneNumber.toLocaleLowerCase().includes(value.toLocaleLowerCase())) :
        this.participantsData;
    });

    this.participantsHttpService.getParticipants(this.competitionId)
      .subscribe(response => {
        this.participantsData = response.data
        this.participantsFilteredData = response.data
      });

  }

  onParticipantChanged(input: MinimalUserDto | string) {
    if (typeof input === 'string') {
      this.participantForm.patchValue({
        phoneNumber: input,
        participantId: null
      })
      this.participantForm.controls['firstName'].enable();
      this.participantForm.controls['lastName'].enable();
    } else {
      this.participantForm.patchValue({
        participantId: input.id,
        firstName: input.fullName.split(' ').at(0),
        lastName: input.fullName.split(' ')?.at(1)
      })
      this.participantForm.controls['firstName'].disable();
      this.participantForm.controls['lastName'].disable();

    }
  }



  onCoachChanged(input: MinimalUserDto | string) {
    if (typeof input === 'string') {
      this.participantForm.patchValue({
        coachPhoneNumber: input
      })
    } else {
      this.participantForm.patchValue({
        coachId: input.id,
      })
    }
  }

  onSelectionChange($event) {
    console.log($event)
  }
}