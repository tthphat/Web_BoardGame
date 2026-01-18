import { PaginationSection } from "../common/PaginationSection";



function UserList() {
    return (
        <div className="w-full h-full">
            <div className="flex flex-col justify-between h-full">
                {/* Searchbar */}
                <div className="search-bar flex justify-end">
                    <div className="flex gap-2 font-mono">
                        <input type="text" placeholder="Search..." className="w-[300px] p-2 border border-gray-600" />
                        <button className="p-2 border border-gray-600 transition-all hover:bg-blue-800 hover:text-white">Search</button>
                    </div>
                </div>

                {/* Phân trang */}
                <PaginationSection />
            </div>
        </div>
    );
}

export default UserList;


