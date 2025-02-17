import 'dotenv/config';  
import nodemailer from 'nodemailer';
import inquirer from 'inquirer';
import fs from 'fs';

async function sendEmail() {
    try {
        // Prompt for recipient email
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'recipient',
                message: 'Enter the recipient email:',
                validate: input => input.includes('@') ? true : 'Enter a valid email'
            }
        ]);
        console.log(process.env.EMAIL);
        console.log(process.env.PASSWORD);
        // Email transport configuration
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,      // Your Gmail email address
                pass: process.env.PASSWORD // Your Gmail app password
            }
        });
        
        // Test report file path
        const reportPath = 'test-report.txt';

        // Ensure the report file exists
        if (!fs.existsSync(reportPath)) {
            fs.writeFileSync(reportPath, 'This is a sample test report.\nGenerated for testing purposes.');
        }

        // Email details
        const mailOptions = {
            from: process.env.EMAIL,
            to: answers.recipient,
            subject: 'Automated Test Report',
            text: 'PFA Attached is the latest test report.',
            attachments: [
                {
                    filename: 'test-report.txt',
                    path: reportPath
                }
            ]
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

sendEmail();
