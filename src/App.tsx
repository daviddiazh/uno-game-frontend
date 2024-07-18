import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Options } from './pages/Private/Options';
import { Login } from './pages/Login';
import { Enrollment } from './pages/Enrollment';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { Spinner } from './components/Spinner';

function App() {

  const { status, user } = useContext(AuthContext);

  console.log({ user })

  if (status === 'checking') return <Spinner />

  return (
    <div className='general-container'>
      <Routes>
        <Route path='/' element={ status === 'authenticated' ? <Options /> : <Login /> } />
        <Route path="/enrollment" element={ status === 'authenticated' ? <Options /> : <Enrollment /> } />

        <Route path='/*' element={ status === 'authenticated' ? <Options /> : <Login /> } />
      </Routes>
    </div>
  )
}

export default App
