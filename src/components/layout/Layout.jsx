import { Toaster } from 'react-hot-toast';
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Toaster position="top-center" />
            <Navbar />
            <main className="flex-1 pt-16 md:pt-20">
                {children}
            </main>
            <Footer />
        </div>
    )
}
