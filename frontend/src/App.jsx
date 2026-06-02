import React, { useState } from 'react' 
import './index.css' 
import { PiCodaLogoBold } from "react-icons/pi"; 
import { MdOutlineDashboard } from "react-icons/md"; 
import { CiCirclePlus } from "react-icons/ci"; 
import { IoPeople } from "react-icons/io5"; 
import Dashboard from './components/Dashboard'; 
import Addlead from './components/Addlead'; 
import Lead from './components/Lead'; 
import Auth from './components/Auth'; // 1. Import our newly created Auth component

function App() {   
  const [user, setUser] = useState(null) // 2. Track authentication state
  const [pages, setPage] = useState('dashboard') 

  const page = {   
    dashboard: <Dashboard />,   
    lead: <Lead />,   
    add: <Addlead />   
  }

  // 3. Guard Clause: If user is not authenticated, strictly show the Auth screen
  if (!user) {
    return <Auth onAuthSuccess={(userData) => setUser(userData)} />
  }

  return (          
    <div className='flex w-screen h-screen'>       
      <div className='bg-side w-[24%] border border-brdr shadow-2xl flex flex-col justify-between'>         
        <div>
          <div className='p-3 border-b border-brdr h-[5em] text-white flex items-center gap-1'>       
            <PiCodaLogoBold color='blue' size={46}/>       
            <div>          
              <h2 className='text-xl '>LeadFlow</h2>           
              <h2 className='text-xs'>Sales CRM</h2>          
            </div>         
          </div>         
          <div className='text-txt pt-5 ml-2'>         
            <h2 className='font-bold'>MAIN</h2>         
            <div>           
              <div className='mt-3 ml-3 mb-2 '>           
                <div className={pages==='dashboard'?'flex gap-1 items-center bg-gray-800 text-white p-2 w-[90%] rounded-2xl mb-2 cursor-pointer':'flex gap-1 items-center mb-2 hover:bg-gray-800 hover:text-white p-2 w-[90%] rounded-2xl cursor-pointer'} onClick={()=>{setPage('dashboard')}}>             
                  <MdOutlineDashboard/>             
                  <h2>Dashboard</h2>           
                </div>           
                <div className={pages==='lead'?'flex gap-1 items-center bg-gray-800 text-white p-2 w-[90%] rounded-2xl mb-2 cursor-pointer':'flex gap-1 items-center mb-2 hover:bg-gray-800 hover:text-white p-2 w-[90%] rounded-2xl cursor-pointer'} onClick={()=>{setPage('lead')}}>             
                  <IoPeople/>     
                  <h2>Leads</h2>           
                </div>           
              </div>           
              <h2 className='font-bold'>TOOLS</h2>                  
              <div className={pages==='add'?'flex gap-1 items-center mt-3 ml-3 mb-2 bg-gray-800 text-white p-2 w-[90%] rounded-2xl cursor-pointer':'flex gap-1 items-center mt-3 ml-3 mb-2 hover:bg-gray-800 hover:text-white p-2 w-[90%] rounded-2xl cursor-pointer'} onClick={()=>{setPage('add')}}>             
                <CiCirclePlus/>             
                <h2>Add lead</h2>           
              </div>         
            </div>         
          </div>       
        </div>

        {/* 4. Quick Logout Button */}
        <div className='p-4 border-t border-brdr mb-2'>
          <button onClick={() => setUser(null)} className='text-red-400 hover:text-red-300 bg-transparent w-full text-left px-3 py-2 text-sm font-medium cursor-pointer'>
            Logout
          </button>
        </div>
      </div>       
      <div className='bg-bg w-full h-full'>         
        {page[pages]}       
      </div>     
    </div> 
  )
}

export default App