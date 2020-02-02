import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { component } from './styles.scss';
import { faDesktop } from '@fortawesome/free-solid-svg-icons';
import { faWindowRestore } from '@fortawesome/free-regular-svg-icons';

let rootNode;

const isFramer = () => window.location.href.indexOf('framer.html') > -1;

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
        </div>
      </div>
    );
  }
}

window.addEventListener('load', () => {
  rootNode = document.createElement('div');
  rootNode.id = 'dev-tool';
  document.body.appendChild(rootNode);
  ReactDOM.render(<DevPanel />, rootNode);
});
