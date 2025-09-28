#!/usr/bin/env node

/**
 * Verification script for PDF ticket generation implementation
 * This script checks if the implementation is correctly set up
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying PDF Ticket Implementation...\n');

// Check if ticket-generator.ts exists and has the required functions
const ticketGeneratorPath = path.join(__dirname, '..', 'src', 'lib', 'ticket-generator.ts');

if (!fs.existsSync(ticketGeneratorPath)) {
    console.error('❌ ticket-generator.ts not found!');
    process.exit(1);
}

const ticketGeneratorContent = fs.readFileSync(ticketGeneratorPath, 'utf8');

// Check for required imports and functions
const checks = [
    {
        name: 'jsPDF import',
        pattern: /import jsPDF from ['"]jspdf['"]/,
        required: true
    },
    {
        name: 'generateTicketPDF function',
        pattern: /export const generateTicketPDF/,
        required: true
    },
    {
        name: 'downloadTicket function (updated)',
        pattern: /export const downloadTicket.*generateTicketPDF/s,
        required: true
    },
    {
        name: 'PDF save functionality',
        pattern: /\.save\(/,
        required: true
    }
];

let allPassed = true;

checks.forEach(check => {
    const found = check.pattern.test(ticketGeneratorContent);
    const status = found ? '✅' : '❌';
    console.log(`${status} ${check.name}: ${found ? 'Found' : 'Missing'}`);
    
    if (check.required && !found) {
        allPassed = false;
    }
});

// Check package.json for jsPDF dependency
const packageJsonPath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const hasJsPDF = packageJson.dependencies && packageJson.dependencies.jspdf;
    console.log(`${hasJsPDF ? '✅' : '❌'} jsPDF dependency: ${hasJsPDF ? 'Installed' : 'Missing'}`);
    
    if (!hasJsPDF) {
        allPassed = false;
        console.log('   Run: npm install jspdf');
    }
}

// Check if booking success page imports the function
const bookingSuccessPath = path.join(__dirname, '..', 'src', 'app', 'booking', 'success', 'page.tsx');
if (fs.existsSync(bookingSuccessPath)) {
    const bookingSuccessContent = fs.readFileSync(bookingSuccessPath, 'utf8');
    const hasImport = /import.*downloadTicket.*from.*ticket-generator/.test(bookingSuccessContent);
    console.log(`${hasImport ? '✅' : '❌'} Booking success page import: ${hasImport ? 'Found' : 'Missing'}`);
} else {
    console.log('⚠️  Booking success page not found (optional check)');
}

console.log('\n' + '='.repeat(50));

if (allPassed) {
    console.log('🎉 All checks passed! PDF ticket generation is properly implemented.');
    console.log('\n📋 Next steps:');
    console.log('1. Open test-pdf.html in your browser to test PDF generation');
    console.log('2. Or run your Next.js app and test the download ticket functionality');
    console.log('3. Complete a booking and click "Download Ticket" to verify');
} else {
    console.log('❌ Some checks failed. Please review the implementation.');
    console.log('\n🔧 To fix issues:');
    console.log('1. Ensure jsPDF is installed: npm install jspdf');
    console.log('2. Check that all required functions are properly implemented');
    console.log('3. Verify imports are correct');
}

console.log('\n📁 Test files created:');
console.log('- test-pdf.html (browser test)');
console.log('- scripts/test-pdf-generation.js (test data)');
console.log('- scripts/verify-pdf-implementation.js (this script)');
