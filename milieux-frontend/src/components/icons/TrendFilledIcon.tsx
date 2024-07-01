const TrendFilledIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="27"
      height="27"
      viewBox="0 0 48 48"
    >
      <defs>
        <mask id="ipSTrend0">
          <g fill="none" strokeLinejoin="round" strokeWidth="4.00">
            <path
              fill="#fff"
              stroke="#fff"
              d="M39 6H9a3 3 0 0 0-3 3v30a3 3 0 0 0 3 3h30a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3Z"
            />
            <path
              stroke="#000"
              strokeLinecap="round"
              d="m13.44 29.835l5.657-5.657l4.388 4.377L34 18"
            />
            <path stroke="#000" strokeLinecap="round" d="M26 18h8v8" />
          </g>
        </mask>
      </defs>
      <path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSTrend0)" />
    </svg>
  );
};

export default TrendFilledIcon;
