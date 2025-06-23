# 🚀 iShop - Store & Promotion Manager

Welcome to **SPM** – your all-in-one solution that streamlines product management, promotional campaigns, invoicing, loyalty programs, and even a smart assistant powered by OpenAI. This repository brings together a robust backend built with Express and MongoDB along with beautifully crafted web and mobile frontends using React, Expo, and TailwindCSS. Enjoy managing your store, promotions, and customer engagements in one seamless application! 😎✨

----------------------------------------------------

## Introduction

iShop is designed to simplify the complexities of retail administration. By integrating features like product management, discount promotions, loyalty tracking, invoice generation, and chatbot assistance, SPM empowers businesses to drive operational efficiency. The backend (built in Node.js with Express and MongoDB) and the dual frontend solutions for mobile (using Expo and React Native) and web (using React with Vite and TailwindCSS) work together to deliver a modern user experience. This project aims to elevate your store management processes while providing a sleek and interactive interface. fileciteturn0file0

----------------------------------------------------

## Features

- **Product Management:**  
  - Create, update, and delete products with detailed attributes such as price, category, and stock details.  
  - Barcode integration for quick lookup and inventory updates. fileciteturn0file0

- **Promotional Campaigns:**  
  - Set up and manage promotions with customizable discount percentages and eligibility criteria.  
  - Supports both product-specific and site-wide promotional rules. fileciteturn0file4

- **Loyalty Programs:**  
  - Track and manage customer loyalty and rewards, enhancing client retention.

- **Invoice Processing:**  
  - Generate and process invoices, with features that calculate total amounts, discounts, and final totals automatically.

- **Smart Assistant Integration:**  
  - Chat with an AI-powered assistant to help with queries and product recommendations using OpenAI’s GPT-3.5 turbo model. fileciteturn0file0

- **Dual Frontend Platforms:**  
  - **Mobile App:** Built with Expo and React Native for on-the-go operations, including barcode scanning and immediate notifications.  
  - **Web App:** Crafted with Vite, React, and TailwindCSS for intuitive dashboard management and reporting. fileciteturn0file7

----------------------------------------------------

## Requirements

Before getting started, ensure that you have the following software installed:

| Dependency              | Version/Notes                                |
|-------------------------|----------------------------------------------|
| Node.js                 | v14 or higher                                |
| npm or yarn             | Latest stable version                        |
| MongoDB                 | Community Edition or a hosted solution       |
| Expo CLI (for Mobile)   | Latest stable release                        |
| React & Vite (for Web)  | Configured via package.json & tailwind.config |

Additional dependencies are listed in the respective package.json files for both Backend and Frontend projects. fileciteturn0file19

----------------------------------------------------

## Installation

Follow these steps to set up SPM locally:

1. **Clone the Repository:**  
   Open your terminal and execute:
   -----------------------------------
   ```bash
   git clone https://github.com/IT22052124/SPM.git
   cd SPM
   ```
   -----------------------------------

3. **Install Backend Dependencies:**  
   Go to the Backend folder and install:
   -----------------------------------
   ```bash
   cd Backend
   npm install
   ```
   -----------------------------------

5. **Install Frontend Dependencies:**  
   The repository contains two frontend projects – one for mobile and one for web.

   - **Mobile App:**
     -----------------------------------
     ```bash
     cd ../Frontend_Mobile
     npm install
     ```
     -----------------------------------
     
   - **Web App:**
     -----------------------------------
     ```bash
     cd ../Frontend_Web
     npm install
     ```
     -----------------------------------

6. **Environment Variables:**  
   Create a .env file in the Backend folder populated with your specific configurations, for example:
   -----------------------------------
   ```bash
   PORT=5000
   MONGO_URL=your_mongodb_connection_string
   OPENAI_KEY=your_openai_api_key
   ```
   -----------------------------------
   
   Adjust other environment-specific configurations as needed.

----------------------------------------------------

## Usage

SPM can be run in different modes depending on your needs:

- **Start the Combined Development Environment:**

  This command launches both the backend server and the web frontend concurrently:
  -----------------------------------
  ```bash
  npm run start_W
  ```
  -----------------------------------
  *(Refer to the scripts in package.json for commands such as "start_W" for the web and "start_M" for the mobile app.)* fileciteturn0file19

- **For Mobile Development:**

  Launch the mobile application using Expo:
  -----------------------------------
  ```bash
  npm run start_M
  ```
  -----------------------------------

- **Backend Only:**

  You may also run only the backend server:
  -----------------------------------
  ```bash
  cd Backend
  npm run dev
  ```
  -----------------------------------

- **Web Only:**

  Similarly, run the web interface in isolation:
  -----------------------------------
  ```bash
  cd Frontend_Web
  npm run dev
  ```
  ----------------------------------

----------------------------------------------------

## Configuration

SPM includes various configurations that are essential for proper operation:

- **Backend Configuration:**  
  - The server configuration (located in Backend/server.js) uses Express middleware such as body-parser and cors, and connects to MongoDB using Mongoose. fileciteturn0file0  
  - Environment variables are loaded using dotenv.

- **Frontend Configuration:**  
  - Mobile configuration (Expo) is handled in the Frontend_Mobile project, including settings in tsconfig.json and package configurations specific to Expo.  
  - Web configuration uses Vite and TailwindCSS; see tailwind.config.js and vite.config.js for customization. fileciteturn0file19

- **Firebase & Image Upload:**  
  - Image uploads are managed using Firebase Storage. Check the ImageUpload.jsx component in the Frontend_Web folder for implementation details.

- **Routing & Navigation:**  
  - The backend exposes several REST APIs (e.g., /product, /promotion, /loyalty) while the frontend handles navigation using React Navigation (for mobile) and React Router (for web).  
  - These configurations are spread across route files such as Assistant-controller.js and PromotionController.js. fileciteturn0file3 fileciteturn0file4

----------------------------------------------------

## Contributing

We welcome contributions from the community! To contribute:

1. **Fork the Repository:**  
   Create your own fork so you can experiment freely.

2. **Create a Feature Branch:**  
   It is best practice to create a branch for every new feature or bug fix:
   -----------------------------------
   ```bash
   git checkout -b feature/your-feature-name
   ```
   -----------------------------------

4. **Commit Your Changes:**  
   Make sure your commits are clear and descriptive. Follow the coding conventions already established in the project.

5. **Submit a Pull Request:**  
   Once your changes are ready and tested, open a pull request with a detailed description of your work.

6. **Feedback and Discussion:**  
   We encourage open discussion on any pull request. Keep the communication respectful, constructive, and focused on improvement.

Thank you for helping improve SPM. Your contributions make this project even better! 🎉💪

----------------------------------------------------

Happy coding and thank you for using SPM!  
For any inquiries or further assistance, please refer to the project issues or contact the maintainers.
