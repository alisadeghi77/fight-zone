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
      title: 'مسابقات استان تهران',
      manager: 'رضا سلامی',
      gender: 'male',
      canRegister: true,
      banerimage: 'https://www.wakoindia.org/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-30-at-11.42.04-AM.jpeg',
      price: '۵,۰۰۰,۰۰۰ تومان',
      date: '۱۴۰۳/۰۳/۱۵',
      award: '۵۰,۰۰۰,۰۰۰ تومان',
      location: 'تهران، پاسداران'
    },
    {
      id: 2,
      title: 'مسابقات استان البرز',
      manager: 'سارا محمدی',
      gender: 'female',
      canRegister: true,
      banerimage: 'https://www.wakoindia.org/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-30-at-11.42.04-AM.jpeg',
      price: '۴,۵۰۰,۰۰۰ تومان',
      date: '۱۴۰۳/۰۳/۲۰',
      award: '۴۵,۰۰۰,۰۰۰ تومان',
      location: 'کرج، گلشهر'
    },
    {
      id: 3,
      title: 'مسابقات استان اصفهان',
      manager: 'علی رضایی',
      gender: 'male',
      canRegister: true,
      banerimage: 'https://www.wakoindia.org/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-30-at-11.42.04-AM.jpeg',
      price: '۵,۵۰۰,۰۰۰ تومان',
      date: '۱۴۰۳/۰۳/۲۵',
      award: '۵۵,۰۰۰,۰۰۰ تومان',
      location: 'اصفهان، پل خواجو'
    },
    {
      id: 4,
      title: 'مسابقات استان فارس',
      manager: 'لیلا کریمی',
      gender: 'female',
      canRegister: true,
      banerimage: 'https://www.wakoindia.org/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-30-at-11.42.04-AM.jpeg',
      price: '۵,۰۰۰,۰۰۰ تومان',
      date: '۱۴۰۳/۰۴/۰۲',
      award: '۵۰,۰۰۰,۰۰۰ تومان',
      location: 'شیراز، ارگ کریمخان'
    },
    {
      id: 5,
      title: 'مسابقات استان خراسان رضوی',
      manager: 'حسین محمودی',
      gender: 'male',
      canRegister: true,
      banerimage: 'https://www.wakoindia.org/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-30-at-11.42.04-AM.jpeg',
      price: '۶,۰۰۰,۰۰۰ تومان',
      date: '۱۴۰۳/۰۴/۱۰',
      award: '۶۰,۰۰۰,۰۰۰ تومان',
      location: 'مشهد، بلوار وکیل آباد'
    },
    {
      id: 6,
      title: 'مسابقات استان مازندران',
      manager: 'نرگس احمدی',
      gender: 'female',
      canRegister: true,
      banerimage: 'https://www.wakoindia.org/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-30-at-11.42.04-AM.jpeg',
      price: '۴,۵۰۰,۰۰۰ تومان',
      date: '۱۴۰۳/۰۴/۱۵',
      award: '۴۵,۰۰۰,۰۰۰ تومان',
      location: 'ساری، میدان امام'
    },
    {
      id: 7,
      title: 'مسابقات استان گیلان',
      manager: 'امیرحسین کریمی',
      gender: 'male',
      canRegister: true,
      banerimage: 'https://www.wakoindia.org/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-30-at-11.42.04-AM.jpeg',
      price: '۵,۰۰۰,۰۰۰ تومان',
      date: '۱۴۰۳/۰۴/۲۰',
      award: '۵۰,۰۰۰,۰۰۰ تومان',
      location: 'رشت، میدان شهرداری'
    },
    {
      id: 8,
      title: 'مسابقات استان خوزستان',
      manager: 'فاطمه رضایی',
      gender: 'female',
      canRegister: true,
      banerimage: 'https://www.wakoindia.org/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-30-at-11.42.04-AM.jpeg',
      price: '۵,۵۰۰,۰۰۰ تومان',
      date: '۱۴۰۳/۰۴/۲۵',
      award: '۵۵,۰۰۰,۰۰۰ تومان',
      location: 'اهواز، کیانپارس'
    },
    {
      id: 9,
      title: 'مسابقات استان کرمان',
      manager: 'رضا احمدی',
      gender: 'male',
      canRegister: true,
      banerimage: 'https://www.wakoindia.org/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-30-at-11.42.04-AM.jpeg',
      price: '۵,۰۰۰,۰۰۰ تومان',
      date: '۱۴۰۳/۰۵/۰۲',
      award: '۵۰,۰۰۰,۰۰۰ تومان',
      location: 'کرمان، بازار بزرگ'
    },
    {
      id: 10,
      title: 'مسابقات استان همدان',
      manager: 'سمیه موسوی',
      gender: 'female',
      canRegister: false,
      banerimage: 'https://www.wakoindia.org/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-30-at-11.42.04-AM.jpeg',
      price: '۴,۵۰۰,۰۰۰ تومان',
      date: '۱۴۰۳/۰۵/۱۰',
      award: '۴۵,۰۰۰,۰۰۰ تومان',
      location: 'همدان، میدان امام'
    },
    {
      id: 11,
      title: 'مسابقات استان اردبیل',
      manager: 'محمد رضایی',
      gender: 'male',
      canRegister: true,
      banerimage: 'https://www.wakoindia.org/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-30-at-11.42.04-AM.jpeg',
      price: '۵,۰۰۰,۰۰۰ تومان',
      date: '۱۴۰۳/۰۵/۱۵',
      award: '۵۰,۰۰۰,۰۰۰ تومان',
      location: 'اردبیل، خیابان شریعتی'
    },
    {
      id: 12,
      title: 'مسابقات استان کرمانشاه',
      manager: 'مریم کریمی',
      gender: 'female',
      canRegister: true,
      banerimage: 'https://www.wakoindia.org/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-30-at-11.42.04-AM.jpeg',
      price: '۵,۵۰۰,۰۰۰ تومان',
      date: '۱۴۰۳/۰۵/۲۰',
      award: '۵۵,۰۰۰,۰۰۰ تومان',
      location: 'کرمانشاه، خیابان مدرس'
    },
    {
      id: 13,
      title: 'مسابقات استان مرکزی',
      manager: 'سعید احمدی',
      gender: 'male',
      canRegister: true,
      banerimage: 'https://www.wakoindia.org/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-30-at-11.42.04-AM.jpeg',
      price: '۵,۰۰۰,۰۰۰ تومان',
      date: '۱۴۰۳/۰۵/۲۵',
      award: '۵۰,۰۰۰,۰۰۰ تومان',
      location: 'اراک، خیابان امام'
    },
    {
      id: 14,
      title: 'مسابقات استان قم',
      manager: 'زهرا موسوی',
      gender: 'female',
      canRegister: true,
      banerimage: 'https://www.wakoindia.org/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-30-at-11.42.04-AM.jpeg',
      price: '۴,۵۰۰,۰۰۰ تومان',
      date: '۱۴۰۳/۰۶/۰۲',
      award: '۴۵,۰۰۰,۰۰۰ تومان',
      location: 'قم، بلوار معصومیه'
    }
  ];

}
