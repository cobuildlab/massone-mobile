import authStore from '../Auth/authStore';
/**
 * Validate the allowed roles provided against the roles in the store to decide if the element should be disabled
 * @param {Array} rolesToAllow an array of strings with the roles to allow if at least one matches the roles in the store
 */
export const validateRoles = (rolesToAllow) => {
  const user = authStore.getState('Login') || {};
  const roles = user && user.user_types;

  return roles.some((role) => rolesToAllow.includes(role));
};
