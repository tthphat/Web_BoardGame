import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: `
            group 
            w-full 
            font-mono 
            flex items-center gap-4
            
            /* --- FORCE RETRO STYLE (Dùng dấu ! để ghi đè mọi thứ) --- */
            !bg-white dark:!bg-[#2d2d2d] 
            !text-black dark:!text-green-400
            
            /* Viền vuông & dày */
            !rounded-none 
            !border-2 !border-black dark:!border-white
            
            /* Bóng đổ cứng (Hard Shadow) */
            !shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
            dark:!shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]
            
            /* Padding */
            !p-4
          `,
          description: "!text-gray-500 dark:!text-gray-400 !text-xs",
          actionButton: "!bg-black !text-white !rounded-none font-bold",
          cancelButton: "!bg-gray-200 !text-black !rounded-none",
          
          /* Màu icon/text cho các trạng thái (ghi đè richColors nếu có) */
          error: "!text-red-600 dark:!text-red-400",
          success: "!text-green-700 dark:!text-green-400",
          warning: "!text-yellow-600 dark:!text-yellow-400",
          info: "!text-blue-600 dark:!text-cyan-400",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };