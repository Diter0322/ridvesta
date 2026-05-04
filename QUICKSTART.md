# 🚀 Quick Start Guide

## Installation & Running (60 seconds)

```bash
# Step 1: Navigate to project
cd c:\xampp\htdocs\idvesta\ridvesta

# Step 2: Install dependencies
npm install

# Step 3: Start dev server
npm run dev

# Done! Open http://localhost:3000
```

## Key Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Project Structure at a Glance

```
ridvesta/
├── 📄 index.html          # HTML template
├── 📄 package.json        # Dependencies
├── 📄 vite.config.js      # Build config
├── 📁 src/
│   ├── App.jsx           # Main router
│   ├── main.jsx          # Entry point
│   ├── 📁 pages/         # All page components (11 files)
│   ├── 📁 components/    # Reusable components (Footer)
│   └── 📁 styles/        # CSS files (10 stylesheets)
└── 📁 public/
    └── 📁 images/        # All assets (63 files)
```

## Page Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/login` | Login.jsx | User authentication |
| `/signup` | SignUp.jsx | Registration |
| `/otp` | OTP.jsx | Phone verification |
| `/change-password` | ChangePassword.jsx | Password update |
| `/home` | Home.jsx | Dashboard (main) |
| `/profile` | Profile.jsx | User profile |
| `/faq` | FAQ.jsx | Help section |
| `/bank-data` | BankData.jsx | Bank management |
| `/deposit-list` | DepositList.jsx | Deposit history |
| `/withdraw-history` | WithdrawHistory.jsx | Withdraw history |
| `/team` | Team.jsx | Referral network |

## Features Overview

### 🔐 Authentication
- Login with credentials
- Registration with validation
- OTP verification
- Password management

### 💰 Dashboard
- Balance display
- Earnings tracking
- Settlement status
- Quick actions

### 📊 Financial
- Deposit/Withdrawal history
- Bank account management
- Transaction filtering
- Status tracking

### 👥 Social
- Referral network
- Multi-tier commission
- Share links
- Team statistics

### ⚙️ User
- Profile management
- Settings
- FAQ access
- LogOut option

## Responsive Breakpoints

```
Mobile:   < 480px       ← Optimized primary
Tablet:   480px - 768px
Desktop:  > 768px
Max:      440px (constraint)
```

## Color Reference

```
Primary Blue:     #2b8fff   (buttons, accents)
Success Green:    #40ff8c   (positive status)
Cyan:             #00ffb7   (secondary accent)
Dark Background:  #0a0b0d   (main bg)
Text Light:       #ffffff   (primary text)
Text Med:         #dfe0e4   (secondary text)
Text Dark:        #888e9c   (tertiary text)
```

## Components Breakdown

### Pages (11 Total)
- **Auth Pages**: Login, SignUp, OTP, ChangePassword
- **Dashboard**: Home
- **Management**: Profile, FAQ, BankData, DepositList, WithdrawHistory
- **Community**: Team

### Shared Components
- **Footer**: Navigation footer with 3 tabs

### Styling
- **Global**: index.css (utilities, typography)
- **Per Page**: Dedicated CSS files
- **Responsive**: Mobile-first approach

## Development Workflow

### 1. Making Changes
```javascript
// Edit a page component
// Changes auto-reload (HMR enabled)
```

### 2. Adding CSS
```css
/* Create .css file in src/styles/ */
/* Import in component: import '../styles/name.css' */
```

### 3. Adding Images
```javascript
// Place in public/images/
// Reference as: <img src="/images/name.jpg" />
```

### 4. Adding Pages
```javascript
// Create in src/pages/
// Import in App.jsx
// Add route in App.jsx
```

## Deployment Options

### Quick Deploy (2 minutes - Vercel)
```bash
npm i -g vercel
vercel
```

### Docker Deploy (5 minutes)
```bash
docker build -t idvesta .
docker run -p 80:80 idvesta
```

### XAMPP Local (1 minute)
```bash
npm run build
# Copy dist/ to htdocs/idvesta/ridvesta
```

See **DEPLOYMENT.md** for detailed instructions.

## Troubleshooting

### Port 3000 in use?
```bash
npm run dev -- --port 3001
```

### Images not loading?
- Check: `public/images/` has files
- Check: Paths start with `/images/`

### Build errors?
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## File Sizes

- **Unbuilt**:     ~500 MB (node_modules)
- **Built**:       ~180 KB (optimized)
- **Images**:      ~6.5 MB (shared assets)

## Browser Versions

- Chrome/Edge: 90+
- Firefox: 88+
- Safari: 14+
- Mobile: iOS Safari 14+, Chrome Mobile

## Documentation Files

1. **README.md** - Complete documentation
2. **DEPLOYMENT.md** - Deployment guide
3. **PROJECT_SUMMARY.md** - What was built
4. **QUICKSTART.md** - This file

## Support Resources

- Vite Docs: https://vitejs.dev
- React Docs: https://react.dev
- Bootstrap: https://getbootstrap.com
- Font Awesome: https://fontawesome.com

## Common Tasks

### Check for outdated packages
```bash
npm outdated
```

### Update dependencies
```bash
npm update
```

### Fix security vulnerabilities
```bash
npm audit fix
```

### Clear npm cache
```bash
npm cache clean --force
```

### Check bundle size
```bash
npm run build
```

## Git Commands

```bash
# Initialize git (if needed)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: React conversion"

# Push to GitHub
git push origin main
```

## Environment Variables

Create `.env` file:
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Idvesta
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Performance Checklist

- ✅ Components lazy-loaded
- ✅ Images optimized
- ✅ CSS minified
- ✅ No console errors
- ✅ Fast FCP (First Contentful Paint)

## Mobile Testing

### iOS Safari
- Rotate device to test responsive
- Check touch interactions
- Verify fonts render correctly

### Android Chrome
- Test on actual device if possible
- Check performance on older devices
- Verify tap-to-zoom disabled

## Production Checklist

- [ ] Run `npm run build`
- [ ] Test `npm run preview`
- [ ] Check all routes work
- [ ] Verify images load
- [ ] Test on mobile
- [ ] Check console for errors
- [ ] Deploy using chosen method

---

**Need more help?** Check README.md or DEPLOYMENT.md in the project root! 🎉
