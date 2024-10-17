# be_ukk_cafe

Backend application for a cafe system using Node.js, TypeScript, Express, and Prisma.

## Requirements

Before you begin, ensure you have met the following requirements:

- **Node.js**: Ensure that Node.js is installed on your machine. You can download it from [Node.js official website](https://nodejs.org/).
- **npm**: Node.js comes with npm, but make sure it’s up to date by running:
  ```bash
  npm install -g npm
  ```
- **Prisma**: Prisma is required for managing database interactions. Run the following command to install Prisma CLI globally:
  ```bash
  npm install -g prisma
  ```

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/be_ukk_cafe.git
   cd be_ukk_cafe
   ```

2. **Install dependencies**:
   Run the following command to install all required dependencies:
   ```bash
   npm install
   ```

   This will install both `dependencies` and `devDependencies` defined in the `package.json` file, including:
   - `express`
   - `typescript`
   - `ts-node`
   - `joi`
   - `jsonwebtoken`
   - `md5`
   - `multer`
   - `pdfkit`
   - `cors`
   - And others for development like `nodemon` and `@types/*` for TypeScript support.

3. **Set up Prisma**:
   - Run the Prisma initialization command if you haven't set up Prisma in the project:
     ```bash
     npx prisma init
     ```
   - Set up your database connection string in the `.env` file created by Prisma:
     ```
     DATABASE_URL="mysql://username:password@localhost:3306/yourdbname"
     ```
   - Run Prisma migrate to apply any migrations:
     ```bash
     npx prisma migrate dev --name init
     ```

4. **Compile TypeScript**:
   - Build the project using the TypeScript compiler:
     ```bash
     npm run build
     ```

5. **Run the development server**:
   - To start the development server with nodemon (auto-reload on changes), run:
     ```bash
     npm run dev
     ```

6. **Build and Run in Production**:
   - Build the project using:
     ```bash
     npm run build
     ```
   - Run the compiled code:
     ```bash
     npm start
     ```

## Usage

- Access the API endpoints as documented in the source code. You can use tools like **Postman** or **cURL** to interact with the endpoints.
- To authenticate users, ensure you pass the correct credentials when accessing secured routes.

## Additional Notes

- **Database**: This project uses a MySQL database. Ensure you have MySQL installed and configured on your system.
- **Environment Variables**: Make sure to set the environment variables correctly, especially `DATABASE_URL`, in your `.env` file.
- **Running Prisma Commands**:
  - Generate Prisma client after any schema changes:
    ```bash
    npx prisma generate
    ```
  - Reset the database (use with caution):
    ```bash
    npx prisma migrate reset
    ```

## Dependencies Overview

- **Express**: Web framework for building APIs.
- **Prisma**: Database ORM for TypeScript/JavaScript.
- **md5**: Library for hashing passwords (use bcrypt for better security in production).
- **pdfkit**: Library for generating PDFs.
- **multer**: Middleware for handling file uploads.
- **jsonwebtoken**: For token-based authentication.
- **joi**: For request validation.
- **cors**: Middleware for handling Cross-Origin Resource Sharing.
- **nodemon**: Development tool for auto-restarting the server.
- **TypeScript**: Type-safe JavaScript.

## DevDependencies

- Type definitions for libraries such as `express`, `joi`, `jsonwebtoken`, `multer`, and others.
- TypeScript and ts-node for compiling and running TypeScript.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any new features or bug fixes.

## License

This project is licensed under the ISC License.

---

With this README, anyone can set up their environment and run the application following the provided steps.
