import styles from './styles.module.css';

export const User = (user: any) => {
  return (
    <div className={styles['user']}>
        <div className={styles['badge-container']}>
            <img src={user?.avatar} alt={`Avatar de ${user?.name}`} className={styles.avatar} />
            <div className={styles[user?.online ? 'badge-online' : 'badge-off']} />
        </div>
        <p>{user?.name}</p>
    </div>
  )
}
