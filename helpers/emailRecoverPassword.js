import nodemailer from "nodemailer";

export const emailRecoverPassword = async({email, name, token}) => {

    const transport = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD
    }
    });

    const info = await transport.sendMail({
        from:"Salud360 - Medical Manager",
        to: email,
        subject:"Reset your password on Salud360",
        text: "Reset your password on Salud360",
        html: `
    
        <body style="padding: 0; box-sizing: border-box; margin: 0; font-family: sans-serif;">

        <div style="display: flex;  justify-content: center; align-items: center; min-height: 100dvh; background:#2563eb ;">

        <div style="background: #f9fafb; padding: 10px 20px; border-radius: 10px; box-shadow:0 10px 15px -3px rgb(0 0 0 / 0.1) ; box-shadow:0 4px 6px -4px rgb(0 0 0 / 0.1) ; display: flex; flex-direction: column;">

            <span style="display: block; text-align: center; margin-top: 5px; font-size: 20px; font-weight: 700;">Hello ${name} you have requested to reset your password on Salud360</span>

            <p>To reset your password follow the link below</p>

            <a href="${process.env.FRONTEND_URL}/recover-password/${token}" style="display: block; margin: 15px auto; color:#f9fafb; text-decoration: none; background: #2563eb; padding: 8px 15px; border-radius: 6px; text-transform: uppercase; font-weight:bold;">Reset password</a>

        </div>
        </div>
        
        </body>
        `
    });

    console.log("Mensaje enviado: %s", info.messageId);
};