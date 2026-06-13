# How to Deploy Your Personal Portfolio Webpage

Congratulations! Your personal portfolio is ready. It has a beautiful dark-mode glassmorphic theme, responsive layouts, typing animations, interactive filtering, and scroll reveal effects.

Here are the easiest, free ways to deploy your portfolio so that recruiters can access it online.

---

## Option 1: Vercel (Recommended - Fastest & Easiest)
Vercel offers instant static web hosting with global CDN, free SSL, and a custom domain connection.

1. Install Vercel CLI globally (if you have Node.js/npm installed):
   ```bash
   npm install -g vercel
   ```
2. Open your terminal in the portfolio directory:
   ```bash
   cd portfolio
   ```
3. Run the deploy command:
   ```bash
   vercel
   ```
4. Follow the prompts (e.g. log in to your Vercel account, set project name to `dibyajit-portfolio`).
5. Vercel will instantly build, upload, and provide you with a live link (e.g., `https://dibyajit-portfolio.vercel.app`).

*Alternatively, upload your project folder to GitHub, go to [Vercel Dashboard](https://vercel.com/dashboard), click **Add New Project**, and import your repository. It will auto-deploy every time you push updates!*

---

## Option 2: Netlify (Drag and Drop - No CLI needed)
Netlify is another excellent hosting provider for static websites.

### Method A: Drag and Drop (No Git required)
1. Open [Netlify Drop](https://app.netlify.com/drop).
2. Drag and drop your entire `portfolio` folder directly into the browser upload area.
3. Your site will be live in seconds with a custom link like `https://random-words.netlify.app`.
4. Register a free account to customize the site name (e.g., `dibyajit-portfolio.netlify.app`).

### Method B: Connected to GitHub
1. Upload your code to a GitHub repository.
2. Go to the [Netlify Dashboard](https://app.netlify.com/), click **Add new site**, and select **Import an existing project**.
3. Choose **GitHub**, authorize it, and select your portfolio repository.
4. Keep default settings and click **Deploy Site**. Every update pushed to GitHub will auto-update the live site!

---

## Option 3: GitHub Pages (100% Free - Integrated)
If you already use GitHub, you can host it directly on GitHub for free.

1. Create a new public repository on GitHub named `dibyajitgupta06.github.io` (replacing `dibyajitgupta06` with your exact GitHub username).
2. Open terminal in the `portfolio` folder and initialize a Git repository:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   ```
3. Link the local repository to your GitHub repository:
   ```bash
   git remote add origin https://github.com/dibyajitgupta06/dibyajitgupta06.github.io.git
   git branch -M main
   git push -u origin main
   ```
4. Within 1-2 minutes, your website will be live at:
   ```
   https://dibyajitgupta06.github.io
   ```

---

## Connecting Your Custom Domain
If you have a custom domain (like `dibyajitdasgupta.tech` or `dibyajit.me`), you can connect it for free on Vercel, Netlify, or GitHub Pages settings:
1. In Vercel or Netlify, go to **Project Settings** -> **Domains**.
2. Add your custom domain.
3. Update your DNS settings at your domain registrar (e.g. GoDaddy, Namecheap) by adding the recommended **CNAME** or **A record**.
