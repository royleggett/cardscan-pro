import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { data } = await req.json();
        
        // Get the newly registered user's details
        const newUser = data;
        
        if (!newUser) {
            return Response.json({ error: 'No user data provided' }, { status: 400 });
        }

        // Send notification email to admin
        await base44.asServiceRole.integrations.Core.SendEmail({
            to: "admin@cardscan-pro.com",
            from_name: "CardScan-Pro",
            subject: `New User Registration - ${newUser.full_name}`,
            body: `
                <h2>New User Registered in CardScan-Pro</h2>
                <p><strong>Name:</strong> ${newUser.full_name}</p>
                <p><strong>Email:</strong> ${newUser.email}</p>
                <p><strong>Role:</strong> ${newUser.role || 'user'}</p>
                <p><strong>Registration Date:</strong> ${new Date(newUser.created_date).toLocaleString()}</p>
            `
        });

        // Send welcome email to the new user
        await base44.asServiceRole.integrations.Core.SendEmail({
            to: newUser.email,
            from_name: "CardScan-Pro",
            subject: "Welcome to CardScan-Pro!",
            body: `
                <h2>Welcome to CardScan-Pro, ${newUser.full_name}!</h2>
                <p>Thank you for joining CardScan-Pro. We're excited to help you manage your business contacts and exhibition experiences.</p>
                <h3>Getting Started:</h3>
                <ul>
                    <li>Create your first exhibition</li>
                    <li>Scan business cards with our AI-powered scanner</li>
                    <li>Save useful places at exhibitions</li>
                    <li>Export your contacts to your CRM</li>
                </ul>
                <p>If you have any questions, feel free to reach out!</p>
                <p>Best regards,<br>The CardScan-Pro Team</p>
            `
        });

        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});