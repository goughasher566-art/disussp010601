# American Financial Markets - Vercel Deployment

This is a static website ready for deployment on Vercel and GitHub Pages.

## Features

- Modern, responsive design
- Cookie/Preference management system
- Educational financial content
- SEO optimized
- Fast loading static site

## Deployment Instructions

### Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the `vercel.json` configuration
   - Click "Deploy"
   - Your site will be live at `https://your-project.vercel.app`

### Deploy to GitHub Pages

1. **Push to GitHub** (same as above)

2. **Enable GitHub Pages:**
   - Go to your repository Settings
   - Navigate to "Pages" section
   - Select "Deploy from a branch"
   - Choose `main` branch and `/ (root)` folder
   - Click "Save"
   - Your site will be live at `https://your-username.github.io/repo-name`

## Project Structure

```
18-US-Latest-Vercel/
├── index.html          # Main HTML file
├── favicon.svg         # Site icon
├── vercel.json         # Vercel configuration
├── README.md           # This file
└── static/
    ├── css/
    │   └── style.css   # Main stylesheet
    └── js/
        └── preference-manager.js  # Preference management script
```

## Customization

- **Content**: Edit `index.html` to modify page content
- **Styling**: Modify `static/css/style.css` for design changes
- **Functionality**: Update `static/js/preference-manager.js` for behavior changes

## Notes

- All paths are relative, making it easy to deploy anywhere
- No build process required - pure static HTML/CSS/JS
- Compatible with all modern browsers
- Mobile responsive design

## License

This project is for educational purposes.

