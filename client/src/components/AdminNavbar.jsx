import { Link } from 'react-router-dom'

const AdminNavbar = () => {
  return (
    <div  className='flex items-center px-16 md:px-12 h-18 border border-b border-gray-300/30'>
      <Link to='/'>
      <img src="/navlogo.png" alt="Logo" className='w-36 h-auto'/>
      </Link>
    </div>
  )
}

export default AdminNavbar
