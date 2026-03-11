# Personal Budgeting Application (Next.js + Prisma + SQLite)

Simple single-user budgeting app built with:

- Next.js (App Router)
- React
- Tailwind CSS
- Prisma ORM
- SQLite (`prisma/dev.db`)

No authentication is required.

---

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create your local environment file:

```bash
cp .env.example .env
```

3. Run Prisma migration (creates local SQLite DB and tables):

```bash
npx prisma migrate dev
```

4. Start development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## Project Structure

```text
.
├── app
│   ├── api
│   │   ├── categories
│   │   │   ├── [id]/route.ts
│   │   │   └── route.ts
│   │   ├── expenses
│   │   │   ├── [id]/route.ts
│   │   │   └── route.ts
│   │   └── income
│   │       ├── [id]/route.ts
│   │       └── route.ts
│   ├── categories/page.tsx
│   ├── dashboard/page.tsx
│   ├── expenses/page.tsx
│   ├── income/page.tsx
│   ├── reports/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── CategoryManager.tsx
│   ├── ExpenseManager.tsx
│   ├── IncomeManager.tsx
│   ├── Sidebar.tsx
│   └── StatCard.tsx
├── lib
│   ├── api.ts
│   ├── budget.ts
│   ├── defaultCategories.ts
│   ├── format.ts
│   └── prisma.ts
├── prisma
│   ├── migrations
│   └── schema.prisma
├── prisma.config.ts
└── .env.example
```

---

## Prisma Schema

`prisma/schema.prisma` includes:

- `Income` table (`income`)
- `Expense` table (`expenses`)
- `Category` table (`categories`)

Key fields:

- `Income`: `id`, `amount`, `source`, `description`, `date`, `created_at`
- `Expense`: `id`, `amount`, `category_id`, `description`, `date`, `created_at`
- `Category`: `id`, `name`, `created_at`

---

## Core Features

### Dashboard

- Current balance
- Total earnings
- Total expenses
- Expense breakdown by category
- Monthly summary

### Income

- Add income
- Edit income
- Delete income
- List income entries

### Expenses

- Add expense
- Edit expense
- Delete expense
- List expenses

### Categories

- Predefined categories auto-created:
  - Food
  - Transport
  - Bills
  - Entertainment
  - Health
  - Shopping
  - Other
- Add category
- Delete category

### Reports

- Total spending per category
- Monthly income vs expenses
- Current remaining balance
- Optional month filter

---

## API Routes (CRUD)

- `GET /api/income`
- `POST /api/income`
- `PUT /api/income/:id`
- `DELETE /api/income/:id`

- `GET /api/expenses`
- `POST /api/expenses`
- `PUT /api/expenses/:id`
- `DELETE /api/expenses/:id`

- `GET /api/categories`
- `POST /api/categories`
- `DELETE /api/categories/:id`

---

## Notes

- The SQLite DB file is local: `prisma/dev.db`.
- This project is designed for one local user and intentionally keeps logic simple.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
