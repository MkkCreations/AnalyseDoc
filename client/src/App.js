import './App.css';
import Projects from './components/projects';
import Login from './components/login';
import { Route, Routes} from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import { ProtectedRoute } from './components/protectedRoute';
import Nav from './components/nav';
import Register from './components/signup';
import New from './components/new';
import NavDiligence from './components/navDiligence';
import Preview from './components/preview';
import Documents from './components/documents';
import Account from './components/account';
import Dashboard from './components/dashboard';
import GeneralDashboard from './components/generalDashboard';


function App() {
  return (
    <div className='app'>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/signup' element={<Register/>} />

          <Route path='/projects' element={
            <ProtectedRoute>
              <Nav />
              <Projects />
            </ProtectedRoute>
          }/>
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Nav />
              <GeneralDashboard />
            </ProtectedRoute>
          }/>
          <Route path='/new' element={
            <ProtectedRoute>
              <Nav />
              <New />
            </ProtectedRoute>
          }/>
          <Route path='/dili' element={
            <ProtectedRoute>
              <NavDiligence />
              <Preview />
            </ProtectedRoute>
          }/>
          <Route path='/dili/docs' element={
            <ProtectedRoute>
              <NavDiligence />
              <Documents />
            </ProtectedRoute>
          }/>
          <Route path='/dili/dashboard' element={
            <ProtectedRoute>
              <NavDiligence />
              <Dashboard />
            </ProtectedRoute>
          }/>
          <Route path='/account' element={
            <ProtectedRoute>
              <Nav />
              <Account />
            </ProtectedRoute>
          }/>
        </Routes>
      </AuthProvider>
    </div>
  );
}


export default App;
