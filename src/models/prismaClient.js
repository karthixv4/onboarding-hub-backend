// src/models/prismaClient.js

const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client
const prisma = new PrismaClient();

// Handle connection errors
async function main() {
    try {
        // Optionally, you can run a simple query to check the connection
        await prisma.$connect();
        console.log('Connected to the database successfully.');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

// Call the main function
main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

// Export the initialized Prisma Client
module.exports = prisma;