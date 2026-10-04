# Iniyan Crackers inquiry website

A responsive crackers catalogue and WhatsApp inquiry website. Customers can browse the 2026 price list, choose quantities, review market and sale price totals, enter their details, and open a pre-filled WhatsApp inquiry. No payments, database, or personal information storage are used.

## Run locally

Install dependencies with `npm install`, then use `npm run dev` for local development or `npm run build` for a production build.

## Edit business details

Open `src/config.ts`. Change `BUSINESS_NAME`, `OWNER_WHATSAPP`, `BUSINESS_PHONE`, `BUSINESS_AREA`, or `BUSINESS_HOURS`. The WhatsApp number is used everywhere from this single configuration value.

## Edit products and prices

Open `src/products.ts`. Each product row contains its name, market price, and sale price inside its category section. To add a product, add another row. To remove one, remove its row. Set `available: false` in the generated product object when an item should be shown as unavailable.

All totals and WhatsApp subtotals use the sale price. Market prices remain visible so customers can see their savings.

## WhatsApp behavior

The website uses WhatsApp click-to-chat. It does not send anything silently. The customer must complete the name, Indian mobile number, and area fields first; then WhatsApp opens with the complete inquiry message ready for the customer to press Send.

## GitHub

Upload the project files to a new GitHub repository. Keep the source files and package manifest together so the project can be installed and built independently.
