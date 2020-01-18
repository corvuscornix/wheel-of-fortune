import styled from 'styled-components/macro';
import React, { createRef } from 'react';
import { observer } from 'mobx-react';
import { useAppState } from '../state/stateContext';
import { CenterAlign } from './layout';
import { useState } from 'react';
import { Sector } from '../state/types';

const MIN_SPIN_AMOUNT = 540;
const MAX_SPIN_AMOUNT = 900;
const SECTOR_COUNT = 24;
const SECTOR_WIDTH_IN_DEG = 360 / SECTOR_COUNT;
const ARROW_OFFSET = 270;

const Container = styled.div`
  max-width: 600px;
  position: relative;
`;

const WheelImage = styled.div<{
  isSpinning: boolean;
  rotation: number;
  rotationTime: number;
}>`
  width: 350px;
  height: 350px;
  position: relative;
  background: url('wheel2.png');
  background-size: contain;
  transform: rotateZ(${props => props.rotation}deg);
  transition: transform ${props => props.rotationTime}ms;
`;

const Arrow = styled.div`
  position: absolute;
  background: url('arrow.png');
  background-size: cover;
  width: 120px;
  height: 40px;
  right: -80px;
  top: calc(50% - 21px);
`;

const SpinButton = styled.button`
  position: absolute;
  left: calc(50% - 75px);
  top: calc(50% - 75px);
  width: 150px;
  height: 150px;
  font-size: 36px;
  font-weight: bold;
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

function getSpinResult(degrees: number): Sector {
  let sector =
    (Math.floor(
      (degrees + ARROW_OFFSET - SECTOR_WIDTH_IN_DEG / 2) / SECTOR_WIDTH_IN_DEG
    ) +
      1) %
    SECTOR_COUNT;
  return sectors[sector];
}

const wheelImageRef = createRef<HTMLDivElement>();

export const Wheel: React.FunctionComponent = observer(() => {
  const store = useAppState();

  const [{ rotation, rotationTime }, setRotation] = useState({
    rotation: 0,
    rotationTime: 0
  });

  const spin = () => {
    store.spin();
    const randomSpinAmount = MIN_SPIN_AMOUNT + Math.random() * MAX_SPIN_AMOUNT;
    const spinTime = (randomSpinAmount / 360) * 1000;
    const cumulativeSpinAmount = rotation + randomSpinAmount;
    setTimeout(() => {
      store.handleSpinResult(getSpinResult(cumulativeSpinAmount));
    }, spinTime);
    setRotation({ rotation: cumulativeSpinAmount, rotationTime: spinTime });
  };

  return (
    <CenterAlign>
      <Container>
        <div style={{ overflow: 'hidden' }}>
          <WheelImage
            ref={wheelImageRef}
            isSpinning={store.isSpinning}
            rotation={rotation}
            rotationTime={rotationTime}
          />
          <Arrow />
        </div>
        <SpinButton disabled={!store.canSpin} onClick={spin}>
          Spin
        </SpinButton>
      </Container>
    </CenterAlign>
  );
});
