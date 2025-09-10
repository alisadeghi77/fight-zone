
// Angular import
import { AfterViewInit, Component, inject } from '@angular/core';
import { CommonModule, Location, LocationStrategy } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

// Project import
import { ProjectThemConfig } from 'src/app/app-config';
import { NavigationComponent } from '../navigation/navigation.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumbs/breadcrumbs.component';
import { AuthService } from '../../../shared/services/auth.service';



@Component({
  selector: 'app-management-layout',
  imports: [CommonModule, NavigationComponent, NavBarComponent, RouterModule, BreadcrumbComponent],
  templateUrl: './management-layout-component.html',
  styleUrl: './management-layout-component.scss'
})
export class ManagementLayoutComponent implements AfterViewInit {
  private location = inject(Location);
  private locationStrategy = inject(LocationStrategy);
  private router = inject(Router);
  private authService = inject(AuthService);
  cdr = inject(ChangeDetectorRef);

  // public props
  currentLayout!: string;
  navCollapsed = true;
  navCollapsedMob = false;
  windowWidth!: number;

  // Constructor

  // life cycle hook

  ngAfterViewInit() {
    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }

    if (current_url === baseHref + '/layout/theme-compact' || current_url === baseHref + '/layout/box') {
      ProjectThemConfig.isCollapse_menu = true;
    }

    this.windowWidth = window.innerWidth;
    this.navCollapsed = this.windowWidth >= 1025 ? ProjectThemConfig.isCollapse_menu : false;
    this.cdr.detectChanges();
  }

  // private method
  private isThemeLayout(layout: string) {
    this.currentLayout = layout;
  }

  // public method
  navMobClick() {
    if (this.navCollapsedMob && !document.querySelector('app-navigation.coded-navbar')?.classList.contains('mob-open')) {
      this.navCollapsedMob = !this.navCollapsedMob;
      setTimeout(() => {
        this.navCollapsedMob = !this.navCollapsedMob;
      }, 100);
    } else {
      this.navCollapsedMob = !this.navCollapsedMob;
    }
    if (document.querySelector('app-navigation.pc-sidebar')?.classList.contains('navbar-collapsed')) {
      document.querySelector('app-navigation.pc-sidebar')?.classList.remove('navbar-collapsed');
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeMenu();
    }
  }

  closeMenu() {
    if (document.querySelector('app-navigation.pc-sidebar')?.classList.contains('mob-open')) {
      document.querySelector('app-navigation.pc-sidebar')?.classList.remove('mob-open');
    }
  }

  logout() {
    debugger;
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }
}
