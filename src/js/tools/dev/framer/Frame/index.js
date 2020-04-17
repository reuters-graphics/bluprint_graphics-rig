import Logo from 'react-svg-loader!./Logo.svg'; // eslint-disable-line
import React from 'react';
import Resizer from './Resizer';
import classnames from 'classnames';
import { component } from './styles.scss';
import pym from 'pym.js';

class Frame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: parseInt(localStorage.getItem('previewWidth')) || 650,
    };
  }

  componentDidMount() {
    new pym.Parent(
      'frame-parent',
      window.location.href.replace('framer.html', 'embed.html')
    ); // eslint-disable-line
  }

  resize = (width) => {
    localStorage.setItem('previewWidth', width);
    this.setState({ width });
  };

  render() {
    const { width } = this.state;
    return (
      <div className={classnames('container ', component)}>
        <header>
          <Logo width={150} />
        </header>
        <div id="frame-parent" style={{ width: this.state.width }} />
        <Resizer width={width} resize={this.resize} />
      </div>
    );
  }
}

export default Frame;
