export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex-shrink-0">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="font-bold text-xl tracking-tight">Admin CMS</h1>
                </div>
                <nav className="p-4 space-y-1">
                    <a href="/admin/courses" className="block px-4 py-3 rounded-lg bg-slate-800 text-white font-medium">
                        Courses
                    </a>
                    <a href="#" className="block px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                        Users (Coming Soon)
                    </a>
                    <a href="#" className="block px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                        Settings
                    </a>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shadow-sm">
                    <h2 className="font-semibold text-slate-700">Course Builder</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-500">Admin User</span>
                        <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                    </div>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
