import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const roundToFive = x => Math.ceil(x / 5) * 5;

const Sizer = (props) => (
  <div className='resizer'>
    <button
      onClick={() => props.resize(roundToFive(props.width - 5))}
      disabled={props.width <= 300}
    >
      <FontAwesomeIcon icon={faMinus} />
    </button>
    <input
      type='number'
      min={300}
      max={window.innerWidth - 25 - props.width}
      onChange={(e) => props.resize(parseInt(e.target.value))}
      value={props.width}
    />
    <button
      onClick={() => props.resize(roundToFive(props.width + 5))}
      disabled={window.innerWidth - 25 - props.width < 5}
    >
      <FontAwesomeIcon icon={faPlus} />
    </button>
  </div>
);

export default Sizer;
