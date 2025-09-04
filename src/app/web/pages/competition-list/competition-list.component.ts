import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-competition-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './competition-list.component.html',
  styleUrls: ['./competition-list.component.scss']
})
export class CompetitionListComponent {
  competitions = [
    {
      id: 1,
      title: 'مسابقه طراحی گرافیک',
      description: 'مسابقه طراحی لوگو و پوستر برای برندهای مختلف',
      prize: '۵,۰۰۰,۰۰۰ تومان',
      participants: 1250,
      endDate: '۱۴۰۳/۰۳/۱۵',
      status: 'فعال'
    },
    {
      id: 2,
      title: 'مسابقه برنامه‌نویسی',
      description: 'مسابقه حل مسائل الگوریتمی و برنامه‌نویسی',
      prize: '۱۰,۰۰۰,۰۰۰ تومان',
      participants: 890,
      endDate: '۱۴۰۳/۰۳/۲۰',
      status: 'فعال'
    },
    {
      id: 3,
      title: 'مسابقه عکاسی',
      description: 'مسابقه عکاسی با موضوع طبیعت و زندگی شهری',
      prize: '۳,۰۰۰,۰۰۰ تومان',
      participants: 2100,
      endDate: '۱۴۰۳/۰۳/۱۰',
      status: 'فعال'
    },
    {
      id: 4,
      title: 'مسابقه نویسندگی',
      description: 'مسابقه داستان‌نویسی و مقاله‌نویسی',
      prize: '۲,۰۰۰,۰۰۰ تومان',
      participants: 750,
      endDate: '۱۴۰۳/۰۲/۲۸',
      status: 'پایان یافته'
    }
  ];

  getStatusClass(status: string): string {
    switch (status) {
      case 'فعال':
        return 'badge bg-success';
      case 'پایان یافته':
        return 'badge bg-secondary';
      default:
        return 'badge bg-primary';
    }
  }
}
