# MobileShop - Premium Mobile Phones E-commerce Platform

A modern, Apple-inspired e-commerce platform for mobile phones built with Next.js, Supabase, and Better Auth.

## Features

### 🛍️ Core E-commerce Features
- **Product Listing**: Browse and search mobile phones with advanced filtering
- **Shopping Cart**: Add, remove, and manage items in cart with real-time updates
- **Secure Checkout**: Credit card payment processing with Pakistan payment gateway
- **Order Management**: Track orders with real-time status updates
- **Order Cancellation**: Cancel orders with dynamic fee calculation based on order value

### 👤 User Features
- **User Authentication**: Sign up, sign in with email/password and Google OAuth
- **User Profile**: Manage personal information and order history
- **Order Tracking**: Real-time order status and tracking information

### 🛡️ Admin Features
- **Product Management**: Add, edit, and manage product inventory
- **Order Management**: Process and manage customer orders
- **User Management**: View and manage customer accounts

### 🎨 Design & UX
- **Apple-inspired UI**: Clean, modern design with smooth animations
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: WCAG compliant with keyboard navigation support

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS with custom components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Better Auth
- **Payment**: Pakistan Payment Gateway integration
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Pakistan Payment Gateway account (optional for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mobile-shop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

   # Better Auth Configuration
   BETTER_AUTH_SECRET=your_better_auth_secret_here
   BETTER_AUTH_URL=http://localhost:3000

   # Payment Gateway Configuration (Pakistan)
   PAYMENT_GATEWAY_API_KEY=your_payment_gateway_api_key_here
   PAYMENT_GATEWAY_SECRET=your_payment_gateway_secret_here
   PAYMENT_GATEWAY_MERCHANT_ID=your_merchant_id_here

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up Supabase Database**
   - Create a new Supabase project
   - Run the SQL schema from `src/lib/database-schema.sql` in your Supabase SQL editor
   - This will create all necessary tables and sample data

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses the following main tables:

- **users**: User accounts and profiles
- **products**: Mobile phone inventory
- **cart_items**: Shopping cart items
- **orders**: Customer orders
- **order_items**: Individual items within orders

## Key Features Implementation

### Order Cancellation Fees
The system implements dynamic cancellation fees based on order value:
- Orders below PKR 50,000: PKR 3,000 fee
- Orders between PKR 50,000 - PKR 80,000: PKR 5,000 fee
- Orders between PKR 80,000 - PKR 150,000: PKR 8,000 fee
- Orders above PKR 150,000: PKR 10,000 fee

### Payment Integration
- Secure credit card processing
- SSL encryption for all transactions
- Integration with Pakistan payment gateways
- Support for multiple payment methods

### Real-time Features
- Live cart updates
- Order status tracking
- Inventory management
- User session management

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication pages
│   ├── products/          # Product listing and details
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   ├── orders/            # Order management
│   └── admin/             # Admin panel
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── products/         # Product-specific components
├── lib/                  # Utility functions and configurations
│   ├── supabase.ts       # Database client and types
│   ├── auth.ts           # Authentication configuration
│   ├── auth-context.tsx  # Authentication context
│   ├── cart-context.tsx  # Shopping cart context
│   └── utils.ts          # Utility functions
└── styles/               # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@mobileshop.pk or create an issue in the repository.

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Advanced search with AI
- [ ] Social media integration
- [ ] Loyalty program
- [ ] Advanced inventory management
- [ ] API for third-party integrations