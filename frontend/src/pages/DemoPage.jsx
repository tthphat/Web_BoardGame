export default function DemoPage({ title, description }) {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-[#c0c0c0] dark:bg-[#2d2d2d] p-1 border-2 border-white border-b-[#808080] border-r-[#808080] shadow-md">
                <div className="bg-[#e0e0e0] dark:bg-[#333] p-6 border-2 border-[#808080] border-b-white border-r-white">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 font-mono">
                        Current View: {title}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 font-mono">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}