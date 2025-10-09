export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  role?: string[];
  isMainParent?: boolean;
}

export const NavigationItems: NavigationItem[] = [
  {
    title: 'مسابقات',
    id: 'competitions',
    type: 'item',
    classes: 'nav-item',
    url: '/management/competitions',
    icon: 'ti ti-dashboard',
    breadcrumbs: false
  }


];
