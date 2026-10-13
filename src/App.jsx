import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import { AuthProvider } from './context/AuthContext'

const Home = lazy(() => import('./pages/Home'))
const Books = lazy(() => import('./pages/Books'))
const BookDetail = lazy(() => import('./pages/BookDetail'))
const News = lazy(() => import('./pages/News'))
const NewsDetail = lazy(() => import('./pages/NewsDetail'))
const Submission = lazy(() => import('./pages/Submission'))
const Writers = lazy(() => import('./pages/Writers'))
const WriterDetail = lazy(() => import('./pages/WriterDetail'))
const Team = lazy(() => import('./pages/Team'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Legal = lazy(() => import('./pages/Legal'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Login = lazy(() => import('./pages/Login'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))

function Loader(){return <div className="grid min-h-screen place-items-center bg-diu-navy text-white"><div className="text-center"><img src="/brand/diu-press-logo.png" alt="" className="mx-auto h-14 w-14 animate-pulse"/><div className="mt-4 text-[10px] font-semibold uppercase tracking-[.18em] text-white/[.45]">Loading DIU Press</div></div></div>}

export default function App(){
  const location = useLocation()
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 3500,
          style: {
            background: '#FFFFFF',
            color: '#071A3D',
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: '12px',
            fontWeight: '500',
            letterSpacing: '-0.01em',
            borderRadius: '10px',
            padding: '10px 14px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 25px -3px rgba(7, 26, 61, 0.08), 0 4px 10px -2px rgba(7, 26, 61, 0.04)'
          },
          success: {
            style: {
              borderLeft: '3px solid #174EA6'
            },
            iconTheme: {
              primary: '#174EA6',
              secondary: '#FFFFFF'
            }
          },
          error: {
            style: {
              borderLeft: '3px solid #EF3035'
            },
            iconTheme: {
              primary: '#EF3035',
              secondary: '#FFFFFF'
            }
          }
        }}
      />
      <Layout>
        <Suspense fallback={<Loader/>}>
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.22}}>
              <Routes location={location}>
                <Route path="/" element={<Home/>}/>
                <Route path="/books" element={<Books/>}/>
                <Route path="/books/:slug" element={<BookDetail/>}/>
                <Route path="/news" element={<News/>}/>
                <Route path="/news/:slug" element={<NewsDetail/>}/>
                <Route path="/writers" element={<Writers/>}/>
                <Route path="/writers/:slug" element={<WriterDetail/>}/>
                <Route path="/submission" element={<Submission/>}/>
                <Route path="/team" element={<Team/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/contact" element={<Contact/>}/>
                <Route path="/privacy" element={<Legal type="privacy"/>}/>
                <Route path="/terms" element={<Legal type="terms"/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/admin" element={<AdminDashboard/>}/>
                <Route path="/admin/account-settings" element={<AdminDashboard/>}/>
                <Route path="/dashboard" element={<AdminDashboard/>}/>
                <Route path="/dashboard/account-settings" element={<AdminDashboard/>}/>
                <Route path="*" element={<NotFound/>}/>
              </Routes>
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </Layout>
    </AuthProvider>
  )
}
