# DrishyaCity - Netlify CMS Portfolio Website

A fully CMS-enabled portfolio website for DrishyaCity graphic design services, built with Netlify CMS for easy content management.

## 🚀 Features

- **Fully CMS Editable**: All content can be managed through Netlify CMS
- **Responsive Design**: Works perfectly on all devices
- **Portfolio Management**: Easy portfolio item creation and editing
- **Dynamic Content Loading**: Content loads from markdown files
- **SEO Optimized**: Meta tags, sitemap, and robots.txt included
- **Modal Portfolio Views**: Detailed project views with image galleries
- **Contact Form Integration**: Working contact form with Formspree
- **Pricing & FAQ Pages**: Fully editable pricing plans and FAQs
- **Privacy Policy**: Complete privacy policy page

## 📁 Project Structure

```
drishyacity.main/
├── admin/                  # Netlify CMS admin interface
│   ├── config.yml         # CMS configuration
│   └── index.html         # CMS admin page
├── content/               # CMS content files
│   ├── settings/          # Site settings
│   ├── pages/            # Page content
│   └── portfolio/        # Portfolio items
├── css/                  # Stylesheets
├── js/                   # JavaScript files
├── images/               # Static images
├── portfolio/            # Portfolio images
└── *.html               # HTML pages
```

## 🛠 Setup Instructions

### 1. Deploy to Netlify

1. Connect your repository to Netlify
2. Set build command: (leave empty for static site)
3. Set publish directory: `/` (root)
4. Deploy the site

### 2. Enable Netlify Identity

1. Go to your Netlify site dashboard
2. Navigate to **Identity** tab
3. Click **Enable Identity**
4. Go to **Settings & usage**
5. Set **Registration preferences** to "Invite only"
6. Enable **Git Gateway** in the Identity settings

### 3. Access the CMS

1. Visit `your-site-url.netlify.app/admin`
2. Click "Login with Netlify Identity"
3. You'll be redirected to create an account
4. Once logged in, you can manage all content

## 📝 Content Management

### Site Settings
- Update site title, description, logo
- Manage contact information
- Update social media links

### Pages
- **Home**: Hero section, featured work, services
- **About**: Profile, skills, experience
- **Contact**: Contact form settings, process steps
- **Pricing**: Pricing plans and features
- **FAQ**: Questions and answers
- **Privacy Policy**: Legal content

### Portfolio
- Add new portfolio items
- Upload images and galleries
- Set categories (branding, digital, print)
- Add project details, tools, colors, fonts
- Write detailed project descriptions

## 🎨 Customization

### Colors
The site uses CSS custom properties for easy color customization:
- `--primary-color`: Main brand color (gold)
- `--text-primary`: Main text color
- `--text-secondary`: Secondary text color

### Fonts
- Primary font: Poppins (Google Fonts)
- Weights: 300, 400, 500, 600, 700

### Layout
- Responsive grid system
- Mobile-first approach
- Smooth animations and transitions

## 📱 Responsive Features

- Mobile navigation menu
- Responsive portfolio grid
- Touch-friendly modal interactions
- Optimized images for different screen sizes

## 🔧 Technical Features

### CMS Integration
- Markdown-based content management
- Image upload and management
- Real-time content updates
- Version control integration

### Performance
- Lazy loading images
- Optimized CSS and JavaScript
- Minimal external dependencies
- Fast loading times

### SEO
- Structured meta tags
- Open Graph tags
- Sitemap.xml
- Robots.txt
- Semantic HTML structure

## 📞 Contact Form

The contact form is integrated with Formspree. To set up:

1. Create a Formspree account
2. Update the form action URL in `contact.html`
3. Configure form settings in Formspree dashboard

## 🚀 Going Live

### Pre-launch Checklist

- [ ] Update all content through CMS
- [ ] Test contact form
- [ ] Verify all portfolio items display correctly
- [ ] Check responsive design on all devices
- [ ] Test CMS functionality
- [ ] Update social media links
- [ ] Set up Google Analytics (optional)

### Post-launch

- [ ] Submit sitemap to Google Search Console
- [ ] Set up social media sharing
- [ ] Monitor site performance
- [ ] Regular content updates through CMS

## 🔒 Security

- Netlify Identity for secure CMS access
- HTTPS enabled by default
- Secure headers configuration
- Privacy policy compliance

## 📈 Analytics & Monitoring

To add Google Analytics:

1. Get your GA tracking ID
2. Add the tracking code to all HTML pages
3. Configure goals and conversions

## 🆘 Support

For technical support or customization requests:
- Email: drishyacity@gmail.com
- WhatsApp: +91-80923 63881

## 📄 License

© 2024 DrishyaCity. All rights reserved. Designed by Viraj Singh.

---

**Note**: This website is fully CMS-enabled. All content can be managed through the `/admin` interface without touching any code.
