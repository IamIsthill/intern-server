# A2K Internship Management System - Backend

A web-based platform designed to streamline the management of internship programs. This system allows administrators to manage interns, departments, and supervisors efficiently while providing interns with tools to track their progress.

---

## Table of Contents

- [A2K Internship Management System - Backend](#a2k-internship-management-system---backend)
  - [Table of Contents](#table-of-contents)
  - [Project Description](#project-description)
  - [Who This Project Is For](#who-this-project-is-for)
  - [Project Dependencies](#project-dependencies)
  - [Instructions for Using the System](#instructions-for-using-the-system)
    - [Installation](#installation)
    - [Configuration](#configuration)
    - [Running the System](#running-the-system)
    - [Troubleshooting](#troubleshooting)
  - [Contributing Guidelines](#contributing-guidelines)
  - [Additional Documentation](#additional-documentation)
  - [How to Get Help](#how-to-get-help)
  - [Terms of Use](#terms-of-use)

---

## Project Description

The **A2K Internship Management System** simplifies the process of managing internship programs by providing features such as:

- Intern registration and profile management.
- Department and supervisor assignment.
- Time tracking and progress monitoring.
- Admin tools for managing interns and generating reports.

Unlike traditional manual processes, this system automates key tasks, saving time and reducing errors.

---

## Who This Project Is For

This project is intended for:

- **Administrators** who want to manage interns, departments, and supervisors efficiently.
- **Interns** who want to track their progress and log their internship hours.
- **Organizations** looking to streamline their internship programs.

---

## Project Dependencies

Before using the **A2K Internship Management System**, ensure you have the following:

- Node.js (v16 or higher)
- MongoDB (v5.0 or higher)
- A modern web browser (e.g., Chrome, Firefox)

---

## Instructions for Using the System

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/a2k-internship-management.git
   cd a2k-internship-management
   ```
2. Install dependencies:
  ```bash
  npm install
  ```
3. Go checkout [ImageKit](https://imagekit.io/) to get your very own keys and endpoint for image saving

4. Setup the `.env` at the root of the project
  ```env
    DATABASE_URI=your-db-connection      # The connection string for your MongoDB database.
   JWT_SECRET=your-secret-key           # A secret key used for signing JSON Web Tokens for authentication. Keep this secure!
   PORT=3000                            # The port on which the backend server will listen for incoming requests.
   DEVELOPMENT=true                     # A flag to indicate if the application is running in development mode.

   EMAIL_PASS=your-google-email-password # Password for the email account used for sending emails (e.g., password reset).
   EMAIL=your-email                     # The email address used as the sender for system emails.
   RESET_TOKEN=your-reset-key           # A secret key used for generating password reset tokens.

   IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key # Public key for your ImageKit.io account.
   IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key # Private key for your ImageKit.io account (keep this secret!).
   IMAGEKIT_URL_ENDPOINT=your-imagekit-url-endpoint # The URL endpoint for your ImageKit.io account.
  ```

### Configuration

1. Ensure MongoDB is running locally or provide a connection string to a remote MongoDB instance.
2. Update the .env file with the appropriate configuration values.

### Running the System

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Access the system in your browser at http://localhost:3000.

### Troubleshooting
Issue | Solution
------|----------
Cannot connect to the database |	Verify the DATABASE_URI in the .env file.
Server not starting	| Ensure all dependencies are installed.
Missing environment variables	| Check the .env file for required variables.

## Contributing Guidelines

We welcome contributions to the A2K Internship Management System. To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed description of your changes.

## Additional Documentation

For more information, refer to:

* [API Reference](/API_REFERENCE.md)


## How to Get Help

If you encounter issues or have questions, use the following resources:

* [GitHub Issues](https://github.com/IamIsthill/intern-server/issues)

## Terms of Use

The **A2K Internship Management System** is licensed under the MIT License.


