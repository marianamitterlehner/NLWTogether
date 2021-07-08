import { Route, BrowserRouter, Switch } from 'react-router-dom';
import { Home } from './pages/authenticate/Home';
import { NewRoom } from './pages/authenticate/NewRoom';
import { Room } from './pages/rooms/Room';
import { AdminRoom } from './pages/rooms/AdminRoom';

import './styles/global.scss';

import {AuthContextProvider} from './contexts/AuthContext';
import { ExistingRoom } from './pages/authenticate/ExistingRoom';

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/rooms/new" exact component={NewRoom} />
          <Route path="/rooms/existing" exact component={ExistingRoom} />
          <Route path="/rooms/:id" component={Room} />
          <Route path="/admin/rooms/:id" component={AdminRoom} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
