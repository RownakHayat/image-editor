import QRCode from 'qrcode.react';
import React from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
}

const QRCodeComponent: React.FC<QRCodeProps> = ({
  value,
  size = 256,
  bgColor = "#ffffff",
  fgColor = "#000000",
  level = "L",
  includeMargin = false,
}) => {
  return (
    <QRCode
      value={value}
      size={size}
      bgColor={bgColor}
      fgColor={fgColor}
      level={level}
      includeMargin={includeMargin}
    />
  );
};

export default QRCodeComponent;
