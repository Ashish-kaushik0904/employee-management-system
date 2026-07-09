// Welcome email — naya employee add hone par
export const welcomeEmail = (name, email, password) => ({
  subject: "Welcome to Employee MS — Your Account Details",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #2563eb; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Employee MS</h1>
      </div>
      <div style="padding: 32px; background-color: #ffffff; border: 1px solid #e5e7eb;">
        <h2 style="color: #0f172a; margin-bottom: 8px;">Welcome, ${name}! 👋</h2>
        <p style="color: #6b7280; margin-bottom: 24px;">Your employee account has been created. Here are your login details:</p>
        
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px; border-left: 4px solid #2563eb;">
          <p style="margin: 0 0 8px; color: #374151;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 0; color: #374151;"><strong>Password:</strong> ${password}</p>
        </div>

        <p style="color: #6b7280;">Please login and change your password immediately for security.</p>
        <p style="color: #6b7280; margin-top: 24px;">Best regards,<br><strong>Employee MS Team</strong></p>
      </div>
      <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">This is an automated email. Please do not reply.</p>
      </div>
    </div>
  `,
});

// Leave apply hua — admin ko notify
export const leaveAppliedEmail = (employeeName, leaveType, fromDate, toDate, reason) => ({
  subject: `Leave Request from ${employeeName}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #2563eb; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Employee MS</h1>
      </div>
      <div style="padding: 32px; background-color: #ffffff; border: 1px solid #e5e7eb;">
        <h2 style="color: #0f172a; margin-bottom: 8px;">New Leave Request 📋</h2>
        <p style="color: #6b7280; margin-bottom: 24px;">An employee has applied for leave. Please review:</p>

        <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px; border-left: 4px solid #f59e0b;">
          <p style="margin: 0 0 8px; color: #374151;"><strong>Employee:</strong> ${employeeName}</p>
          <p style="margin: 0 0 8px; color: #374151;"><strong>Leave Type:</strong> ${leaveType}</p>
          <p style="margin: 0 0 8px; color: #374151;"><strong>From:</strong> ${new Date(fromDate).toLocaleDateString()}</p>
          <p style="margin: 0 0 8px; color: #374151;"><strong>To:</strong> ${new Date(toDate).toLocaleDateString()}</p>
          <p style="margin: 0; color: #374151;"><strong>Reason:</strong> ${reason}</p>
        </div>

        <p style="color: #6b7280;">Please login to the system to approve or reject this request.</p>
        <p style="color: #6b7280; margin-top: 24px;">Best regards,<br><strong>Employee MS System</strong></p>
      </div>
      <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">This is an automated email. Please do not reply.</p>
      </div>
    </div>
  `,
});

// Leave status update — employee ko notify
export const leaveStatusEmail = (employeeName, leaveType, status, fromDate, toDate) => ({
  subject: `Your Leave Request has been ${status}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #2563eb; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Employee MS</h1>
      </div>
      <div style="padding: 32px; background-color: #ffffff; border: 1px solid #e5e7eb;">
        <h2 style="color: #0f172a; margin-bottom: 8px;">
          Leave ${status === "approved" ? "Approved ✅" : "Rejected ❌"}
        </h2>
        <p style="color: #6b7280; margin-bottom: 24px;">Hi ${employeeName}, your leave request has been updated:</p>

        <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px; border-left: 4px solid ${status === "approved" ? "#16a34a" : "#dc2626"};">
          <p style="margin: 0 0 8px; color: #374151;"><strong>Leave Type:</strong> ${leaveType}</p>
          <p style="margin: 0 0 8px; color: #374151;"><strong>From:</strong> ${new Date(fromDate).toLocaleDateString()}</p>
          <p style="margin: 0 0 8px; color: #374151;"><strong>To:</strong> ${new Date(toDate).toLocaleDateString()}</p>
          <p style="margin: 0; color: ${status === "approved" ? "#16a34a" : "#dc2626"};"><strong>Status: ${status.toUpperCase()}</strong></p>
        </div>

        <p style="color: #6b7280;">If you have any questions, please contact HR.</p>
        <p style="color: #6b7280; margin-top: 24px;">Best regards,<br><strong>Employee MS Team</strong></p>
      </div>
      <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">This is an automated email. Please do not reply.</p>
      </div>
    </div>
  `,
});

// Salary add hua — employee ko notify
export const salaryEmail = (employeeName, basicSalary, allowances, deductions, total, payDate) => ({
  subject: "Your Salary has been Credited",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #2563eb; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Employee MS</h1>
      </div>
      <div style="padding: 32px; background-color: #ffffff; border: 1px solid #e5e7eb;">
        <h2 style="color: #0f172a; margin-bottom: 8px;">Salary Credited 💰</h2>
        <p style="color: #6b7280; margin-bottom: 24px;">Hi ${employeeName}, your salary has been processed:</p>

        <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px; border-left: 4px solid #2563eb;">
          <p style="margin: 0 0 8px; color: #374151;"><strong>Basic Salary:</strong> ₹${Number(basicSalary).toLocaleString()}</p>
          <p style="margin: 0 0 8px; color: #16a34a;"><strong>Allowances:</strong> +₹${Number(allowances).toLocaleString()}</p>
          <p style="margin: 0 0 8px; color: #dc2626;"><strong>Deductions:</strong> -₹${Number(deductions).toLocaleString()}</p>
          <hr style="border: 1px solid #e5e7eb; margin: 12px 0;" />
          <p style="margin: 0; color: #0f172a; font-size: 16px;"><strong>Net Payable: ₹${Number(total).toLocaleString()}</strong></p>
          <p style="margin: 8px 0 0; color: #6b7280; font-size: 13px;">Pay Date: ${new Date(payDate).toLocaleDateString()}</p>
        </div>

        <p style="color: #6b7280;">Thank you for your hard work!</p>
        <p style="color: #6b7280; margin-top: 24px;">Best regards,<br><strong>Employee MS Team</strong></p>
      </div>
      <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">This is an automated email. Please do not reply.</p>
      </div>
    </div>
  `,
});

// Password change hua — security alert
export const passwordChangedEmail = (name) => ({
  subject: "Password Changed — Security Alert",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #2563eb; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Employee MS</h1>
      </div>
      <div style="padding: 32px; background-color: #ffffff; border: 1px solid #e5e7eb;">
        <h2 style="color: #0f172a; margin-bottom: 8px;">Password Changed 🔐</h2>
        <p style="color: #6b7280; margin-bottom: 24px;">Hi ${name}, your account password was recently changed.</p>

        <div style="background-color: #fef2f2; border-radius: 8px; padding: 20px; margin-bottom: 24px; border-left: 4px solid #dc2626;">
          <p style="margin: 0; color: #374151;">If you did not make this change, please contact your administrator immediately.</p>
        </div>

        <p style="color: #6b7280; margin-top: 24px;">Best regards,<br><strong>Employee MS Security Team</strong></p>
      </div>
      <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">This is an automated email. Please do not reply.</p>
      </div>
    </div>
  `,
});