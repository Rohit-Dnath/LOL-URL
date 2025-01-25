export const toastConfig = {
  position: "bottom-right",
  autoClose: 3000,
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: "dark",
  style: {
    '--toastify-toast-width': '320px',
    '--toastify-font-size': '14px',
  },
  toastClassName: 'relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer backdrop-blur-md bg-background/80 border border-border md:min-w-[320px] md:p-2',
  bodyClassName: 'text-sm font-medium block p-2 md:p-3'
};
