import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Suggestion from './pages/Suggestion';
import Current from './pages/Current';
import Recommendation from './pages/Recommendation';
import Blogs from './pages/Blogs';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <BrowserRouter>
    <Sidebar>
    <Routes>
    <Route path='/' element = {<Current />}/>
    <Route path='/recommendations' element = {<Recommendation />}/>
    <Route path='/suggestion' element = {<Suggestion />}/>
    <Route path='/blogs' element = {<Blogs />}/>
    </Routes>
    </Sidebar>
    </BrowserRouter>
  );
}

export default App;
