# Idvesta React App

A complete React.js conversion of the Idvesta fintech application with 100% responsive design and visual fidelity to the original.

## Project Structure

```
ridvesta/
├── src/
│   ├── components/          # Reusable React components
│   │   └── Footer.jsx       # Navigation footer
│   ├── pages/               # Page components
│   │   ├── Login.jsx        # Login page
│   │   ├── SignUp.jsx       # Registration page
│   │   ├── OTP.jsx          # OTP verification
│   │   ├── ChangePassword.jsx # Password management
│   │   ├── Home.jsx         # Dashboard
│   │   ├── Profile.jsx      # User profile
│   │   ├── FAQ.jsx          # Help section
│   │   ├── BankData.jsx     # Bank account management
│   │   ├── DepositList.jsx  # Deposit history
│   │   ├── Team.jsx         # Referral network
│   │   └── WithdrawHistory.jsx # Withdrawal history
│   ├── styles/              # CSS modules
│   │   ├── index.css        # Global styles
│   │   ├── home.css         # Dashboard styles
│   │   ├── form.css         # Form/Auth styles
│   │   ├── profile.css      # Profile styles
│   │   ├── faq.css          # FAQ accordion styles
│   │   ├── bank-data.css    # Bank management styles
│   │   ├── deposit-list.css # Transaction list styles
│   │   ├── team.css         # Team/referral styles
│   │   └── footer.css       # Footer navigation styles
│   ├── main.jsx             # React entry point
│   └── App.jsx              # Main app router
├── public/
│   ├── images/              # All app images and icons
│   │   ├── icon/            # Icon files
│   │   └── btn/             # Button graphics
│   └── index.html           # HTML template
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
└── README.md               # This file

## Features

✅ Authentication
- Login page
- Sign-up form
- OTP verification
- Password change

✅ Dashboard
- Real-time balance display
- Earnings settlement tracking
- Investment participation
- Reward claiming

✅ Financial Management
- Deposit history with status tracking
- Withdrawal management
- Bank account management with multiple providers
- Transaction filtering

✅ Social Features
- Referral network visualization
- Commission tracking (3-tier system)
- Team statistics
- QR code sharing

✅ User Profile
- Profile management
- Settings menu
- Account information access

✅ Support
- FAQ with expandable sections
- Customer service information

✅ Design
- Dark theme with glassmorphism effects
- 100% responsive (mobile-first)
- Bootstrap 5.3.8 integration
- Font Awesome icons
- Smooth animations and transitions

## Technology Stack

- **React 18.2.0** - UI library
- **React Router DOM 6.14.0** - Client-side routing
- **Vite 4.4.5** - Build tool & dev server
- **Bootstrap 5.3.8** - CSS utilities
- **Font Awesome 7.0.1** - Icon library
- **Swiper 12.0.0** - Carousel library
- **Modern CSS3** - Glassmorphism, gradients, filters

## Getting Started

### Prerequisites
- Node.js 16+ and npm (or yarn)

### Installation

```bash
# Navigate to project directory
cd ridvesta

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Responsive Design

The application is fully responsive with:
- **Mobile-first approach**: Optimized for 320px - 480px screens
- **Tablet support**: 481px - 768px
- **Desktop**: 769px and above
- **Maximum width**: 440px (matches original design)

## Color Scheme

- **Background**: #0a0b0d (dark)
- **Primary accent**: #2b8fff (blue)
- **Success**: #40ff8c (green)
- **Secondary**: #00ffb7 (cyan)
- **Text**: #ffffff, #dfe0e4, #888e9c

## Key Components Breakdown

### Authentication Flow
1. **Login** → Credentials validation
2. **SignUp** → Registration with security check
3. **OTP** → Phone verification
4. **Home** → Authenticated dashboard

### Investment Dashboard
- Settlement overview with real-time progress
- Earnings display with hourly rates
- Participation & reward claiming
- Educational tooltips

### Financial Management
- Tabbed transaction filtering (All/Success/Pending)
- Bank provider selection (OVO, BCA, Mandiri, etc.)
- Withdrawal tracking with status indicators

### Social/Referral System
- Multi-level network visualization
- Commission percentage display
- Share referral link with copy function
- Network statistics

## State Management

Currently uses React Hooks (useState) for local state management. For larger scale, consider:
- Redux
- Zustand
- Context API

## API Integration (Future)

The app is structured for easy API integration:
```javascript
// Replace mock data with API calls in pages
const [transactions, setTransactions] = useState([]);

useEffect(() => {
  fetchTransactions();
}, []);
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## Performance

- Code splitting via Vite
- Image optimization
- CSS minification
- Lazy component loading ready

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- High contrast color scheme

## Known Limitations & Future Enhancements

- [ ] Add Swiper carousel for gallery sections
- [ ] Implement real API backend integration
- [ ] Add notification system
- [ ] Implement real-time balance updates
- [ ] Add export transaction history (PDF/CSV)
- [ ] Implement dark/light theme toggle
- [ ] Add multilingual support (already has en/id)
- [ ] Setup PWA capabilities

## File Size & Performance

```
dist/
├── index.html        ~2 KB
├── assets/           ~180 KB (optimized)
├── images/           ~6.5 MB (shared)
└── Total built:      ~186 KB (before gzip)
```

## Troubleshooting

### Port already in use
```bash
npm run dev -- --port 3001
```

### Images not loading
- Ensure `public/images/` folder has all asset files
- Check image paths start with `/images/`

### Build errors
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Contributing

This is a conversion project. To maintain consistency:
1. Match original HTML/CSS styling
2. Keep component structure modular
3. Maintain responsive breakpoints
4. Test on mobile devices

## License

This project is based on the original Idvesta design and converted to React for educational purposes.

## Support

For questions or issues:
- Check the FAQ section in the app
- Review component documentation in code comments
- Consult original HTML files in parent `idvesta/` directory

---

**Version**: 1.0.0  
**Last Updated**: April 2026  
**React Version**: 18.2.0
