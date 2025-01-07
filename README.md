# Infinite Cables Production Warehouse Management System

A modern warehouse management system built for Infinite Production department to manage and track inventory materials efficiently.

## Overview

This system provides a streamlined interface for warehouse operators to:
- Track inventory materials in real-time
- Search for specific items quickly
- Add new materials to inventory
- Update existing item details and quantities
- Remove items from the system
- Monitor stock locations

## Tech Stack

### Frontend
- **Next.js 14** - React framework for production
- **TypeScript** - For type safety and better developer experience
- **Tailwind CSS** - For styling and responsive design
- **shadcn/ui** - High-quality component library
- **Lucide Icons** - Modern icon set

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **Prisma** - Type-safe database client
- **Vercel Postgres** - PostgreSQL database hosted on Vercel

### Deployment
- **Vercel** - For hosting and deployment
- **Vercel Postgres** - For database storage

## Key Features

- **Real-time Inventory Management**
  - Add, edit, and remove items
  - Track quantities and locations
  - View item details

- **Smart Search**
  - Search by item name
  - Search by location
  - Search by details

- **User-Friendly Interface**
  - Clean, modern design
  - Responsive layout
  - Intuitive controls

- **Data Persistence**
  - Reliable data storage
  - Data backup
  - Data integrity checks

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```env
POSTGRES_PRISMA_URL="your-vercel-postgres-url"
POSTGRES_URL_NON_POOLING="your-vercel-postgres-url-non-pooling"
```

4. Run database migrations:
```bash
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## Database Schema

```prisma
model Item {
  id        String   @id @default(cuid())
  name      String
  details   String
  position  String
  quantity  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Support

For support, please contact the Infinite Production IT department.

---

Created and maintained by Infinite Production Department