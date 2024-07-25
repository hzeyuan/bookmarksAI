import { BookmarksPanel } from "./BookmarksPanel"
import Navigation from "./Navigation"

export const BookmarksContainer = () => {
    return (
        <div className=" ">
            <h2 className="mb-4 text-5xl font-bold inter-black text-slate-900 text-center tracking-tight">
                BookMarks  Manager
            </h2>
            <p className="mb-8 text-lg text-slate-600 text-center">
                Beautifully designed bookmarks manager to organize your bookmarks
            </p>

            {/* Static Sidebar for Desktop */}
            <div className="flex">
                <div className="hidden  lg:inset-y-0 lg:z-50 lg:flex lg:w-60 lg:flex-col">
                    <div className="flex flex-col border-r border-gray-200 dark:pintree-border-gray-800 bg-white px-4 h-full font-semibold dark:pintree-bg-gray-900">
                        {/* <div className="flex p-0 h-16 shrink-0 items-center">
                    <img
                        className="pl-2 h-8 w-auto"
                        src="assets/logo.svg"
                        alt="Pintree"
                    />
                    <a href="" className="ml-4 font-extrabold text-2xl dark:text-white">
                        Pintree
                    </a>
                </div> */}
                        <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar p-1 cursor-pointer">
                            <div id="sidebar" className="flex   w-52  flex-1 flex-col">
                                <Navigation
                                ></Navigation>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Main Content Area */}
                <BookmarksPanel></BookmarksPanel>
            </div>
        </div>
    )
}