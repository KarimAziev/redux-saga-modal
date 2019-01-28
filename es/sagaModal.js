import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import hoistStatics from 'hoist-non-react-statics';
import { getDisplayName } from './utils';
import { modalsStateSelector } from './selectors';
import { InjectedWrapperComponent, ConnectModalState, ConnectModalProps } from './types';
var initialState = {
  isOpen: false
};

var sagaModal = function sagaModal(_ref) {
  var name = _ref.name,
      _ref$getModalsState = _ref.getModalsState,
      getModalsState = _ref$getModalsState === void 0 ? modalsStateSelector : _ref$getModalsState,
      _ref$initProps = _ref.initProps,
      initProps = _ref$initProps === void 0 ? initialState : _ref$initProps;
  return function (ModalComponent) {
    var ConnectedModal =
    /*#__PURE__*/
    function (_React$Component) {
      _inheritsLoose(ConnectedModal, _React$Component);

      function ConnectedModal() {
        var _this;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

        _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
          isOpen: !!_this.props.modal.isOpen
        });

        _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "hide", function () {
          _this.props.hideModal(name);
        });

        _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "click", function (value) {
          return _this.props.clickModal(name, value);
        });

        _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "update", function (newProps) {
          return _this.props.updateModal(name, newProps);
        });

        return _this;
      }

      var _proto = ConnectedModal.prototype;

      _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
        var modal = this.props.modal;
        var isOpen = modal.isOpen;
        var isToggled = isOpen !== prevProps.modal.isOpen;

        if (isToggled) {
          this.setState({
            isOpen: isOpen
          });
        }
      };

      _proto.getCurriedActions = function getCurriedActions() {
        return Object.freeze({
          hide: this.hide.bind(this),
          click: this.click.bind(this),
          update: this.update.bind(this)
        });
      };

      _proto.render = function render() {
        var isOpen = this.state.isOpen;

        var _this$props = this.props,
            modal = _this$props.modal,
            ownProps = _objectWithoutPropertiesLoose(_this$props, ["modal"]);

        if (!isOpen) {
          return null;
        }

        var props = _extends({}, ownProps, modal, this.getCurriedActions(), {
          isOpen: isOpen
        });

        return React.createElement(ModalComponent, props);
      };

      return ConnectedModal;
    }(React.Component);

    _defineProperty(ConnectedModal, "propTypes", {
      modal: PropTypes.object.isRequired,
      displayName: PropTypes.string
    });

    _defineProperty(ConnectedModal, "displayName", "ConnectedModal(" + String(getDisplayName(ModalComponent, name)) + ")");

    _defineProperty(ConnectedModal, "contextTypes", {
      store: PropTypes.object.isRequired
    });

    var mapStateToProps = function mapStateToProps(state) {
      return _extends({}, initProps, {
        modal: getModalsState(state)[name] || initialState
      });
    };

    var mapDispatchToProps = function mapDispatchToProps(dispatch) {
      return _extends({}, bindActionCreators(_extends({}, actions), dispatch));
    };

    return connect(mapStateToProps, mapDispatchToProps)(hoistStatics(ConnectedModal, ModalComponent));
  };
};

export default sagaModal;