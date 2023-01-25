import './App.css';
import { gsap } from "gsap";
import Scene from './game/Scene.js';

function App() {
  return (
    <div style= {{display: 'inline-block', position: 'relative'}}>
    <div id= 'overlappingDiv' style= {{'backgroundColor': 'black', position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, opacity: 0, 'pointerEvents': 'none'}}>ye</div>
      <Scene width={1000} height={700}/>
    </div>
  );
}

export default App;
