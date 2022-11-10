import { useState, useContext, useEffect } from 'react';
import { v4 } from "uuid"
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import UserContext from '../../context/User/UserContext';
import { io } from 'socket.io-client';

const Home = () => {
  const [ userName, setUserName ] = useState('');
  const [ docId, setDocId ] = useState('');
  const [ shouldGenerateDocId, setShouldGenerateDocId ] = useState(false);
  const [ errors , setErrors ] = useState({
    username:'',
    docId:'',
  });
  const navigate = useNavigate();
  const { setUser, userInfo, clearUser } = useContext(UserContext);

  useEffect(() =>{
    if(!!userInfo.socket){
      userInfo.socket.disconnect();
      clearUser();
    }
    // eslint-disable-next-line
  },[])


  const handleChange = (e) => {
    if(e.target.name === 'username'){
      setErrors((prev) => {
        let newErros = {...prev};
        newErros.username = '';
        return newErros
      })
      setUserName(e.target.value);
    }else {
      setErrors((prev) => {
        let newErros = {...prev};
        newErros.docId = '';
        return newErros
      })
      setDocId(e.target.value)
    }
  } 
  
  const handleGenerateNewDoc = () => {
    setErrors((prev) => {
      let newErros = {...prev};
      newErros.docId = '';
      return newErros
    })
    setDocId(v4());
  }

  const handleDocChoice = (choice) => {
    setDocId('');
    if(choice === 'Create a new Document'){
      setShouldGenerateDocId(true);
    }else{
      setShouldGenerateDocId(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = {
      username: '',
      docId: '',
    };
    if(!userName || !docId){
      if(!userName) err.username = 'Username required'
      if(!docId) err.docId = 'Document Id  required'
      setErrors(err)
      return;
    }
    if(!!userInfo.socket){
      userInfo.socket.disconnect();
      clearUser();
    }
    const s = io.connect(process.env.REACT_APP_SERVER)
    s.on('connect', ()=> {
      navigate(`/d/${docId}`);
      setUser(userName, s);
    })
  }

  return (
    <div className={styles['container']}>
      <div>
      <h1>Welcome to Doc Share</h1>
      <p className={styles.description}>Create, Share and Collaborate Freely!</p>

      <div className={styles['form']}>

        <div>
          <input type='text' 
            placeholder="Name..." 
            name='username' 
            value={userName}
            onChange={handleChange}
            required
          /> 
          {errors.username !== '' && <p className={styles.errors}>{errors.username}</p> }
        </div> 

        <div>
          {
            !shouldGenerateDocId ? 
            <input type='text'
              placeholder='Paste the Document Id here'
              name='docId'
              value={docId} 
              onChange={handleChange}
              required
            /> :
            <div className={styles['generate-doc']}>
              <button onClick={handleGenerateNewDoc}> Generate a new document </button>
              { docId !=='' && <p><strong>Document Id:</strong> {docId}</p> }
            </div>
          }
          {errors.docId !== '' && <p className={styles.errors}>{errors.docId}</p> }
        </div>
        
        <button 
          className={`${styles.submit} ${(!!errors.username || !!errors.docId || !userName || !docId) ? '' : styles.correct}`} 
          type='submit' 
          onClick={handleSubmit}
          disabled={(!!errors.username || !!errors.docId || !userName || !docId)}
        >
          Submit
        </button>
        { 
          !shouldGenerateDocId ? 
          <button onClick={() => handleDocChoice('Create a new Document')}> 
            Create a new Document
          </button> :
          <button onClick={() => handleDocChoice('Have a Document Id')}> 
            Have a Document Id
          </button>
        }
      </div>
    </div>
    </div>
  )
}

export default Home;