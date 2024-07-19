import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/auth/AuthContext';
import logo from '../../assets/logo-uno.png';
import logoutIcon from '../../assets/icons/log-out.svg';
import styles from './styles.module.css';

export const Navbar = () => {

    const { user, logout } = useContext(AuthContext);

  return (
    <header style={{ width: '100%' }}>
        <div className={styles.container}>
            <Link to='/'>
                <img src={logo} alt='Logo de UNO' className={styles.logo} />
            </Link>

            <div className={styles['second-container']}>
                <p>{user?.name?.split(' ')[0]},</p>
                <div className={styles['second-container']} style={{ gap: 25 }}>
                    <img src={user?.avatar} alt={`Avatar de ${user?.name}`} className={styles.avatar} />
                    <img src={logoutIcon} alt='Logout Icon' className={styles.icon} onClick={logout} />
                </div>
            </div>
        </div>
    </header>
  )
}
