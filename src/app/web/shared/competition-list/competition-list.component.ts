import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompetitionDto } from 'src/app/shared/models/competition.models';
import { CompetitionHttpService } from 'src/app/shared/http-services/competition-http-service';

@Component({
  selector: 'app-competition-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './competition-list.component.html',
  styleUrls: ['./competition-list.component.scss']
})
export class CompetitionListComponent implements OnInit {
  competitions: CompetitionDto[] = [];
  loading = false;
  loadingMore = false;
  error: string | null = null;
  hasMore = true;
  
  // Pagination state
  private currentPage = 0;
  private pageSize = 6; // Number of items per page
  private allCompetitions: CompetitionDto[] = []; // Store all fetched competitions
  private scrollThreshold = 500; // Distance from bottom to trigger load (in pixels)

  constructor(private competitionHttpService: CompetitionHttpService) {}

  ngOnInit(): void {
    this.loadCompetitions();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (this.loading || this.loadingMore || !this.hasMore) {
      return;
    }

    const scrollPosition = window.pageYOffset + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    // Check if user has scrolled near the bottom
    if (pageHeight - scrollPosition < this.scrollThreshold) {
      this.onLoadMore();
    }
  }

  private loadCompetitions(): void {
    this.loading = true;
    this.error = null;
    
    this.competitionHttpService.getCompetitions().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.allCompetitions = response.data;
          this.currentPage = 0;
          this.loadPage();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading competitions:', err);
        this.error = 'خطا در بارگذاری مسابقات';
        this.loading = false;
      }
    });
  }

  private onLoadMore(): void {
    if (this.loadingMore || !this.hasMore) {
      return;
    }

    this.loadingMore = true;
    
    // Simulate a small delay for better UX (optional)
    setTimeout(() => {
      this.currentPage++;
      this.loadPage();
      this.loadingMore = false;
    }, 0);
  }

  private loadPage(): void {
    const startIndex = 0;
    const endIndex = (this.currentPage + 1) * this.pageSize;
    
    this.competitions = this.allCompetitions.slice(startIndex, endIndex);
    this.hasMore = endIndex < this.allCompetitions.length;
  }
}

