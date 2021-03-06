/* eslint-disable react/require-default-props */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Title, Button, Left, Right, Body, Icon } from 'native-base';
import { BLUE_MAIN } from '../../constants/colorPalette';
import { withNavigation } from 'react-navigation';
import { ifIphoneX } from 'react-native-iphone-x-helper';

/**
 * Use this header and pass the props to select your leftButton, title and
 * rightButton
 *
 * @augments Component
 */
class CustomHeader extends Component {
  render() {
    const { leftButton, title, rightButton } = this.props;

    return (
      <Header
        style={ifIphoneX(
          {
            paddingTop: 40,
            marginTop: 0,
            height: 85,
            backgroundColor: 'white',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.43,
            shadowRadius: 1.62,
            elevation: 12,
          },
          { backgroundColor: 'white' },
        )}>
        {leftButton === 'goBack' || leftButton === 'openDrawer' ? (
          <Left style={{ flex: 1 }}>
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
        <Body style={{ flex: 1 }}>
          <Title style={{ alignSelf: 'center', width: 200 }}>{title}</Title>
        </Body>
        <Right style={{ flex: 1 }}>
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
 *
 * @type {object}
 * @property {string} title the header title
 * @property {string} leftButton 'goBack' || 'openDrawer'
 * @property {object} the right Button
 * @property {string} icon the right button Icon
 * @property {Function} handler the right button handler function
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
