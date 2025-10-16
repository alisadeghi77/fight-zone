import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CompetitionDto } from 'src/app/shared/models/competition.models';
import { CompetitionHttpService } from 'src/app/shared/http-services/competition-http-service';
import { BracketHttpService } from 'src/app/shared/http-services/bracket-http-service';
import { MatchHttpService } from 'src/app/shared/http-services/match-http-service';
import { BracketKeyDto } from 'src/app/shared/models/bracket.models';
import { MatchDto } from 'src/app/shared/models/match.models';
import { BracketViewComponent } from 'src/app/management/shared/bracket-view/bracket-view.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-competition-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, BracketViewComponent],
  templateUrl: './competition-detail.component.html',
  styleUrls: ['./competition-detail.component.scss']
})
export class CompetitionDetailComponent implements OnInit {
  competitionId: string = '';
  competition: CompetitionDto | null = null;
  bracketKeys: BracketKeyDto[] = [];
  matchesByKey: { [key: string]: MatchDto[] } = {};
  selectedBracketKey: string | null = null;
  loading = false;
  loadingBrackets = false;
  error: string | null = null;
  baseApiUrl = environment.baseApiUrl;

  constructor(
    private route: ActivatedRoute,
    private competitionHttpService: CompetitionHttpService,
    private bracketHttpService: BracketHttpService,
    private matchHttpService: MatchHttpService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.competitionId = params['id'];
      if (this.competitionId) {
        this.loadCompetitionDetails();
        this.loadBracketKeys();
      }
    });
  }

  private loadCompetitionDetails(): void {
    this.loading = true;
    this.error = null;
    
    this.competitionHttpService.getCompetitionById(this.competitionId).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.competition = response.data;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading competition details:', err);
        this.error = 'خطا در بارگذاری اطلاعات مسابقه';
        this.loading = false;
      }
    });
  }

  private loadBracketKeys(): void {
    this.loadingBrackets = true;
    
    this.bracketHttpService.getAvailableKeys(this.competitionId).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.bracketKeys = response.data
          .filter(key => key.hasAnyBrackets)
          .map(item => ({
            ...item,
            title: item.key.split('_').map(word => word.split('.')[1]).join(' ')
          }));
          // Set default selected key
          this.selectedBracketKey = this.bracketKeys.length > 0 ? this.bracketKeys[0].key : null;
          // Load matches for each key (prefetch)
          this.bracketKeys.forEach(bracketKey => {
            this.loadMatchesForKey(bracketKey.key);
          });
        }
        this.loadingBrackets = false;
      },
      error: (err) => {
        console.error('Error loading bracket keys:', err);
        this.loadingBrackets = false;
      }
    });
  }

  private loadMatchesForKey(key: string): void {
    this.matchHttpService.getMatchesByKey(key).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.matchesByKey[key] = response.data;
        }
      },
      error: (err) => {
        console.error(`Error loading matches for key ${key}:`, err);
      }
    });
  }

  refreshBracket(key: string): void {
    this.loadMatchesForKey(key);
  }

  getCompetitionStatusText(status: number): string {
    const statusMap: { [key: number]: string } = {
      0: 'در انتظار تایید',
      1: 'در انتظار شروع',
      2: 'در حال برگزاری',
      3: 'پایان یافته'
    };
    return statusMap[status] || 'نامشخص';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR').format(date);
  }
}

