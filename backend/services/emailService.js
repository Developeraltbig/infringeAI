const transporter = require("../config/email");
const User = require("../models/User");

class EmailService {
  async sendCompletionEmail(project) {
  try {
    const user = await User.findById(project.userId);
    // In production, use relative URL since backend serves frontend
    const baseUrl = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5173');
    const projectUrl = baseUrl ? `${baseUrl}/projects/${project._id}` : `/projects/${project._id}`;

    let analysisDetails = "";
    
    // For interactive mode, show company grouping
    if (project.mode === "interactive") {
      const grouped = project.getProductsGroupedByCompany();
      if (grouped) {
        analysisDetails = "<h3>Analysis Summary by Company:</h3><ul>";
        for (const [company, products] of Object.entries(grouped)) {
          analysisDetails += `<li><strong>${company}</strong>: ${products.length} products analyzed<ul>`;
          products.forEach(p => {
            analysisDetails += `<li>Rank ${p.rank}: ${p.product}</li>`;
          });
          analysisDetails += "</ul></li>";
        }
        analysisDetails += "</ul>";
      }
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your Patent Infringement Analysis is Ready",
      html: `
        <h2>Patent Infringement Analysis Complete</h2>
        <p>Your infringement analysis for patent ${project.patentId} has been completed.</p>
        ${analysisDetails}
        <p>You can view the full claim charts and analysis here:</p>
        <a href="${projectUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">View Report</a>
        <p>Thank you for using InfringeAI!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${user.email} for project ${project._id}`);
  } catch (error) {
    console.error("Email sending error:", error);
  }
}

  async sendBulkCompletionEmail(userId, bulkGroupId, projects) {
    try {
      const user = await User.findById(userId);
      
      // Separate successful and failed projects
      const successful = projects.filter(p => p.status === "completed");
      const failed = projects.filter(p => p.status === "failed");
      
      let projectListHtml = "<ul>";
      
      // List successful projects
      successful.forEach(project => {
        // In production, use relative URL since backend serves frontend
        const baseUrl = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5173');
        const projectUrl = baseUrl ? `${baseUrl}/projects/${project._id}` : `/projects/${project._id}`;
        projectListHtml += `
          <li>
            <strong>${project.patentId}</strong> - ✅ Completed
            <a href="${projectUrl}" style="margin-left: 10px; color: #007bff;">View Report</a>
          </li>
        `;
      });
      
      // List failed projects
      failed.forEach(project => {
        projectListHtml += `
          <li>
            <strong>${project.patentId}</strong> - ❌ Failed
            <span style="color: #666; margin-left: 10px;">(${project.failureReason || "Unknown error"})</span>
          </li>
        `;
      });
      
      projectListHtml += "</ul>";
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Bulk Patent Analysis Complete - ${successful.length} Successful, ${failed.length} Failed`,
        html: `
          <h2>Bulk Patent Infringement Analysis Complete</h2>
          <p>Your bulk analysis of ${projects.length} patents has been completed.</p>
          <p><strong>Summary:</strong></p>
          <ul>
            <li>✅ Successful: ${successful.length} patents</li>
            <li>❌ Failed: ${failed.length} patents</li>
          </ul>
          <h3>Results:</h3>
          ${projectListHtml}
          <p>Thank you for using InfringeAI!</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Bulk email sent to ${user.email} for bulk group ${bulkGroupId}`);
    } catch (error) {
      console.error("Bulk email sending error:", error);
    }
  }

  async sendFailureEmail(project) {
    try {
      const user = await User.findById(project.userId);
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Patent Analysis Failed - ${project.patentId}`,
        html: `
          <h2>Patent Infringement Analysis Failed</h2>
          <p>Unfortunately, the analysis for patent ${project.patentId} could not be completed.</p>
          <p><strong>Reason:</strong> ${project.failureReason || "Unknown error occurred"}</p>
          <p>Please try again or contact support if the issue persists.</p>
          <p>Thank you for using InfringeAI!</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Failure email sent to ${user.email} for project ${project._id}`);
    } catch (error) {
      console.error("Failure email sending error:", error);
    }
  }
}

module.exports = new EmailService();