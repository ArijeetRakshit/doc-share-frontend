import { useState, useContext, useEffect, useRef  } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserContext from '../../context/User/UserContext';
import Quill from 'quill';
import * as quillToWord from 'quill-to-word';
import 'quill/dist/quill.snow.css';
import './TextEditor.css';
import { saveAs } from 'file-saver';


const ToolBarOptions = [
  [{ header: [1,2,3,4,5,6,false] }],
  [{ font:[] }],
  [{ size: [] }],
  ['bold','italic','underline'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ align: [] }],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  ['image', 'blockquote', 'code-block'],
  ['clean']
]

const EditorTheme = {
  theme: 'snow',
  modules : {
    toolbar: ToolBarOptions
  }
};

const SaveIntervalMs = 3000;

const TextEditor = () => {
  const [ quill, setQuill ] = useState();
  const [ users, setUsers ] = useState([]);
  const { docId } = useParams();
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const editorContainerRef = useRef();

  const {  socket, userName } = userInfo;

  useEffect(()=>{
    if(!userName) navigate('/');

    const editor = document.createElement('div');
    const container = editorContainerRef.current;
    container.append(editor);
    const q = new Quill(editor, EditorTheme);
    q.disable();
    q.setText('Loading...');
    setQuill(q);

    return () => {
      container.innerHTML = null;
    };
    // eslint-disable-next-line
  },[]);
  
  useEffect(() => {
    if(!socket || !quill) return;
    socket.emit('join-socket', docId);

    const loadUsers = (u) => {
      setUsers(u);
    }
    socket.on('load-users', loadUsers);

    const loadDocument = (document) => {
      quill.setContents(document);
      quill.enable(true);
    }
    socket.once('load-document', loadDocument);
    
    socket.emit('get-user',userName,docId);
    socket.emit('get-document',docId);
    
    return ()=> {
      socket.off('load-users');
      socket.off('load-document', loadDocument);
    }
    // eslint-disable-next-line
  },[socket,quill,docId]);

  useEffect(()=> {
    if(!socket || !quill) return;

    const interval = setInterval(() => {
      socket.emit('save-document', docId, quill.getContents());
    },SaveIntervalMs);

    return () => {
      clearInterval(interval);
    }
  },[socket,quill,docId]);

  useEffect(() => {
    if(!socket || !quill) return;
    
    const handleText = (delta, oldDelta, source) => {
      if(source !== 'user') return;
      socket.emit('send-changes', docId, delta);
    }
    quill.on('text-change', handleText);

    return () => {
      quill.off('text-change', handleText);
    }
  },[socket,quill,docId]);

  useEffect(() => {
    if(!socket || !quill) return;

    const handleUpdate = (delta) => {
      quill.updateContents(delta)
    }
    socket.on('receive-change', handleUpdate);

    return () => {
      socket.off('receive-change', handleUpdate);
    }
  },[socket,quill]);

  const handleDownload = async() => {
    if(!quill) return;

    const contents = quill.getContents();
    const quillToWordConfig = {
      exportAs: 'blob'
    };
    const docAsBlob = await quillToWord.generateWord(contents, quillToWordConfig);
    saveAs(docAsBlob, docId);
  }

  return (
    <div className='container'>
      <div className='others'>
        <div className='docInfo'>
          <button onClick={handleDownload}>Download Doc File</button>
          <p><strong>Document Id:</strong> {docId}</p>
        </div>
        <div className="users">
          <h2>Users Online</h2>
          <div>
            {users.map((u) => 
              <p key={u.socketId}>
                {u.userName}
              </p>)
            }
          </div>
        </div>
      </div>
      <div className='editorContainer' ref={editorContainerRef} />
    </div>
  )
}

export default TextEditor;