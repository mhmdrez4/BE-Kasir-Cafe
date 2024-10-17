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
