# Project G-LEARNEX - Design Guidelines

## Design Approach
**Reference-Based Approach** - Drawing inspiration from educational platforms like Khan Academy (playful learning interface) and professional productivity tools like Notion (clean parent/tutor dashboards). This dual-persona approach balances engagement for students with professionalism for adults.

## Core Design Principles

### Dual-Audience Experience
- **Student Interface**: Playful, encouraging, gamified elements with rounded corners and friendly interactions
- **Parent/Tutor Interface**: Clean, data-driven, professional with clear metrics and actionable insights
- **Shared Elements**: Consistent navigation structure, unified brand identity through color palette

## Color System (User-Specified)
```
Primary: #121057 (Deep Navy) - Headers, primary actions, sidebar background
Secondary: #4b4b54 (Charcoal Gray) - Text, secondary elements
Neutral: #e8e8e8 (Light Gray) - Backgrounds, cards, subtle borders
White: #ffffff - Content backgrounds, contrast elements
Accent Success: #10b981 - Progress indicators, achievements
Accent Warning: #f59e0b - Alerts, pending items
Accent Error: #ef4444 - Important notifications, errors
```

## Typography System

**Font Families** (via Google Fonts CDN):
- **Primary**: 'Inter' - Clean, modern sans-serif for UI elements and body text
- **Display**: 'Poppins' - Friendly, rounded for student-facing headings
- **Data**: 'JetBrains Mono' - For code snippets in AI homework assistant

**Type Scale**:
- Hero Display: text-6xl font-bold (student pages), text-5xl font-semibold (parent pages)
- Page Titles: text-4xl font-bold
- Section Headings: text-2xl font-semibold
- Card Titles: text-lg font-medium
- Body Text: text-base font-normal
- Captions: text-sm text-gray-600
- Micro Text: text-xs

## Layout System

### Spacing Primitives (Tailwind)
**Core spacing units**: 2, 4, 6, 8, 12, 16, 20
- Component padding: p-4, p-6, p-8
- Section margins: mb-8, mb-12, mb-16
- Grid gaps: gap-4, gap-6, gap-8
- Element spacing: space-y-4, space-x-6

### Dashboard Layout (User-Specified)
**2:8 Sidebar-to-Content Ratio**:
- Sidebar: Fixed width 16-20% of viewport (w-64 on desktop)
- Main Content: Remaining 80-84% (flex-1)
- Sidebar Structure: Logo/branding (h-16), navigation menu, user profile at bottom
- Content Area: Top bar with page title + actions, scrollable main content with max-w-7xl container

### Grid Systems
- Dashboard Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Resource Library: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4
- Discussion Board: Single column max-w-4xl for optimal readability
- Progress Analytics: grid-cols-1 lg:grid-cols-2 gap-8 (charts + metrics)

## Component Library

### Navigation
- **Sidebar**: Fixed left navigation with icons + labels, active state with bg-primary/10 and border-l-4 accent
- **Top Bar**: Breadcrumbs, search, notifications bell, user avatar dropdown
- **Mobile**: Hamburger menu transforming to slide-out drawer

### Cards & Containers
- **Base Card**: bg-white rounded-xl shadow-sm border border-gray-200 p-6
- **Interactive Card**: Add hover:shadow-md transition-shadow duration-200
- **Student Cards**: More rounded (rounded-2xl), colorful accent borders
- **Parent Cards**: Cleaner, data-focused with subtle shadows

### Buttons
- **Primary**: bg-primary text-white px-6 py-3 rounded-lg font-medium hover:opacity-90
- **Secondary**: bg-secondary text-white px-6 py-3 rounded-lg font-medium
- **Outline**: border-2 border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary/5
- **Ghost**: text-primary hover:bg-primary/5 px-4 py-2 rounded-lg
- **Blur Background** (for hero images): backdrop-blur-md bg-white/20 border border-white/30 text-white px-8 py-4 rounded-xl font-semibold shadow-lg

### Forms
- **Input Fields**: border border-gray-300 rounded-lg px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20
- **Labels**: text-sm font-medium text-secondary mb-2 block
- **Helper Text**: text-xs text-gray-500 mt-1
- **Error States**: border-red-500 focus:ring-red-200

### Data Display
- **Progress Bars**: h-2 bg-gray-200 rounded-full with colored fill (bg-green-500)
- **Stats Cards**: Large number (text-4xl font-bold), label below (text-sm text-gray-600), icon accent
- **Activity Timeline**: Vertical line with circular nodes, timestamp + description
- **Tables**: Striped rows, sticky header, hover:bg-gray-50 on rows

### AI Chat Interface
- **Message Bubbles**: Student messages (bg-primary text-white rounded-2xl rounded-bl-sm p-4 ml-auto max-w-lg), AI responses (bg-gray-100 text-secondary rounded-2xl rounded-tl-sm p-4 max-w-lg)
- **Input Area**: Fixed bottom, shadow-lg, textarea with send button
- **Code Blocks**: bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm with copy button

### Modals & Overlays
- **Modal**: max-w-2xl bg-white rounded-2xl shadow-2xl p-8, backdrop with bg-black/50 backdrop-blur-sm
- **Notification Toast**: Fixed top-right, slide-in animation, auto-dismiss after 5s
- **Dropdown Menus**: shadow-xl rounded-lg border border-gray-200 py-2

## Animations (Framer Motion)

**Page Transitions** (User-Specified - Fade-in):
```
initial: { opacity: 0 }
animate: { opacity: 1 }
transition: { duration: 0.3 }
```

**Card Entrance**: Stagger children with delay, subtle slide-up
**Hover States**: Scale 1.02 on cards, smooth transitions
**Loading States**: Skeleton screens with shimmer effect
**Success Feedback**: Checkmark bounce animation on form submission

## Images

### Hero Image (Intro/Landing Page)
**Description**: Warm, bright photograph showing a parent and child studying together, both smiling. Child (8-12 years old) pointing at a book/tablet while parent looks on encouragingly. Natural lighting, modern home environment, diverse representation. Background slightly blurred to maintain focus on subjects.
**Placement**: Full-width hero section, h-screen or min-h-[600px], with gradient overlay (from-primary/60 to-primary/90) for text readability
**Text Overlay**: Large white heading "Connect. Learn. Grow Together." with subtitle and dual CTAs ("I'm a Student" / "I'm a Parent") using blur-background buttons

### Dashboard Images
- **Empty States**: Friendly illustrations (not photos) for empty resource libraries, no assignments, etc.
- **User Avatars**: Circular, border-2 border-white shadow-md, default to colorful initials
- **Resource Thumbnails**: Consistent aspect ratio (16:9), rounded-lg, hover overlay with view/download icons

### Icon Strategy
**Icon Library**: Heroicons via CDN
- Outline style for navigation, subtle UI elements
- Solid style for active states, filled buttons
- 24px (w-6 h-6) standard size, 20px for compact areas, 32px for feature highlights

## Responsive Behavior

- **Mobile (<768px)**: Sidebar collapses to hamburger, single-column grids, stacked stats
- **Tablet (768px-1024px)**: 2-column grids, sidebar toggleable
- **Desktop (>1024px)**: Full sidebar visible, 3-4 column grids, optimal spacing

## Accessibility
- WCAG AA contrast ratios (verified for #121057 on #e8e8e8)
- Focus indicators: ring-2 ring-primary ring-offset-2
- Aria labels on icon-only buttons
- Keyboard navigation support for all interactive elements
- Screen reader announcements for dynamic content updates