# Texas Tough Rentals - Small Business Website

![License](https://img.shields.io/badge/license-ISC-blue.svg)

A portfolio project showcasing the development of a modern, responsive website for a fictional small business specializing in trailer rentals. This project demonstrates a full-stack approach, from a custom-designed user interface to a serverless backend for handling customer inquiries.

**Live Demo:** [https://yoelvanhuizen.github.io/rental-trailer-demo/](https://yoelvanhuizen.github.io/rental-trailer-demo/)

![Texas Tough Rentals Screenshot](images/car-with-trailer.jpg)

## About The Project

This project was built to simulate a real-world scenario where a small business needs a professional online presence. The goal was to create a fast, user-friendly, and visually appealing website that effectively communicates the company's services and allows potential customers to request a quote easily.

This project highlights the following skills:
- **Frontend Development:** Building a responsive and accessible user interface with modern web technologies.
- **UI/UX Design:** Creating a custom theme and layout that is both aesthetically pleasing and intuitive.
- **Backend Integration:** Implementing a serverless function to handle form submissions securely and efficiently.
- **Tooling and Automation:** Utilizing a modern build tool (Vite) to streamline the development and deployment process.

## Built With

- **[Vite](https://vitejs.dev/):** A next-generation frontend tooling that provides a faster and leaner development experience.
- **[Tailwind CSS](https://tailwindcss.com/):** A utility-first CSS framework for rapid UI development.
- **[Zod](https://zod.dev/):** A TypeScript-first schema declaration and validation library used for ensuring the integrity of form data.
- **HTML5 & CSS3:** For structuring the content and styling the website.
- **JavaScript (ES6+):** For client-side interactivity and form handling.
- **Serverless Functions:** For processing form submissions on the backend.

## Features

- **Responsive Design:** The website is fully responsive and optimized for a seamless experience on desktops, tablets, and mobile devices.
- **Multi-Page Layout:** The site includes separate pages for the homepage, trailer details, and contact information, providing a clear and organized structure.
- **Dynamic Quote Request Form:** A user-friendly form allows customers to request a rental quote. The form includes client-side validation using **Zod** to ensure data is accurate before submission.
- **Serverless Backend:** The quote request form is powered by a serverless function (`api/submit-quote.js`) that processes the data, making the site scalable and secure without a traditional server.
- **Custom Theming:** The project features a custom theme created with Tailwind CSS, including a unique color palette and typography to match the fictional brand's identity.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- **Node.js:** Make sure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- **npm:** The Node.js package manager, which comes with the Node.js installation.

### Installation

1.  **Clone the repo:**
    ```sh
    git clone https://github.com/your_username/rental-trailer-demo.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd rental-trailer-demo
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```

### Running the Application

- **Development Mode:**
  Run the following command to start the Vite development server. This will open the website in your default browser and automatically reload the page when you make changes.
  ```sh
  npm run dev
  ```

- **Production Build:**
  To create a production-ready build of the website, run:
  ```sh
  npm run build
  ```
  This will generate a `dist` folder with the optimized and minified files.

## Project Structure

```
.
├── api/
│   └── submit-quote.js      # Serverless function for form submission
├── images/                  # Project images and assets
├── src/
│   ├── css/
│   │   └── style.css        # Main stylesheet
│   └── js/
│       ├── form-handler.js  # Client-side form logic
│       └── schemas.js       # Zod schemas for validation
├── *.html                   # HTML files for each page
├── package.json             # Project dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
└── vite.config.js           # Vite configuration
```

## Contact

Project Link: [https://github.com/yoelvanhuizen/rental-trailer-demo](https://github.com/yoelvanhuizen/rental-trailer-demo)
