# MobileShop Setup Guide

This guide will help you set up the MobileShop application with all necessary configurations.

## 🚀 Quick Start

1. **Copy the environment file:**
   ```bash
   cp env.example .env.local
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Supabase database:**
   - Create a new Supabase project
   - Run the SQL schema from `src/lib/database-schema.sql`
   - Get your project URL and API keys

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## 📋 Environment Variables Setup

### Required Variables

#### 1. Supabase Configuration
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

**How to get these:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select existing one
3. Go to Settings → API
4. Copy the Project URL and API keys

#### 2. Better Auth Configuration
```env
BETTER_AUTH_SECRET=your_super_secret_auth_key_here_minimum_32_characters
BETTER_AUTH_URL=http://localhost:3000
```

**How to generate BETTER_AUTH_SECRET:**
```bash
# Generate a secure random string
openssl rand -base64 32
```

#### 3. App Configuration
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Optional Variables

#### Payment Gateway (Pakistan)
For production, you'll need to integrate with a Pakistan payment gateway:

**Popular Options:**
- **JazzCash** - Mobile wallet and payment gateway
- **EasyPaisa** - Mobile financial services
- **Bank Alfalah** - Banking payment gateway
- **HBL** - Habib Bank payment solutions
- **UBL** - United Bank payment gateway

```env
PAYMENT_GATEWAY_API_KEY=your_payment_gateway_api_key_here
PAYMENT_GATEWAY_SECRET=your_payment_gateway_secret_here
PAYMENT_GATEWAY_MERCHANT_ID=your_merchant_id_here
PAYMENT_GATEWAY_BASE_URL=https://api.payment-gateway.pk
```

#### Google OAuth (Optional)
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

**How to get these:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs

#### Email Configuration (Optional)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
```

**For Gmail:**
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password as SMTP_PASS

## 🗄️ Database Setup

### 1. Create Supabase Project
1. Go to [Supabase](https://supabase.com)
2. Sign up/Login
3. Create a new project
4. Wait for the project to be ready

### 2. Run Database Schema
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `src/lib/database-schema.sql`
4. Paste and run the SQL script

### 3. Verify Tables
After running the schema, you should have these tables:
- `users` - User accounts
- `products` - Mobile phone inventory
- `cart_items` - Shopping cart items
- `orders` - Customer orders
- `order_items` - Individual items in orders

## 🔧 Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Access the Application
Open [http://localhost:3000](http://localhost:3000) in your browser

## 🚀 Production Deployment

### 1. Environment Variables for Production
Update these variables for production:
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
BETTER_AUTH_URL=https://your-domain.com
```

### 2. Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### 3. Deploy to Other Platforms
- **Netlify**: Connect your GitHub repository
- **Railway**: Deploy directly from GitHub
- **DigitalOcean**: Use App Platform

## 🔒 Security Considerations

### 1. Environment Variables
- Never commit `.env.local` to version control
- Use different secrets for development and production
- Rotate secrets regularly

### 2. Database Security
- Enable Row Level Security (RLS) in Supabase
- Use service role key only on server-side
- Implement proper user permissions

### 3. Payment Security
- Use HTTPS in production
- Validate all payment data
- Implement proper error handling
- Use webhooks for payment verification

## 🧪 Testing

### 1. Run Tests
```bash
npm test
```

### 2. Test Payment Integration
- Use sandbox/test credentials
- Test with small amounts
- Verify webhook handling

### 3. Test User Flows
- User registration/login
- Product browsing
- Cart functionality
- Checkout process
- Order tracking

## 📱 Mobile App (Future)

The current implementation is web-based. For mobile apps:
- Use React Native with Expo
- Share the same Supabase backend
- Implement push notifications
- Add mobile-specific features

## 🆘 Troubleshooting

### Common Issues

#### 1. Supabase Connection Error
- Check your project URL and API keys
- Ensure your project is active
- Verify network connectivity

#### 2. Authentication Issues
- Check BETTER_AUTH_SECRET is set
- Verify redirect URLs
- Check browser console for errors

#### 3. Payment Gateway Issues
- Verify API credentials
- Check sandbox vs production mode
- Review payment gateway logs

#### 4. Build Errors
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors

### Getting Help
- Check the [README.md](./README.md) for more details
- Review the code comments
- Check Supabase documentation
- Contact support for payment gateway issues

## 📞 Support

For additional help:
- Create an issue in the repository
- Check the documentation
- Contact the development team

---

**Happy coding! 🎉**
