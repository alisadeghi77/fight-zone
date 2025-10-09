import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, switchMap } from 'rxjs';
import { CompetitionHttpService } from 'src/app/shared/http-services/competition-http-service';
import { CompetitionDto, CompetitionStatus } from 'src/app/shared/models/competition.models';
import { BaseResponseModel } from "src/app/shared/models/base-response.model";
import { FileUploadComponent } from 'src/app/theme/shared/components/file-upload/file-upload.component';
import { DatePickerComponent } from 'src/app/theme/shared/components/date-picker/date-picker.component';
import { NgbNavModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParticipantsHttpService } from 'src/app/shared/http-services/participants-http-service';
import { CreateParticipantRequestByAdminDto, ParticipantDto, RegisterStatus } from 'src/app/shared/models/participant.models';
import { UserHttpService } from 'src/app/shared/http-services/user-http-service';
import { MinimalUserDto } from 'src/app/shared/models/user.models';
import { SearchUserByRoleComponenet } from 'src/app/management/shared/search-user-by-role-componenet/search-user-by-role-componenet';
import { RegisterParamsCompetitionComponent } from 'src/app/management/shared/register-params-competition/register-params-competition';
import { BracketHttpService } from 'src/app/shared/http-services/bracket-http-service';
import { BracketKeyDto } from 'src/app/shared/models/bracket.models';
import { MatchHttpService } from 'src/app/shared/http-services/match-http-service';
import { MatchDto } from 'src/app/shared/models/match.models';
import { BracketViewComponent } from 'src/app/management/shared/bracket-view/bracket-view.component';
import { ConfirmationModalComponent } from 'src/app/theme/shared/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-competition-insert-update',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FileUploadComponent, DatePickerComponent, SearchUserByRoleComponenet, NgbNavModule, RegisterParamsCompetitionComponent, BracketViewComponent],
  templateUrl: './competition-insert-update.html',
  styleUrl: './competition-insert-update.scss'
})
export class CompetitionInsertUpdate implements OnInit {
  @Input() competition?: CompetitionDto; // if passed = edit mode
  form!: FormGroup;
  jsonForm!: FormGroup;
  participantForm!: FormGroup;
  bracketForm!: FormGroup;
  active = 1;
  isEdit = false;
  message = '';
  competitionId?: string;
  editableCompetitoin: CompetitionDto;

  // Bracket related properties
  bracketKeys: BracketKeyDto[] = [];
  parsedBracketKeys: any[] = [];
  selectedBracketInfo: BracketKeyDto | null = null;


  constructor(
    private fb: FormBuilder,
    private participantsHttpService: ParticipantsHttpService,
    private competitionService: CompetitionHttpService,
    private UserService: UserHttpService,
    private bracketHttpService: BracketHttpService,
    private matchHttpService: MatchHttpService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
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
      participantUserId: [''],
      phoneNumber: ['', Validators.maxLength(11)],
      firstName: [''],
      lastName: [''],

      coachUserId: [''],
      coachPhoneNumber: ['', Validators.maxLength(11)],

      competitionId: [0],
      params: [[]],
    });

    this.bracketForm = this.fb.group({
      selectedKey: ['']
    });


    this.route.paramMap
      .subscribe((params) => {
        const id = params.get('id');
        if (id) {
          this.isEdit = true;
          this.competitionId = id;
          this.loadBracketKeys();
          return this.reloadCompetitionData()
        }
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

    this.competitionService.updateCompetitionParams(this.competitionId, JSON.parse(jsonParams))
      .subscribe({
        next: () => {
          location.reload()
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

  // Persian status mappings
  competitionStatusMap = {
    [CompetitionStatus.PendToAdminApprove]: 'در انتظار تایید ادمین',
    [CompetitionStatus.PendToStart]: 'در انتظار شروع، درحال ثبت نام',
    [CompetitionStatus.OnProgress]: 'در حال برگزاری',
    [CompetitionStatus.End]: 'پایان یافته'
  };
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
            participantUserId: '',
            phoneNumber: '',
            firstName: '',
            lastName: '',
            coachUserId: '',
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
        this.participantsData = response.data.map(item => ({
          ...item,
          participantParamProperties:item.registerParams.map(p => p.value).join(' ')
        }))
        this.participantsFilteredData = this.participantsData 
      });

  }

  onParticipantChanged(input: MinimalUserDto | string) {
    if (typeof input === 'string') {
      this.participantForm.patchValue({
        phoneNumber: input,
        participantUserId: null
      })
      this.participantForm.controls['firstName'].enable();
      this.participantForm.controls['lastName'].enable();
    } else {
      this.participantForm.patchValue({
        participantUserId: input.id,
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
        coachUserId: input.id,
      })
    }
  }

  onSelectionChange($event) {
    this.participantForm.patchValue({
      params: $event
    })
  }

  startRegistration(): void {
    if (!this.competitionId) {
      this.message = 'Competition ID not found';
      return;
    }

    this.competitionService.startRegistration(this.competitionId)
      .subscribe({
        next: () => {
          this.reloadCompetitionData();
        },
        error: (error) => {
          this.message = 'Error starting registration ❌';
          console.error('Error:', error);
        }
      });
  }

  changeVisibility(): void {
    if (!this.competitionId) {
      this.message = 'Competition ID not found';
      return;
    }

    this.competitionService.changeVisibility(this.competitionId)
      .subscribe({
        next: () => {
          this.reloadCompetitionData();
        },
        error: (error) => {
          this.message = 'Error changing visibility ❌';
          console.error('Error:', error);
        }
      });
  }

  changeRegistrationStatus(): void {
    if (!this.competitionId) {
      this.message = 'Competition ID not found';
      return;
    }

    this.competitionService.changeRegistrationStatus(this.competitionId)
      .subscribe({
        next: () => {
          this.reloadCompetitionData();
        },
        error: (error) => {
          this.message = 'Error changing registration status ❌';
          console.error('Error:', error);
        }
      });
  }

  approveParticipant(participantId: number): void {
    this.participantsHttpService.approveParticipant(participantId)
      .subscribe({
        next: (response) => {
          this.loadParticipants(); // Refresh the participants list
        },
        error: (error) => {
          this.message = error.error?.errorMessages?.[0]?.message || 'خطا در تایید شرکت کننده ❌';
          console.error('Error approving participant:', error);
        }
      });
  }

  rejectParticipant(participantId: number): void {
    this.participantsHttpService.rejectParticipant(participantId)
      .subscribe({
        next: (response) => {
          this.loadParticipants(); // Refresh the participants list
        },
        error: (error) => {
          this.message = error.error?.errorMessages?.[0]?.message || 'خطا در رد شرکت کننده ❌';
          console.error('Error rejecting participant:', error);
        }
      });
  }

  private reloadCompetitionData(): void {
    if (!this.competitionId) return;

    this.competitionService.getCompetitionById(this.competitionId)
      .subscribe({
        next: (response: BaseResponseModel<CompetitionDto>) => {
          const competition = response.data;
          if (response) {
            this.editableCompetitoin = competition;

            this.form.patchValue({
              title: competition.title,
              address: competition.address,
              date: competition.date,
              bannerImageId: competition.bannerImageId,
              licenseImageId: competition.licenseImageId,
            });

            this.jsonForm.patchValue({
              jsonParams: JSON.stringify(competition.registerParams)
            });
          }
        },
        error: (error) => {
          console.error('Error reloading competition data:', error);
        }
      });
  }

  // Bracket related methods
  loadBracketKeys(): void {
    if (!this.competitionId) return;

    this.bracketHttpService.getAvailableKeys(this.competitionId)
      .subscribe({
        next: (response) => {
          this.bracketKeys = response.data;
          this.parseBracketKeys();
        },
        error: (error) => {
          this.message = 'خطا در بارگذاری کلیدهای جدول ❌';
          console.error('Error loading bracket keys:', error);
        }
      });
  }

  parseBracketKeys(): void {
    this.parsedBracketKeys = this.bracketKeys.map(bracket => {
      let title = "";
      const parts = bracket.key.split('_');

      parts.forEach(item => {
        const keyValue = item.split('.');
        title = `${title} ${keyValue[1]}`
      })


      return {
        ...bracket,
        title
      };
    });
  }


  matches: MatchDto[] = [];
  onBracketKeyChange(event: any): void {
    const selectedKey = event.target.value;
    this.selectedBracketInfo = this.bracketKeys.find(b => b.key === selectedKey) || null;

    // Load matches if the selected bracket has any brackets
    this.matches = [];
    if (this.selectedBracketInfo?.hasAnyBrackets) {
      this.loadMatchesForKey(selectedKey);
    }
  }

  loadMatchesForKey(key: string): void {
    this.matchHttpService.getMatchesByKey(key)
      .subscribe({
        next: (response) => {
          this.matches = response.data;
        },
        error: (error) => {
          this.message = 'خطا در بارگذاری مسابقات ❌';
          console.error('Error loading matches:', error);
        }
      });
  }

  onBracketNeedRefresh(): void {
    const selectedKey = this.bracketForm.get('selectedKey')?.value;
    if (selectedKey) {
      this.loadMatchesForKey(selectedKey);
    }
  }

  generateBracketForKey(): void {
    const selectedKey = this.bracketForm.get('selectedKey')?.value;
    if (!selectedKey || !this.competitionId) return;

    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
      keyboard: true
    });


    modalRef.result.then(
      (result) => {
        if (result) {
          this.bracketHttpService.deleteBracketForKey(+this.competitionId!, selectedKey)
            .subscribe({
              next: () => {
                this.bracketHttpService.generateBracketForKey(this.competitionId!, selectedKey)
                  .subscribe({
                    next: (response) => {
                      this.message = 'جدول با موفقیت ایجاد شد ✅';
                      this.loadBracketKeys();
                    },
                    error: (error) => {
                      this.message = 'خطا در ایجاد جدول ❌';
                      console.error('Error generating bracket:', error);
                    }
                  });
              },
              error: (error) => {
                this.message = 'خطا در ایجاد جدول ❌';
                console.error('Error generating bracket:', error);
              }
            });
        }
      }
    );
  }

  generateAllBrackets(): void {
    if (!this.competitionId) return;

    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
      keyboard: true
    });

    modalRef.result.then(
      (result) => {
        if (result) {
          this.bracketHttpService.deleteAllBrackets(+this.competitionId!)
            .subscribe({
              next: () => {
                this.bracketHttpService.generateAllBrackets(this.competitionId!)
                  .subscribe({
                    next: (response) => {
                      this.message = 'جداول کلی با موفقیت ایجاد شدند ✅';
                      this.loadBracketKeys(); // Refresh the data
                    },
                    error: (error) => {
                      this.message = 'خطا در ایجاد جداول کلی ❌';
                      console.error('Error generating all brackets:', error);
                    }
                  });
              },
              error: (error) => {
                this.message = 'خطا در ایجاد جداول کلی ❌';
                console.error('Error generating all brackets:', error);

              }
            });
        }
      });
  }
}