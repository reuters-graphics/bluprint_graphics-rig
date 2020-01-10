import { faCircle, faDesktop } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import ReactDOM from 'react-dom';
import { base } from '@reuters-graphics/style-color';
import classnames from 'classnames';
import { component } from './styles.scss';
import { faWindowRestore } from '@fortawesome/free-regular-svg-icons';
import ttiPolyfill from 'tti-polyfill';

let rootNode;
let tti;

const isFramer = () => window.location.href.indexOf('framer.html') > -1;

const roundToSeconds = (milliseconds) => {
  if (!milliseconds) return '';
  if (milliseconds < 500) return '<0.5s';
  return `~${Math.round(milliseconds / 100) / 10}s`;
};

const getColor = (tti) => {
  if (tti < 500) return base.green.hex;
  if (tti < 750) return base.yellow.hex;
  if (tti < 1000) return base.orange.hex;
  return base.red.hex;
};

class DevPanel extends React.Component {
  constructor(props) {
    super(props);
    const stateFromLocalStorage = localStorage.getItem('showHud');
    this.state = {
      visible: stateFromLocalStorage ? Boolean(parseInt(stateFromLocalStorage)) : true,
    };
  }

  componentDidMount() {
    document.addEventListener('keyup', (e) => {
      if (e.key === 'Escape') {
        localStorage.setItem('showHud', this.state.visible ? 0 : 1);
        this.setState(({ visible }) => ({ visible: !visible }));
      }
    });
  }

  render() {
    const { tti } = this.props;
    const { visible } = this.state;
    return (
      <div className={component}>
        <div className={classnames('fixed-tray', { visible })}>
          <div className='inline nav'>
            <a
              href='/'
              className={classnames({ active: !isFramer() })}
              title='Interactive page'
            >
              <FontAwesomeIcon fixedWidth icon={faDesktop} />
            </a>
            <a
              href='/framer.html'
              className={classnames({ active: isFramer() })}
              title='Embedded page'
            >
              <FontAwesomeIcon fixedWidth icon={faWindowRestore} />
            </a>
          </div>
          <div className='inline metrics'>
            {(tti && !isFramer()) && (
              <FontAwesomeIcon
                fixedWidth
                style={{
                  color: getColor(tti),
                  stroke: '#ddd',
                }}
                icon={faCircle}
                title={`Time to interactive: ${roundToSeconds(tti)}`}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

window.addEventListener('load', () => {
  rootNode = document.createElement('div');
  rootNode.id = 'dev-tool';
  document.body.appendChild(rootNode);
  ReactDOM.render(<DevPanel tti={tti} />, rootNode);
});

ttiPolyfill.getFirstConsistentlyInteractive({}).then((time) => {
  tti = time;
  ReactDOM.render(<DevPanel tti={tti} />, rootNode);
});
