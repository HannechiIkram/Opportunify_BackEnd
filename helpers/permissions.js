// permissions.js

const rolePermissions = {
    job_seeker: {
      frontoffice: ['view_jobs', 'apply_jobs', 'update_profile']
    },
    company: {
      frontoffice: ['post_jobs', 'view_applications', 'manage_profile','Job_offer']
    },
    admin: {
      backoffice: ['dashboard', 'manage_users', 'manage_jobs']
    }
  };
  
  module.exports = {
    rolePermissions
  };
  