# PhantomPay Design Guidelines

## Design Approach
**System-Based**: Material Design principles with shadcn/ui components, optimized for data-dense dashboard and enterprise productivity workflows.

## Typography
- **Font Family**: font-sans (system default sans-serif stack)
- **Hierarchy**:
  - Page titles: text-2xl font-semibold
  - Section headers: text-lg font-medium
  - Card titles: text-base font-medium
  - Body text: text-sm
  - Helper text: text-xs text-muted-foreground

## Layout System
**Spacing Units**: Tailwind spacing - p-4, p-6, p-8 for consistent padding; gap-4, gap-6 for grids/flexbox
- Dashboard cards: p-6
- Table cells: px-4 py-3
- Form fields: p-3
- Modal/dialog padding: p-6
- Section spacing: space-y-6

## Component Library

### Core Dashboard Components
**StatCard**: Minimal metric display with count, label, and optional trend indicator. Grid layout: 2x2 on desktop, stacked on mobile.

**TopNav**: Fixed header with app name "PhantomPay", global search input, help menu icon. Persistent across all routes.

**Sidebar**: Vertical navigation with sections - Dashboard, Invoices (with due-soon badge count), Customers, Settings. Uses lucide-react icons (FileText, Users, Bell, Settings). Highlight active route state.

### Data Display
**InvoiceTable**: Enterprise-grade table with columns: Number, Customer, Service Type, Issue Date, Due Date, Total, Status, Actions. Support for virtual scrolling (~500 rows). Sticky header.

**Status Badges**: Color-coded by state:
- Draft: gray/neutral
- Sent: blue
- Paid: green
- Overdue: red
- Canceled: slate

**Empty States**: Centered illustration placeholder with descriptive text and primary CTA when no data exists.

### Forms & Inputs
**InvoiceForm**: Two-column layout on desktop (>768px), single column on mobile. Sticky footer with Cancel/Save buttons. Fields include:
- CustomerPicker (combobox with typeahead)
- Number (text input with INV-YYYY-XXXX pattern helper)
- Order ID (optional text input)
- Issue Date / Due Date (date pickers)
- Currency select (default USD)
- Subtotal, Tax inputs with auto-calculated Total display
- Service Type select (enterprise/software/hardware/freelance service)

**CustomerPicker**: Searchable combobox by email/name with "+ Create new customer" inline action.

### Dialogs & Modals
**PayDialog**: Modal with payment method selection (card/ach/wire), transaction ID field, amount (pre-filled with invoice total), and paid date. Confirm/Cancel actions.

**InvoiceForm Dialog**: Full-screen on mobile, centered modal on desktop with max-width constraint.

### Navigation & Filters
**InvoiceFilters**: Horizontal filter bar with search input, status dropdown, and quick range buttons: All | Due soon | Overdue | Paid.

**Bulk Actions**: Checkbox selection system with action bar appearing when rows selected.

## Page Layouts

### Dashboard
Four-card stat grid at top (Total Invoices, Due in 7 Days, Overdue, Paid This Month), followed by Reminder Feed list, and prominent CTAs for "Create Invoice" and "Add Customer".

### Invoices List
Filter controls at top, full-width table below, actions column with View/Mark Paid/Copy Link/More dropdown.

### Invoice Detail
Header with number + status badge + action buttons, then three sections: Summary Card (totals, currency, service type), Customer Card (name, email, company), and Timeline (activity feed).

### Customers Page
Simple data table with Name, Email, Company, Created At columns. Inline create form at top of page.

### Settings Page
Configuration display showing VITE_CONVEX_URL value and documentation links.

## Responsive Behavior
- **Mobile (360px)**: Single column layouts, stacked cards, simplified tables (hide non-essential columns), full-screen modals
- **Desktop (>1024px)**: Multi-column grids, full table display, sidebar always visible

## Interactions
- **Toast notifications**: Success/error feedback for create/update/delete actions
- **Optimistic updates**: Immediate UI reflection of mutations before backend confirmation
- **Hover states**: Row highlighting on tables, button hover effects via shadcn defaults

## Visual Hierarchy
Primary actions (Create Invoice, Mark Paid) use high-contrast buttons. Secondary actions (filters, search) use muted styling. Critical status information (overdue badges, due-soon counts) uses bold, high-contrast treatment.