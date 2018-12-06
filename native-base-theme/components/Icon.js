// @flow

import variable from './../variables/platform';
import { BLACK } from '../../src/constants/colorPalette';

export default (variables /*: * */ = variable) => {
  const iconTheme = {
    fontSize: variables.iconFontSize,
    color: BLACK,
  };

  return iconTheme;
};
