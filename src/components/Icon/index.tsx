import React from 'react';
import IcoMoon from 'react-icomoon';
import iconsSet from './icons/index.json';
import {IconProps} from './interface';

export const Icon: React.FC<IconProps> = ({
  name = 'bank',
  size = 18,
  color = '#000',
}) => (
  <IcoMoon
    native
    iconSet={iconsSet}
    size={size}
    color={color}
    icon={name}
    disableFill={true}
  />
);
