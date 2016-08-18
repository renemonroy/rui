import React, { Component, PropTypes } from 'react';
import { Motion, spring } from 'react-motion';
import { fastEaseOutElastic, easeOut } from '../constants/SpringPresets';

require('./RUISwipeableCards.styl');

let styles = null;

class RUISwipeableCards extends Component {

  static displayName = 'RUISwipeableCards';

  static propTypes = {
    cardRenderer: PropTypes.func.isRequired,
    length: PropTypes.number,
    stackSize: PropTypes.number,
    initialIndex: PropTypes.number,
    cardWidth: PropTypes.number,
    cardHeight: PropTypes.number,
  };

  static defaultProps = {
    cardRenderer: (i, k) => <div key={k}>{i}</div>,
    length: 0,
    stackSize: 3,
    initialIndex: 0,
    cardWidth: 320,
    cardHeight: 480,
  }

  constructor(props) {
    super(props);
    const { initialIndex, stackSize } = this.props;
    const maxSize = stackSize > 5 ? 5 : stackSize;
    this.state = {
      ...this.constrain(initialIndex, maxSize, this.props),
      delta: 0,
      mouse: 0,
      limit: 160,
      decision: 0,
      condition: 0, // default: 0, isCancelling: 1, isDragging: 2, isLeaving: 3
    };
  }

  componentWillReceiveProps(next) {
    const { from, size } = this.state;
    this.setState(this.constrain(from, size, next));
  }

  getCardStyles(x) {
    const { limit, condition } = this.state;
    let deg = 0;
    let val = x;
    switch (condition) {
      case 1:
        deg = val / 40;
        break;
      case 2:
        deg = val / 40;
        break;
      case 3:
        val = -(limit * 2);
        break;
      default:
        val = 0;
    }
    const transStyle = `translate3d(${val}px, 32px, 0) scale(1) rotate(${deg}deg)`;
    return {
      transform: transStyle,
      WebkitTransform: transStyle,
    };
  }

  animCard() {
    const { mouse, condition } = this.state;
    switch (condition) {
      case 1:
        return { x: spring(0, fastEaseOutElastic) };
      case 2:
        return { x: mouse };
      case 3:
        return { x: spring(0, easeOut) };
      default:
        return { x: spring(0, fastEaseOutElastic) };
    }
  }

  discard() {
    const { from, size } = this.state;
    const ps = this.props;
    if (ps.onDiscard) ps.onDiscard(from);
    this.restart(from + 1, size);
  }

  accept() {
    const { from, size } = this.state;
    const ps = this.props;
    if (ps.onAccept) ps.onAccept(from);
    this.restart(from + 1, size);
  }

  decide() {
    const { mouse, limit } = this.state;
    if (mouse >= limit) {
      this.setState({ condition: 3, delta: 0, decision: 1 }, ::this.accept);
    } else if (mouse <= -limit) {
      this.setState({ condition: 3, delta: 0, decision: -1 }, ::this.discard);
    } else {
      this.setState({ condition: 1, delta: 0, decision: 0 });
    }
  }

  restart(from, size) {
    const ps = this.props;
    this.setState({
      ...this.constrain(from, size, ps),
      decision: 0,
      condition: 0,
    }, () => { if (ps.onChange) ps.onChange(from); });
  }

  constrain(from, size, { length }) {
    const diff = this.props.length - from;
    const maxSize = size > diff ? diff : size;
    const fromIndex = Math.max(Math.min(from, length), 0);
    return { from: fromIndex, size: maxSize };
  }

  handleTouchStart(pressX, e) {
    this.setState({
      delta: e.touches[0].pageX - pressX,
      mouse: pressX,
      condition: 2,
    });
  }

  handleTouchMove(e) {
    e.preventDefault();
    const { condition, delta } = this.state;
    if (condition === 2) this.setState({ mouse: e.touches[0].pageX - delta });
  }

  handleTouchEnd() {
    this.decide();
  }

  handleDiscardClick(e) {
    e.preventDefault();
    this.setState({ mouse: -this.state.limit, condition: 2 }, () => {
      setTimeout(() => this.decide(), 0);
    });
  }

  handleAcceptClick(e) {
    e.preventDefault();
    this.setState({ mouse: this.state.limit, condition: 2 }, () => {
      setTimeout(() => this.decide(), 0);
    });
  }

  renderNavigation() {
    return (
      <div className="rui-swipeable-navigation">
        <button
          className="discard-button bg-black border-grey"
          onClick={::this.handleDiscardClick}
        >
          <i className="glyph g72-thumbs-down text-color-white" />
        </button>
        <button
          className="accept-button bg-black border-grey"
          onClick={::this.handleAcceptClick}
        >
          <i className="glyph g72-thumbs-up text-color-white" />
        </button>
      </div>
    );
  }

  render() {
    const { cardRenderer, cardWidth, cardHeight } = this.props;
    const { from, size, condition } = this.state;
    const cards = [];
    const contStyles = { width: `${cardWidth}px`, height: `${cardHeight}px` };
    const cs = styles.card;
    for (let i = 0; i < size; i++) {
      cards.unshift({ key: `snkr-card-${from + i}`, index: i });
    }
    this.lastIndex = size - 1;
    return (
      <div className="rui-swipeable-cards">
        <div className="rui-swipeable-container" style={contStyles}>
          {cards.map(({ key, index }) =>
            <Motion
              style={this.animCard()}
              key={`rui-card-motion-${key}`}
            >
              {({ x }) =>
                <div
                  onTouchStart={this.handleTouchStart.bind(this, x)}
                  onTouchMove={::this.handleTouchMove}
                  onTouchEnd={::this.handleTouchEnd}
                  key={key}
                  className={`rui-swipeable-card${condition !== 0 ? '' : ' rui-transition'}`}
                  style={index === 0 ? this.getCardStyles(x) : cs[`st${index}`]}
                >
                  {cardRenderer(from + index, index)}
                </div>
              }
            </Motion>
          )}
        </div>
        {cards.length > 0 ? this.renderNavigation() : null}
      </div>
    );
  }

}

styles = {
  card: {
    st1: {
      transform: 'translate3d(0, 16px, 0) scale(0.95)',
      WebkitTransform: 'translate3d(0, 16px, 0) scale(0.95)',
    },
    st2: {
      transform: 'translate3d(0, 0px, 0) scale(0.9)',
      WebkitTransform: 'translate3d(0, 0px, 0) scale(0.9)',
    },
    st3: {
      transform: 'translate3d(0, -16px, 0) scale(0.85)',
      WebkitTransform: 'translate3d(0, -16px, 0) scale(0.85)',
    },
    st4: {
      transform: 'translate3d(0, -32px, 0) scale(0.8)',
      WebkitTransform: 'translate3d(0, -32px, 0) scale(0.8)',
    },
  },
};

export default RUISwipeableCards;