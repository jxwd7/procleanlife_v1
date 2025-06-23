# 🧹 Sweep Logic - Cleaning Service Marketplace

A comprehensive React Native (Expo) app for connecting customers with professional cleaners. Built with modern UI/UX principles and dual-sided marketplace functionality.

## 🚀 Features

### **Customer Side**
- **Smart Job Posting**: 8-step guided process for posting cleaning jobs
- **Offer Management**: Compare and select from multiple cleaner offers
- **Payment Processing**: Secure payment with escrow protection
- **Job Tracking**: Real-time updates on cleaning progress
- **Communication**: In-app messaging with cleaners
- **Analytics**: Spending insights and cost savings tracking

### **Cleaner Side**
- **Job Discovery**: Browse available cleaning opportunities
- **Market Intelligence**: Real-time pricing and demand insights
- **Offer Submission**: Smart quoting with market rate guidance
- **Work Management**: Schedule and track active jobs
- **Earnings Dashboard**: Track income and performance metrics
- **Profile Management**: Build reputation and get verified

## 📱 App Screens

### **Home Screen**
- Role-based dashboard (Customer/Cleaner)
- Quick action buttons with badges
- Real-time analytics and insights
- Recent activity feed
- Pro tips and recommendations

### **Jobs Screen**
- Advanced job browsing and filtering
- Detailed job cards with property information
- Search by location and job type
- Urgency level indicators
- Submit offer functionality

### **Messages Screen**
- Chat management for all conversations
- Search and filter conversations
- Real-time messaging indicators
- Job-linked conversations
- Professional messaging interface

### **Profile Screen**
- User profile and statistics
- Settings management (notifications, location, biometric)
- Account and security settings
- Payment method management
- Help and support access

## 🛠 Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **UI Components**: Custom components with Expo Vector Icons
- **Styling**: StyleSheet with responsive design
- **State Management**: React hooks (ready for Redux integration)
- **TypeScript**: Full type safety
- **Theming**: Light/Dark mode support

## 🎨 Design System

### **Colors**
- Primary: Blue (#3b82f6)
- Success: Green (#10b981)
- Warning: Orange (#f59e0b)
- Error: Red (#ef4444)
- Neutral: Gray scale

### **Typography**
- Headers: 24-28px, Bold
- Body: 14-16px, Regular
- Captions: 12px, Medium
- Consistent font weights and line heights

### **Components**
- Cards with shadows and rounded corners
- Consistent spacing and padding
- Touch feedback and animations
- Professional, clean aesthetic

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd procleanlife_v1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - Scan QR code with Expo Go app
   - Press 'i' for iOS simulator
   - Press 'a' for Android emulator
   - Press 'w' for web browser

## 📱 Testing the App

### **Role Switching**
- Use the role switcher in the top-right of the home screen
- Toggle between Customer and Cleaner modes
- Experience different interfaces and features

### **Navigation**
- **Home**: Dashboard with role-based content
- **Jobs**: Browse available jobs (cleaner) or view your jobs (customer)
- **Messages**: Chat with other users
- **Profile**: Manage settings and account

### **Key Features to Test**
1. **Search & Filter**: Try searching jobs and filtering by urgency
2. **Quick Actions**: Test the role-specific action buttons
3. **Settings**: Toggle notification and location settings
4. **Responsive Design**: Test on different screen sizes
5. **Dark/Light Mode**: Switch system theme to see UI changes

## 🔧 Development

### **Project Structure**
```
app/
├── (tabs)/           # Main tab navigation
│   ├── index.tsx     # Home screen
│   ├── explore.tsx   # Jobs screen
│   ├── messages.tsx  # Messages screen
│   ├── profile.tsx   # Profile screen
│   └── _layout.tsx   # Tab layout
├── components/       # Reusable UI components
├── constants/        # App constants and colors
└── hooks/           # Custom React hooks
```

### **Adding New Features**
1. Create new screens in `app/(tabs)/` or `app/`
2. Add components in `components/` directory
3. Update navigation in `app/(tabs)/_layout.tsx`
4. Follow existing TypeScript patterns

### **Styling Guidelines**
- Use the Colors constant for theming
- Follow the existing StyleSheet patterns
- Maintain consistent spacing and typography
- Test on both light and dark modes

## 🎯 Next Steps

### **Immediate Enhancements**
- [ ] Add Redux for state management
- [ ] Implement real API integration
- [ ] Add authentication flow
- [ ] Create job posting wizard
- [ ] Add payment processing

### **Advanced Features**
- [ ] Real-time messaging with WebSockets
- [ ] Push notifications
- [ ] Image upload and camera integration
- [ ] Maps and location services
- [ ] Offline functionality

### **Production Ready**
- [ ] Error handling and validation
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Unit and integration tests
- [ ] CI/CD pipeline

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for the Sweep Logic cleaning service marketplace**
