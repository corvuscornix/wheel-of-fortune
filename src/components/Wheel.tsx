import styled from 'styled-components/macro';
import React, { createRef } from 'react';
import { observer } from 'mobx-react';
import { useStore } from './../store/store';
import { CenterAlign } from './layout';
import { Sector } from '../store/createStore';

const MIN_SPIN_TIME = 2;
const MAX_SPIN_TIME = 2;
const SECTOR_COUNT = 24;
const SETOR_WIDTH_IN_DEG = 360 / SECTOR_COUNT;
const ARROW_OFFSET = 270;

const Container = styled.div`
  max-width: 600px;
  position: relative;
`;

const WheelImage = styled.div<{ isSpinning: boolean }>`
  width: 400px;
  height: 400px;
  position: relative;
  background: url('wheel2.png');
  background-size: contain;
  animation: rotate 1.5s infinite linear;
  animation-play-state: ${props => (props.isSpinning ? 'play' : 'paused')};
`;

const Arrow = styled.div`
  position: absolute;
  border: 20px black solid;
  border: 10px transparent solid;
  border-right: 20px #4caf50 solid;
  transform: scale(4, 2);
  right: 0;
  top: calc(50% - 20px);
`;

const SpinButton = styled.button`
  position: absolute;
  left: calc(50% - 75px);
  top: calc(50% - 75px);
  width: 150px;
  height: 150px;
  font-size: 24px;
  background: greenyellow;
  border-radius: 50%;

  :disabled {
    display: none;
  }
`;

/*const sectors = [
  2500,
  'bankrupt',
  900,
  500,
  650,
  500,
  800,
  'lose a turn',
  700,
  'free play',
  650,
  'bankrupt',
  600,
  500,
  550,
  600,
  'bankrupt',
  700,
  500,
  650,
  600,
  700,
  600,
  'wild00'
];*/
const sectors = [
  Sector.LOSE_A_TURN,
  Sector.POINTS_700,
  Sector.POINTS_900,
  Sector.POINTS_650,
  Sector.BANKRUPT,
  Sector.POINTS_900,
  Sector.POINTS_500,
  Sector.POINTS_550,
  Sector.POINTS_600,
  Sector.POINTS_500,
  Sector.POINTS_700,
  Sector.POINTS_500,
  Sector.POINTS_800,
  Sector.POINTS_600,
  Sector.POINTS_700,
  Sector.POINTS_900,
  Sector.POINTS_500,
  Sector.POINTS_5000,
  Sector.BANKRUPT,
  Sector.POINTS_900,
  Sector.POINTS_500,
  Sector.POINTS_650,
  Sector.POINTS_500,
  Sector.POINTS_800
];

/**
 * Get rotation of a dom element. Thanks to https://stackoverflow.com/a/54492696
 *
 * @param element: Element
 */
function getRotation(element: HTMLElement): number {
  var st = window.getComputedStyle(element, null);
  var tm =
    st.getPropertyValue('-webkit-transform') ||
    st.getPropertyValue('-moz-transform') ||
    st.getPropertyValue('-ms-transform') ||
    st.getPropertyValue('-o-transform') ||
    st.getPropertyValue('transform') ||
    'none';
  if (tm !== 'none') {
    var values = tm
      .split('(')[1]
      .split(')')[0]
      .split(',');
    /*
    a = values[0];
    b = values[1];
    angle = Math.round(Math.atan2(b,a) * (180/Math.PI));
    */
    //return Math.round(Math.atan2(values[1],values[0]) * (180/Math.PI)); //this would return negative values the OP doesn't wants so it got commented and the next lines of code added
    var angle = Math.round(
      Math.atan2(parseFloat(values[1]), parseFloat(values[0])) * (180 / Math.PI)
    );
    return angle < 0 ? angle + 360 : angle; //adding 360 degrees here when angle < 0 is equivalent to adding (2 * Math.PI) radians before
  }
  return 0;
}

function getSpinResult(degrees: number): Sector {
  let degreesWithArrowOffset = degrees - SETOR_WIDTH_IN_DEG / 2 + ARROW_OFFSET;
  const sector =
    Math.ceil(degreesWithArrowOffset / (360 / SECTOR_COUNT)) % SECTOR_COUNT;
  console.log(
    `degrees ${degreesWithArrowOffset}, sector number: ${sector}, ${sectors[sector]}`
  );
  return sectors[sector];
}

const wheelImageRef = createRef<HTMLDivElement>();

export const Wheel: React.FunctionComponent = observer(props => {
  const store = useStore();

  const spin = () => {
    store.isSpinning = true;
    const randomSpinTime = MIN_SPIN_TIME + Math.random() * MAX_SPIN_TIME;
    console.log(`spin for ${randomSpinTime} sec`);
    setTimeout(() => {
      store.handleSpinResult(
        getSpinResult(getRotation(wheelImageRef.current as HTMLElement))
      );
    }, randomSpinTime * 1000);
  };

  return (
    <CenterAlign>
      <Container>
        <div style={{ overflow: 'hidden' }}>
          <WheelImage ref={wheelImageRef} isSpinning={store.isSpinning} />
          <Arrow />
        </div>
        <SpinButton
          disabled={
            store.isSpinning ||
            !store.players.length ||
            store.spinResult !== null
          }
          onClick={spin}
        >
          Spin
        </SpinButton>
      </Container>
    </CenterAlign>
  );
});
