import { isValidString } from "../utils";

const resetPasswordValidator = (code, password, repeatPassword) => {
  if (!isValidString(code)) {
    throw new Error('Invalid code');
  }

  if (!isValidString(password)) {
    throw new Error('Invalid password');
  }

  if (!isValidString(repeatPassword)) {
    throw new Error('Invalid repeat password');
  }

  if (password !== repeatPassword) {
    throw new Error('Passwords do not match');
  }
}

export {
  resetPasswordValidator
};
