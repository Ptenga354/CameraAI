@@ .. @@
 # Camera AI Retail Management System
 
-A modern, responsive web application for managing AI-powered camera systems in retail environments.
+A modern, responsive web application for managing AI-powered camera systems in retail environments with comprehensive database integration.
 
 ## Features
 
@@ -15,6 +15,7 @@
 - **Settings Management**: Camera configuration and user management
 - **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
 - **Modern UI**: Clean, intuitive interface with Tailwind CSS
+- **Database Integration**: Full Supabase integration with 2+ months of sample data
 
 ## Tech Stack
 
@@ -22,6 +23,7 @@
 - **TypeScript**: Type-safe development
 - **Tailwind CSS**: Utility-first CSS framework
 - **Lucide React**: Beautiful icons
+- **Supabase**: Backend-as-a-Service with PostgreSQL
 - **Recharts**: Responsive chart library
 - **Vite**: Fast build tool and development server
 
@@ -35,6 +37,19 @@
 npm install
 ```
 
+3. **Set up Supabase**:
+   - Create a new Supabase project at [supabase.com](https://supabase.com)
+   - Copy your project URL and anon key
+   - Create a `.env` file based on `.env.example`:
+
+```bash
+cp .env.example .env
+```
+
+   - Update the `.env` file with your Supabase credentials:
+
+```env
+VITE_SUPABASE_URL=your_supabase_project_url
+VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
+```
+
+4. **Run database migrations**:
+   - In your Supabase dashboard, go to the SQL Editor
+   - Run the migration files in order:
+     1. `supabase/migrations/create_users_and_stores.sql`
+     2. `supabase/migrations/create_cameras_and_zones.sql`
+     3. `supabase/migrations/create_alerts_system.sql`
+     4. `supabase/migrations/create_analytics_tables.sql`
+     5. `supabase/migrations/insert_sample_data.sql`
+
+5. **Start the development server**:
+
 ```bash
 npm run dev
 ```
 
-4. Open your browser and navigate to `http://localhost:5173`
+6. Open your browser and navigate to `http://localhost:5173`
+
+## Database Schema
+
+The system includes a comprehensive database schema with:
+
+### Core Tables
+- **stores**: Store information and settings
+- **store_users**: User management with role-based access
+- **zones**: Store zones for spatial organization
+- **cameras**: Camera management and configuration
+- **alerts**: AI-generated alerts and notifications
+- **alert_types**: Configurable alert categories
+
+### Analytics Tables
+- **customer_visits**: Individual customer tracking
+- **customer_flow**: Hourly aggregated visitor data
+- **zone_activity**: Zone-specific activity metrics
+- **heatmap_data**: Spatial activity intensity data
+- **queue_logs**: Queue length and wait time tracking
+- **system_metrics**: Camera and system performance data
+
+### Sample Data
+The database includes realistic sample data covering:
+- **2+ months** of historical data (November 2024 - January 2025)
+- **10,000+** customer visits with demographics
+- **2,000+** hourly flow records
+- **500+** alerts with various types and severities
+- **5,000+** heatmap data points
+- **1,000+** queue logs
+- **3,000+** system metrics records
 
 ## Project Structure
 
@@ -52,6 +107,10 @@
 ├── src/
 │   ├── components/          # React components
 │   │   ├── Dashboard/       # Dashboard-specific components
 │   │   ├── LiveView/        # Live camera view components
 │   │   ├── Analytics/       # Analytics and charts
 │   │   ├── Alerts/          # Alert management components
 │   │   ├── Settings/        # Settings and configuration
 │   │   └── Layout/          # Layout components (Navbar, etc.)
 │   ├── data/               # Mock data and API simulation
+│   ├── lib/                # Utility libraries (Supabase client)
 │   ├── api/                # API integration layer
 │   ├── types/              # TypeScript type definitions
 │   └── App.tsx             # Main application component
+├── supabase/
+│   └── migrations/         # Database migration files
+├── docs/                   # API documentation
 └── package.json
 ```
 
@@ -79,6 +138,12 @@
 - **Queue Management**: Real-time queue length monitoring
 - **System Metrics**: Camera performance and uptime tracking
 
+## API Integration
+
+The application supports both mock data and live Supabase integration:
+- Toggle between data sources in `src/api/index.ts`
+- Comprehensive API layer with error handling
+- Real-time data updates from Supabase
+
 ## Development
 
 ### Available Scripts
@@ -86,6 +151,9 @@
 - `npm run dev`: Start development server
 - `npm run build`: Build for production
 - `npm run preview`: Preview production build
+- `npm run docs:generate`: Generate API documentation
+- `npm run docs:serve`: Serve interactive API docs
+- `npm run docs:build`: Build static API documentation
 
 ### Adding New Features
 
@@ -93,6 +161,7 @@
 2. Create corresponding TypeScript types in `src/types/`
 3. Add API integration in `src/api/`
 4. Update the main App component to include new routes
+5. Add database migrations if needed
 
 ## Deployment
 
@@ -100,6 +169,11 @@
 
 1. Build the application: `npm run build`
 2. Deploy the `dist` folder to your hosting provider
+3. Set up environment variables in your hosting platform
+4. Ensure Supabase project is properly configured
+
+### Environment Variables
+Make sure to set the following environment variables in production:
+- `VITE_SUPABASE_URL`
+- `VITE_SUPABASE_ANON_KEY`
 
 ## Contributing
 
@@ -107,6 +181,12 @@
 2. Create a feature branch: `git checkout -b feature-name`
 3. Make your changes and commit: `git commit -m 'Add feature'`
 4. Push to the branch: `git push origin feature-name`
 5. Submit a pull request
+
+### Database Changes
+When making database changes:
+1. Create new migration files in `supabase/migrations/`
+2. Test migrations on a development database
+3. Update TypeScript types in `src/lib/supabase.ts`
+4. Update API integration in `src/api/supabaseApi.ts`
 
 ## License
 
 This project is licensed under the MIT License.