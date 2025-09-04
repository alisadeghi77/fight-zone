# Web Module

This module contains the public-facing web application with RTL and Persian language support.

## Structure

```
web/
├── layout/
│   └── web-layout.component.*     # Main layout with header and footer
├── pages/
│   ├── home/
│   │   └── home.component.*       # Home page (default route)
│   ├── competition-list/
│   │   └── competition-list.component.*  # Competition list page (/competitions)
│   └── otp-login/
│       └── otp-login.component.*  # OTP login page (/otp-login)
├── web-routing.module.ts          # Web module routing
└── web-module.ts                  # Web module definition
```

## Routes

- `/` - Home page (default)
- `/competitions` - Competition list page
- `/otp-login` - OTP login page (no layout)

## Features

- **RTL Support**: All components are designed for right-to-left languages
- **Persian Language**: All text content is in Persian
- **Bootstrap Styling**: Uses Bootstrap 5 for responsive design
- **Minimal Custom CSS**: Only essential custom styles for RTL adjustments
- **Responsive Design**: Mobile-first approach with Bootstrap grid system

## Components

### WebLayoutComponent
- Header with logo, navigation, and login button
- Footer with copyright information
- Router outlet for child components

### HomeComponent
- Welcome message and call-to-action buttons
- Feature cards showcasing platform benefits
- Links to competitions and login

### CompetitionListComponent
- List of competitions with details
- Status badges (active/ended)
- Prize amounts and participant counts
- Filter options

### OtpLoginComponent
- Two-step authentication process
- Phone number input with validation
- OTP code verification
- No layout wrapper (full page)

## Styling

All components use Bootstrap classes with minimal custom CSS for:
- RTL text alignment
- Hover effects
- Custom spacing adjustments
- Persian font support
