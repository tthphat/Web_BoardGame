import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="system"
      className="toaster group font-mono" // Sử dụng font-mono cho toàn bộ toast
      toastOptions={{
        classNames: {
          toast: `
            group 
            toast group-[.toaster]:bg-[#e0e0e0] dark:group-[.toaster]:bg-[#1a1a1a] 
            group-[.toaster]:text-black dark:group-[.toaster]:text-green-400
            group-[.toaster]:border-2 
            group-[.toaster]:border-black dark:group-[.toaster]:border-gray-500
            group-[.toaster]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:group-[.toaster]:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]
            group-[.toaster]:rounded-none
            group-[.toaster]:p-4
          `,
          description: "group-[.toast]:text-gray-600 dark:group-[.toast]:text-gray-400",
          actionButton:
            "group-[.toast]:bg-black group-[.toast]:text-white dark:group-[.toast]:bg-green-600 dark:group-[.toast]:text-black font-bold rounded-none",
          cancelButton:
            "group-[.toast]:bg-gray-200 group-[.toast]:text-black dark:group-[.toast]:bg-gray-700 dark:group-[.toast]:text-white rounded-none",
          
          // Tùy chỉnh màu sắc cho từng loại thông báo
          success: "group-[.toaster]:border-green-600 dark:group-[.toaster]:border-green-500",
          error: "group-[.toaster]:border-red-600 dark:group-[.toaster]:border-red-500 group-[.toaster]:text-red-700 dark:group-[.toaster]:text-red-400",
          info: "group-[.toaster]:border-blue-600 dark:group-[.toaster]:border-blue-400",
          warning: "group-[.toaster]:border-yellow-600 dark:group-[.toaster]:border-yellow-400",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };