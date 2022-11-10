import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import TextEditor from './pages/TextEditor/TextEditor';
import NotFound from './pages/NotFound/NotFound';
import { UserProvider } from './context/User/UserContext';

const App = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/d/:docId' element={<TextEditor />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  )
}

export default App;