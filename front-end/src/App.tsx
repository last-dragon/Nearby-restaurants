import MapWrapper from './components/MapWrapper';
import SideBar from './components/SideBar';
import { MapProvider } from './contexts/Map';

const App = () => {

  return (
    <div className="App" style={{
      width: "100%",
      height: "100vh",
      padding: "0",
      margin: "0",
      display: "flex",
      flexDirection: "row",
      position: "relative",
    }}>
      <MapProvider>
        <MapWrapper />
        <SideBar />
      </MapProvider>
    </div>
  );
}

export default App;
