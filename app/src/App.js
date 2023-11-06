import './App.css';
import {useState } from 'react';
import axios from "axios";
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import Scatterplot  from './plotdata'
import small_conversation from './datasets/small_conversation.json'
import small_conversation_l20 from './datasets/small_conversation_l20.json'
import small_conversation_l25 from './datasets/small_conversation_l25.json'
import small_conversation_l35 from './datasets/small_conversation_l35.json'
import small_conversation_l39 from './datasets/small_conversation_l39.json'

const localDevURL = "http://127.0.0.1:8000/";
axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

let data_all ={'chats':small_conversation, 'l20':small_conversation_l20,'l25':small_conversation_l25,
'l35':small_conversation_l35,'l39':small_conversation_l39}
let labels_all ={'chats':small_conversation}

function App() {

    
  
  const [plottedData, setPlottedData] = useState(small_conversation);
  const [labelData, setLabelData] = useState(small_conversation);
  const [loading, setLoading] = useState(false);
  const [colorcol, setColorCol] = useState("5");
  const [chatcontent, setChatContent] = useState("");
  const [searched, setSearched] = useState([]);


  const [clusterBy, setClusterBy] = useState('chats');


  function searchStringInArray (str, strArray) {
    let indices = []
    for (var j=0; j<strArray.length; j++) {
        if (strArray[j][2].toLowerCase().match(str)) indices.push(j);
        
    }
    if (indices.length>0)return indices;
    return [];
}
  

function handleSearch(){
  setSearched([])
    if (document.getElementById("search").value){
      let found = searchStringInArray (document.getElementById("search").value.toLowerCase(), plottedData)
      setSearched(found)
      console.log(found)
    }

  }

  function handleChagesearch(){
    handleSearch()

  }

  const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
              try {
                  const json = JSON.parse(e.target.result);
                  setPlottedData(json)
              } catch (error) {
                  alert('Invalid JSON file');
              }
          };
          reader.readAsText(file);
      }
  };







  return (
    <div className="App">
      
      <div style={{ position: 'fixed', top: 20, left: 20, width: '300px', backgroundColor: 'rgba(0, 0, 0, 0.1)',
                 boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)',  // Drop shadow
                borderRadius: '20px' ,                         // Curved edges
                fontFamily: 'Perpetua',  // Setting the font family
                padding: '10px'

            }}>

        
        <h2>lmChat Explorer</h2>

       Dataset: <select 
        value={'chats'} 
        onChange={null}
        style={{ width: '50%', padding: '5px', borderRadius: '5px' }}>
        <option value="chats">Small Conv</option>
      </select>
      
      <br/><br/>

      Colored by: &nbsp;<select 
        value={colorcol} 
        onChange={e => {setColorCol(e.target.value)}}
        style={{ width: '50%', padding: '5px', borderRadius: '5px' }}>
        <option value="4">Parent label</option>
        <option value="5">Child label</option>

      </select>
      
      <br/><br/>
      Projected based on: &nbsp;
         <select 
        value={clusterBy} 
        onChange={e => {setClusterBy(e.target.value)}}
        style={{ width: '50%', padding: '5px', borderRadius: '5px' }}>
        <option value="chats">Content Similarity</option>
        <option value="l20">L20 Activations</option>
        <option value="l25">L25 Activations</option>
        <option value="l35">L35 Activations</option>
        <option value="l39">L39 Activations</option>

      </select>

      



       

        
        <div style={{display:'none'}}>
        <label id="name"><h4 style={{ paddingLeft: "15px",paddingTop: "0px"}} align="left">Load Projection</h4> </label>
        <input  type="file" accept=".json" onChange={handleFileChange} id="name" name="name" style={{ position:"relative", top: "-15px", left: "-10px"}} align="left" />
        <br />
        </div>
   
        </div>

        <div style={{ position: 'fixed', top: 20, left: '78%', width: '300px', height: '295px', backgroundColor: 'rgba(0, 0, 0, 0.1)',
                 boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)',  // Drop shadow
                borderRadius: '20px' ,                         // Curved edges
                fontFamily: 'Perpetua',  // Setting the font family
                padding: '10px',
                overflow:'scroll',
                

            }}>
            <b>Chat Content</b>

            <div id = "chatcontent" style={{ padding:'10px'}} ></div>
        </div>

        <div>
            <Scatterplot data={data_all[clusterBy]} labels ={labelData} colorcol={colorcol} width={1000} height={800} />
        </div>




        <div style={{ position: 'fixed', top: "96.5%", left: '86%', }}>
            @ Insight and Interaction Lab
        </div>
    </div>
  );
}

export default App;
