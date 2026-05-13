# Mobile vs Desktop Workflow Outline

## Goal

Design one shared app that adapts its home page to the device. Mobile should prioritize fast in-store scanning and group overview. Desktop should prioritize review, editing, tables, and printing.

## Core Flow

- User creates a group.
- User scans product barcodes into the group.
- Shopify product data is pulled in automatically.
- User reviews and edits group or product details.
- User selects a group and prints up-to-date labels.

## Device Strategy

- Both mobile and desktop can access the same groups, products, Shopify data, edits, and print state.
- The home page changes priority based on device type.
- Mobile home should emphasize creating groups, scanning, active groups, recent groups, and simple status.
- Desktop home should emphasize groups ready for review, product tables, data issues, edits, and printing.
- Deeper pages can expose the same data on both devices, but mobile should present it in simpler stacked views.

## Mobile Experience

- Home: scan button, create group action, active group, group summaries.
- Scanner: barcode capture, last scanned item, scan count, complete group action.
- Group detail: overview first, with access to product data and edits when needed.

## Desktop Experience

- Home: review queue, group table, product table entry points, print-ready groups.
- Group detail: table-first review with Shopify sync status and warnings.
- Product detail: edit form for label fields, product data, and print-specific values.
- Print flow: preview, label count, printer settings, and final print action.

## Component Approach

- Use shared components for groups, products, status badges, forms, and actions.
- Compose those components differently for mobile cards and desktop tables.
- Keep components small and focused.
- Use existing shadcn components as-is.

## Review Checklist

- Home page priorities match the device.
- Same core data is reachable on mobile and desktop.
- Mobile scanning is fast and touch-friendly.
- Desktop review and printing are clear.
- Shopify sync and print readiness are always visible.
