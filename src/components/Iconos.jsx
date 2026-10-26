const base = (props) => ({ width: 22, height: 22, viewBox: '0 0 24 24', 'aria-hidden': true, ...props });

export const IconoWhatsApp = (props) => (
  <svg {...base(props)}>
    <path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.9 2.3 1 2.5c.1.2 1.7 2.6 4.1 3.6 1.5.7 2.1.7 2.9.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
  </svg>
);

export const IconoInstagram = (props) => (
  <svg {...base(props)}>
    <path fill="currentColor" d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4ZM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4ZM12 2c-2.7 0-3 0-4.1.1-1 0-1.8.2-2.4.5a5 5 0 0 0-2.9 2.9c-.3.6-.5 1.4-.5 2.4C2 9 2 9.3 2 12s0 3 .1 4.1c0 1 .2 1.8.5 2.4a5 5 0 0 0 2.9 2.9c.6.3 1.4.5 2.4.5 1.1.1 1.4.1 4.1.1s3 0 4.1-.1c1 0 1.8-.2 2.4-.5a5 5 0 0 0 2.9-2.9c.3-.6.5-1.4.5-2.4.1-1.1.1-1.4.1-4.1s0-3-.1-4.1c0-1-.2-1.8-.5-2.4a5 5 0 0 0-2.9-2.9c-.6-.3-1.4-.5-2.4-.5C15 2 14.7 2 12 2Zm0 1.8c2.7 0 3 0 4 .1.9 0 1.5.2 1.8.3.5.2.8.4 1.2.8.4.4.6.7.8 1.2.1.3.3.9.3 1.8.1 1 .1 1.3.1 4s0 3-.1 4c0 .9-.2 1.5-.3 1.8-.2.5-.4.8-.8 1.2-.4.4-.7.6-1.2.8-.3.1-.9.3-1.8.3-1 .1-1.3.1-4 .1s-3 0-4-.1c-.9 0-1.5-.2-1.8-.3-.5-.2-.8-.4-1.2-.8-.4-.4-.6-.7-.8-1.2-.1-.3-.3-.9-.3-1.8-.1-1-.1-1.3-.1-4s0-3 .1-4c0-.9.2-1.5.3-1.8.2-.5.4-.8.8-1.2.4-.4.7-.6 1.2-.8.3-.1.9-.3 1.8-.3 1-.1 1.3-.1 4-.1Z" />
  </svg>
);

export const IconoPin = (props) => (
  <svg {...base(props)}>
    <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
  </svg>
);

export const IconoBolsa = (props) => (
  <svg {...base(props)}>
    <path fill="currentColor" d="M7 7V6a5 5 0 0 1 10 0v1h3l1 15H3L4 7h3Zm2 0h6V6a3 3 0 0 0-6 0v1Zm-3.1 2-.7 11h13.6l-.7-11H17v2h-2V9H9v2H7V9H5.9Z" />
  </svg>
);

export const IconoLupa = (props) => (
  <svg {...base({ width: 20, height: 20, ...props })}>
    <path fill="currentColor" d="M10 3a7 7 0 1 0 4.2 12.6l5.1 5.1 1.4-1.4-5.1-5.1A7 7 0 0 0 10 3Zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z" />
  </svg>
);

export const IconoFlecha = ({ izquierda = false, ...props }) => (
  <svg {...base(props)} style={{ transform: izquierda ? 'scaleX(-1)' : undefined }}>
    <path fill="currentColor" d="M13.2 5.3 19.9 12l-6.7 6.7-1.4-1.4 4.3-4.3H4v-2h12.1l-4.3-4.3 1.4-1.4Z" />
  </svg>
);

export const IconoVaso = (props) => (
  <svg {...base({ width: 18, height: 18, ...props })}>
    <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" d="M6 4h12l-1.6 16H7.6L6 4Zm-.5 4h13M18 8h2.5" />
  </svg>
);

export const IconoCalendario = (props) => (
  <svg {...base({ width: 18, height: 18, ...props })}>
    <path fill="none" stroke="currentColor" strokeWidth="1.8" d="M4 6h16v14H4zM4 10h16M8 3v5M16 3v5" />
  </svg>
);

export const IconoCaja = (props) => (
  <svg {...base({ width: 18, height: 18, ...props })}>
    <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" d="m12 3 8 4v10l-8 4-8-4V7l8-4Zm0 0v0M4 7l8 4 8-4M12 11v10" />
  </svg>
);

export const IconoMas = ({ abierto, ...props }) => (
  <svg {...base({ width: 18, height: 18, ...props })}>
    <path fill="currentColor" d="M11 4h2v16h-2z" style={{ transformOrigin: 'center', transition: 'transform .3s', transform: abierto ? 'rotate(90deg)' : 'none' }} />
    <path fill="currentColor" d="M4 11h16v2H4z" />
  </svg>
);

export const IconoWeb = (props) => (
  <svg {...base(props)}>
    <path fill="none" stroke="currentColor" strokeWidth="1.8" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-9 9h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3Z" />
  </svg>
);

export const IconoReloj = (props) => (
  <svg {...base(props)}>
    <path fill="none" stroke="currentColor" strokeWidth="1.8" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4v5l3.5 2" />
  </svg>
);
