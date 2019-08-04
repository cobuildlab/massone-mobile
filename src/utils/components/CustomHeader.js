import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Title, Button, Left, Right, Body, Icon } from 'native-base';
import { BLUE_MAIN } from '../../constants/colorPalette';
import { withNavigation } from 'react-navigation';

/**
 * Use this header and pass the props to select your leftButton, title and
 * rightButton
 * @extends Component
 */
class CustomHeader extends Component {
  render() {
    const { leftButton, title, rightButton } = this.props;

    return (
      <Header>
        {leftButton === 'goBack' || leftButton === 'openDrawer' ? (
          <Left>
            <Button title={'Left Action'} transparent onPress={this.leftButtonHandler}>
              <Icon
                name={
                  leftButton === 'goBack'
                    ? 'md-arrow-back'
                    : leftButton === 'openDrawer'
                      ? 'ios-menu'
                      : ''
                }
                style={{ color: BLUE_MAIN }}
              />
            </Button>
          </Left>
        ) : null}
        <Body>
          <Title>{title}</Title>
        </Body>
        <Right>
          {rightButton ? (
            <Button title={'Right Button'} transparent onPress={rightButton.handler}>
              <Icon name={rightButton.icon} style={{ color: BLUE_MAIN }} />
            </Button>
          ) : null}
        </Right>
      </Header>
    );
  }

  leftButtonHandler = () => {
    console.log(`DEBUG:`, this.props);
    const action = this.props.leftButton;
    if (action !== 'goBack' && action !== 'openDrawer') return;
    this.props.navigation[action]();
  };
}

/**
 * [propTypes description]
 * @type {Object}
 * @property {string} title the header title
 * @property {string} leftButton 'goBack' || 'openDrawer'
 * @property {object} the right Button
 * @property {string} icon the right button Icon
 * @property {function} handler the right button handler function
 */
CustomHeader.propTypes = {
  title: PropTypes.string.isRequired,
  leftButton: PropTypes.string,
  rightButton: PropTypes.shape({
    icon: PropTypes.string,
    handler: PropTypes.func,
  }),
};

export default withNavigation(CustomHeader);
