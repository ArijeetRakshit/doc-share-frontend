import styles from './NotFound.module.css'

const NotFound = () => {
  return (
    <div className={styles.container}>
        <h1>Oops!</h1>
        <p>404 - Page not found!</p>
    </div>
  )
}

export default NotFound;