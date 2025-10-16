import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { MatchDto } from 'src/app/shared/models/match.models';
import { MatchHttpService } from 'src/app/shared/http-services/match-http-service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-bracket-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bracket-view.component.html',
  styleUrl: './bracket-view.component.scss'
})
export class BracketViewComponent implements OnInit, OnChanges {
  @Input() matches: MatchDto[] = [];
  @Input() competitionId?: string;
  @Input() keyId?: string;
  @Input() viewType: 'management-view' | 'web-view' = 'management-view';
  @Input() showRoundFilter: boolean = true;
  @Input() set selectedRoundFilter(value: number | undefined) {
    this._selectedRoundFilter = value;
    this.computeVisibleRounds();
  }
  get selectedRoundFilter(): number | undefined {
    return this._selectedRoundFilter;
  }
  @Output() needRefresh = new EventEmitter<void>();

  roundGroupedMatches: { [round: number]: MatchDto[] } = {};
  rounds: number[] = [];
  visibleRounds: number[] = [];
  private _selectedRoundFilter: number | undefined;

  constructor(private matchHttpService: MatchHttpService, private authService: AuthService) { }

  ngOnInit(): void {
    this.groupMatchesByRound();
    this.computeVisibleRounds();
  }

  ngOnChanges(): void {
    this.groupMatchesByRound();
    this.computeVisibleRounds();
  }

  private groupMatchesByRound(): void {
    this.roundGroupedMatches = {};
    this.matches.forEach(match => {
      if (!this.roundGroupedMatches[match.round]) {
        this.roundGroupedMatches[match.round] = [];
      }
      this.roundGroupedMatches[match.round].push(match);
    });

    console.log(this.roundGroupedMatches);

    // Sort matches within each round by match number position
    Object.keys(this.roundGroupedMatches).forEach(round => {
      this.roundGroupedMatches[+round].sort((a, b) => b.matchNumberPosition - a.matchNumberPosition);
    });

    // Sort rounds in descending order (finals first, then semifinals, etc.)
    this.rounds = Object.keys(this.roundGroupedMatches).map(r => +r).sort((a, b) => b - a);
  }

  private computeVisibleRounds(): void {
    if (!this.rounds || this.rounds.length === 0) {
      this.visibleRounds = [];
      return;
    }

    // If no filter selected, show all rounds as before
    if (!this._selectedRoundFilter) {
      this.visibleRounds = [...this.rounds];
      return;
    }

    const start = this._selectedRoundFilter;
    const computed: number[] = [];
    let current = start;
    // generate: start, start/2, ..., 2
    while (current >= 2) {
      computed.push(current);
      current = Math.floor(current / 2);
      // ensure it stays power-of-two sequence even if odd
      if (current % 2 === 1 && current !== 1) {
        current = current - 1;
      }
    }
    // Intersect with available rounds and keep overall descending order
    this.visibleRounds = this.rounds.filter(r => computed.includes(r));
  }

  onRoundFilterChange(next: string | number): void {
    const parsed = typeof next === 'string' ? parseInt(next, 10) : next;
    this.selectedRoundFilter = isNaN(parsed as number) ? undefined : (parsed as number);
  }

  getRoundName(round: number): string {
    const roundNames: { [key: number]: string } = {
      2: 'فینال',
      4: 'نیمه نهایی',
      8: 'یک چهارم نهایی',
      16: 'یک هشتم نهایی',
      32: 'یک شانزدهم نهایی',
      64: 'یک سی و دوم نهایی'
    };
    return roundNames[round] || `دور ${round}`;
  }

  getParticipantDisplayName(match: MatchDto, isFirst: boolean): string {
    if (isFirst) {
      if (match.isFirstParticipantBye) {
        return 'Bye';
      }
      return match.firstParticipantFullName || '-';
    } else {
      if (match.isSecondParticipantBye) {
        return 'Bye';
      }
      return match.secondParticipantFullName || '-';
    }
  }

  getParticipantDisplayNameById(matchNo: number, roundNumber: number, isFirst: boolean) {
    const match = this.roundGroupedMatches[roundNumber].filter(f => f.matchNumberPosition == matchNo)[0]
    console.log(matchNo, roundNumber, match);
  }

  getCoachDisplayName(match: MatchDto, isFirst: boolean): string {
    if (isFirst) {
      if (match.isFirstParticipantBye) {
        return '';
      }
      return match.firstParticipantCoachFullName || '';
    } else {
      if (match.isSecondParticipantBye) {
        return '';
      }
      return match.secondParticipantCoachFullName || '';
    }
  }

  getPlacementLabel(match: MatchDto, isFirst: boolean): string {
    const participantId = isFirst ? match.firstParticipantId : match.secondParticipantId;
    if (!participantId) {
      return '';
    }

    // Final match: 1st and 2nd
    if (match.round === 2 && match.winnerParticipantId) {
      if (participantId === match.winnerParticipantId) {
        return '1st';
      }
      return '2nd';
    }

    // Semifinal losers: 3rd (if no bronze match is present)
    if (match.round === 4 && match.winnerParticipantId) {
      if (participantId !== match.winnerParticipantId) {
        return '3rd';
      }
    }

    return '';
  }

  getPlacementClass(match: MatchDto, isFirst: boolean): string {
    const label = this.getPlacementLabel(match, isFirst);
    if (label === '1st') return 'place-1st';
    if (label === '2nd') return 'place-2nd';
    if (label === '3rd') return 'place-3rd';
    return '';
  }

  onParticipantClick(match: MatchDto, isFirst: boolean): void {
    if (!this.authService.isAuthenticated()) {
      return;
    }
    const isBye = isFirst ? match.isFirstParticipantBye : match.isSecondParticipantBye;
    const participantId = isFirst ? match.firstParticipantId : match.secondParticipantId;

    if (isBye || !participantId) {
      return;
    }

    this.matchHttpService.setMatchWinner(match.id, participantId).subscribe({
      next: (response) => {
        this.needRefresh.emit();
      },
      error: (error) => {
        console.error('Error setting winner:', error);
        // Handle error (show toast notification, etc.)
      }
    });
  }
}
