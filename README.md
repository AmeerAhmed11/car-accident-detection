# 🚗 Car Accident Detection Dashboard

A modern, high-performance web application built with **Next.js 15+** and **Tailwind CSS 4** for visualizing and detecting car accidents in real-time. This project integrates mapping services and interactive components to provide a premium user experience.

---

## ⚡ Quick Copy-Paste (One-Line Setup)

Run this command in your terminal to install everything and start the project immediately:

```bash
npm install && npm run dev
```

---

## 🚀 Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (comes with Node.js) or **yarn** / **pnpm**

### 2. Clone the Repository

If you haven't already, clone the repository to your local machine:

```bash
git clone https://github.com/AmeerAhmed11/car-accident-detection.git
cd car-accident-detection
```

### 3. Install Dependencies

Install the necessary packages using npm:

```bash
npm install
```

This will install all required libraries including:
- **Next.js**: The React framework for production.
- **Tailwind CSS 4**: For high-performance styling.
- **Leaflet & React Leaflet**: For interactive map visualizations.
- **Framer Motion**: For smooth UI transitions and animations.
- **Lucide React**: For beautiful icons.

### 4. Run the Development Server

Start the development server to see the app in action:

```bash
npm run dev
```

Once started, open [http://localhost:3000](http://localhost:3000) in your browser. The page will automatically reload if you make any changes to the code.

---

## 🛠️ Troubleshooting

### PowerShell Execution Policy Error
If you see an error like `File ... npm.ps1 cannot be loaded because running scripts is disabled`, run the following command in your PowerShell (as Administrator) to allow scripts:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Alternatively, you can use `npm.cmd` instead of `npm`:
```bash
npm.cmd install
npm.cmd run dev
```

---

## 🛠️ Scripts Overview

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server with hot-reloading. |
| `npm run build` | Compiles the application for production. |
| `npm run start` | Runs the compiled production build locally. |
| `npm run lint` | Runs ESLint to check for code quality issues. |

---

## 📂 Project Structure

```text
/src
  ├── /app          # Next.js App Router (pages and layouts)
  ├── /components   # Reusable UI components
  └── /styles       # Global CSS and Tailwind configurations
/public             # Static assets (images, icons, etc.)
package.json        # Project dependencies and scripts
tsconfig.json       # TypeScript configuration
```

---

## 🎨 Technologies Used

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Mapping**: [Leaflet](https://leafletjs.com/) & [React Leaflet](https://react-leaflet.js.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## 📝 License

This project is open-source. Feel free to contribute or use it as a reference for your own projects.
