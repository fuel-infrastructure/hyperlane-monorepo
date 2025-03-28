import React, { SVGProps, memo } from 'react';

function _FuelLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="354"
      height="354"
      viewBox="0 0 354 354"
      fill="none"
      {...props}
    >
      <g clipPath="url(#a)">
        <path
          d="M23.486 0A23.48 23.48 0 0 0 0 23.482v329.685h292.268a37.3 37.3 0 0 0 26.389-10.922l23.681-23.671a37.3 37.3 0 0 0 10.921-26.366V0z"
          fill="#00F58C"
        />
        <path
          d="M57.255 45.407h173.379L115.759 160.26a15.21 15.21 0 0 1-24.495-4.25L46.759 61.935a11.573 11.573 0 0 1 10.496-16.528M45.417 307.741V196.005a10.795 10.795 0 0 1 10.796-10.792h111.773zm151.06-151.01a27.26 27.26 0 0 1-19.269 7.977h-37L251.555 53.384a27.27 27.27 0 0 1 19.269-7.977h37z"
          fill="#000"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h353.241v353.241H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export const FuelLogo = memo(_FuelLogo);