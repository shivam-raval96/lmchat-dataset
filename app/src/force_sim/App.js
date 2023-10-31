import logo from './logo.svg';
import './App.css';
import ForceEmbedding from './force'
import hci_papers from './datasets/hci_papers.json'
import frankenstein from './datasets/frankenstein.json'
import middlemarch from './datasets/middlemarch.json'
import Slider from '@mui/material/Slider';
import {useState } from 'react';


let data_all ={"hci": hci_papers,"fkstein":frankenstein, "mmarch":middlemarch}

function App() {

  
  const [selectedOption, setSelectedOption] = useState('hci');
  const [selectedData, setSelectedData] = useState(hci_papers);
  const [selectedTh, setSelectedTh] = useState(0.7);

  let props = {"data":data_all[selectedOption], "sim_th":0.7}

  const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
              try {
                  const json = JSON.parse(e.target.result);
                  setSelectedData(json)
              } catch (error) {
                  alert('Invalid JSON file');
              }
          };
          reader.readAsText(file);
      }
  };

  const handleDownload = () => {
      if (selectedData) {
          const blob = new Blob([JSON.stringify(selectedData, null, 2)], { type: 'application/json' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'projections.json';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      } else {
          alert('No JSON data to download');
      }
  };
  return (
    <div className="App">
      <ForceEmbedding data={props}/>
      
      <div style={{ position: 'fixed', top: 20, left: 20, width: '300px', height: '525px', backgroundColor: 'rgba(0, 0, 0, 0.1)',
                 boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)',  // Drop shadow
                borderRadius: '20px' ,                         // Curved edges
                fontFamily: 'Perpetua'  // Setting the font family

            }}>
        {/* Any content or children components 
        <Slider
        aria-label="Similairty threshold"
        value = {selectedTh}
        min={0.6}
        max={1}
        step={0.05}
        onChange={e => {setSelectedTh(e.target.value)}}
        valueLabelDisplay="auto"
        color="secondary"
      />
        
        */}
        
        <h2>LLM Embedding Projections are just a start</h2>

        <select 
        value={selectedOption} 
        onChange={e => {setSelectedOption(e.target.value)}}
        style={{ width: '50%', padding: '5px', borderRadius: '5px' }}>
        <option value="hci">HCI Papers</option>
        <option value="fkstein">Frankenstein</option>
        <option value="mmarch">Middlemarch</option>
      </select>

      <button  style={{ margin:"15px", padding: '5px'}}onClick={handleDownload}>Save View</button>



        <p style={{ paddingLeft: "15px",paddingRight: "15px"}} align="left" >Each point is an embedded text. Visual clusters are identified by a clustering algorithm.  Links connect two points that have high cosine similary. <br /><br />
      This clustering may not be optimal for your task. You can change this!<br /><br />
        Select a point and drag it around to move it and other points most similar to it to where you think it should belong.<br /><br />
        Note that some points may shift closer to others. This view may not reflect the actual clustering in high dimensions. 
        
        </p>
        

        <label for="name"><h4 style={{ paddingLeft: "15px",paddingTop: "0px"}} align="left">Load Projection</h4> </label>
        <input  type="file" accept=".json" onChange={handleFileChange} id="name" name="name" style={{ position:"relative", top: "-15px", left: "-10px"}} align="left" />
        <br />
        
   
        </div>
    </div>
  );
}

export default App;
