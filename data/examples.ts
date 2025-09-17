export interface EmailExample {
  name: string;
  content: string;
}

export const examples: EmailExample[] = [
  {
    name: "Safe: Project Update Newsletter",
    content: `Subject: Weekly Project Phoenix Update

Hi Team,

Just a quick update on Project Phoenix. We've successfully completed the user authentication module this week. Great job, everyone!

Next week, we'll be focusing on the dashboard integration. Please review the updated documentation here: https://docs.our-company.com/phoenix/dashboard

Let's sync up on Monday at 10 AM.

Best,
Jane Doe
Project Manager`,
  },
  {
    name: "Phishing: Urgent Password Reset",
    content: `Subject: URGENT: Your Account Has Been Suspended!

Dear Valued Customer,

We detected unusual activity on your account. For your protection, we have temporarily suspended your access.

To restore your account, you must verify your identity immediately by clicking the link below and updating your password.

http://account-verification-center.net/login

Failure to do so within 24 hours will result in permanent account closure.

Sincerely,
The Security Team`,
  },
  {
    name: "Phishing: Fake Invoice",
    content: `Subject: Invoice #84321 Due

Hello,

Please find attached your invoice for recent services. The total amount of $492.50 is due upon receipt.

You can view and pay your invoice online through our secure portal: http://bit.ly/secure-payment-portal-84321

If you have any questions, please don't hesitate to contact our billing department.

Thank you for your business.

Regards,
Billing Department
Online Solutions Inc.`,
  },
];
