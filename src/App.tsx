import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Options } from './pages/Private/Options';
import { Login } from './pages/Login';
import { Enrollment } from './pages/Enrollment';
import { useContext } from 'react';
import { AuthContext } from './context/auth/AuthContext';
import { Spinner } from './components/Spinner';

function App() {

  const { status } = useContext(AuthContext);

  const isLogged = status === 'authenticated';

  if (status === 'checking') return <Spinner />

  return (
    <div className='general-container'>
      <Routes>
        <Route path='/' element={ isLogged ? <Options /> : <Login /> } />
        <Route path="/enrollment" element={ isLogged ? <Options /> : <Enrollment /> } />

        <Route path='/*' element={ isLogged ? <Options /> : <Login /> } />
      </Routes>
    </div>
  )
}

export default App
