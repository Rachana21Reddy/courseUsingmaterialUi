import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import Axios from './Header';
import { TextField, Button }from '@material-ui/core';
// import Autocomplete from '@material-ui/lab/Autocomplete';

const SyllabusForm = props => {
  const [syllabusTitle, setTitle] = useState(props.syllabusData.syllabusTitle);
  const [description, setDescription] = useState(props.syllabusData.description);
  const [objectives, setObjectives] = useState(props.syllabusData.objectives);

  const handleChange = event => {
    if(event.target.name === "syllabusTitle") setTitle(event.target.value);
    if(event.target.name === "description") setDescription(event.target.value);
    if(event.target.name === "objectives") setObjectives(event.target.value);
  }

  const syllabus={
    "syllabusTitle":syllabusTitle,
    "description":description,
    "objectives":objectives
  };

  const handleSave = () =>{
    const index = props.index;
    const updateMode = props.syllabusData.updateMode;
    props.onSave(index, syllabus, updateMode); 
  }
  const handleCancel = () => props.onCancel(props.index);

  return(
    <>
    <TextField required id="outlined-basic" name="syllabusTitle" label="syllabusTitle" variant="outlined" value={syllabusTitle} onChange={handleChange} fullWidth />
    <TextField required id="outlined-basic" name="description" label="description" variant="outlined" value={description} onChange={handleChange} fullWidth/>
    <TextField required id="outlined-basic" name="objectives" label="objective" value={objectives} onChange={handleChange} variant="outlined"fullWidth />
    <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
    <Button variant="contained" color="primary" onClick={handleCancel}>Cancel</Button>
    {/* <br></br><strong>{props.index+1}</strong><br></br>
    <label>syllabus Title</label>
    <input type="text" name="syllabusTitle" id="syllabusTitle" value={syllabusTitle} onChange={handleChange}></input>
    <br></br>
    <label>Description</label>
    <input type="text" name="description" id="description" value={description} onChange={handleChange}></input>
    <br></br>
    <label>objectives</label>
    <input type="text" name="objectives" id="objectives" value={objectives} onChange={handleChange}></input>
    <br></br>
    <button onClick={handleSave} id="save">save</button>
    <button onClick={handleCancel} id="cancel">cancel</button>
    <br></br> */}
    </>
  );
}

const SyllabusCard = props => {
  const editsyllabus = () => props.edit(props.index);
  const deletesyllabus = () => props.delete(props.index);
  return (
    <div className="card">
      <br></br><label className="index">{props.index+1}</label><br></br>
      <label>syllabusTitle:{props.syllabusData.syllabusTitle}</label><br></br>
      <label>Description:{props.syllabusData.description}</label><br></br>
      <label>objectives:{props.syllabusData.objectives}</label><br></br>
      <button onClick={editsyllabus} id="edit">Edit</button>
      <button onClick={deletesyllabus} id="delete">Delete</button><br></br>
    </div>
  );
}

function Syllabus() {
  const history = useHistory();
  const [syllabusItems, setsyllabusItems] =  useState([]);
  const DisplayForm = () => {
    const syllabusItemsClone = [ ...syllabusItems];
    syllabusItemsClone.push({
      syllabusTitle: "",
      description: "",
      objectives: "",
      editMode: true,
      updateMode: false
    });
    setsyllabusItems(syllabusItemsClone);
  }

  useEffect(() => {
    Axios.get()
    .then((result)=> {
      const syllabuses = result.data;
      syllabuses.forEach(syllabus => {
        syllabus["editMode"] = false;
        syllabus["updateMode"] = true;
        setsyllabusItems(syllabuses);
        console.log(syllabuses);
      }); 
  })
    .catch((error) => console.log(error))
}, [])

const save = (index, syllabus, updateMode) => {
    const syllabusItemsClone = [...syllabusItems];
    const id=syllabusItemsClone[index].syllabusId;
    console.log(id);
    syllabusItemsClone[index] = syllabus;
    console.log(syllabusItemsClone);
    if(!updateMode) {
        Axios.post(
          {
            "syllabusTitle":syllabus.syllabusTitle,
            "description":syllabus.description,
            "objectives":syllabus.objectives
          })
        .then((result)=> {
          if(result.status === 201) {
            syllabusItemsClone[index] = result.data[0];
            syllabusItemsClone[index].editMode = false;
            syllabusItemsClone[index].updateMode = true;
            setsyllabusItems(syllabusItemsClone);
          }
        })
        .catch((error) => console.log(error.response))
        }
        else{
            Axios.put(("/"+id), {syllabusTitle:syllabus.syllabusTitle, description:syllabus.description, objectives:syllabus.objectives})
            .then((result)=> {
                if(result.status === 200) {
                  console.log(result.data);
                  syllabusItemsClone[index]=result.data[0];
                  syllabusItemsClone[index].editMode = false;
                  syllabusItemsClone[index].updateMode = true;
                  console.log(syllabusItemsClone[index]);
                  setsyllabusItems(syllabusItemsClone);
                }})
            .catch((error) => console.log(error))
        }
  }
  
  const cancel = index => {
    const syllabusItemsClone = [...syllabusItems];
    if(syllabusItemsClone[index].syllabusTitle === "" && syllabusItemsClone[index].description === "" && syllabusItemsClone[index].objectives === "") {
      syllabusItemsClone.pop();
    }
    else {
      syllabusItemsClone[index].editMode = false;
    }
    setsyllabusItems(syllabusItemsClone);
  }

  const handleEdit = index => {
    const syllabusItemsClone = [...syllabusItems];
    syllabusItemsClone[index].editMode = true;
    setsyllabusItems(syllabusItemsClone);
  }

  const logout = () => {
		history.push("/")
		window.sessionStorage.removeItem("token");
	}
  
  const handleDelete = index => {
    const syllabusItemsClone = [...syllabusItems];
    const id=syllabusItemsClone[index].syllabusId;
    Axios.delete("/"+id)
    .then(result => {
      if(result.status === 204) {
        syllabusItemsClone.splice(index,1);
        setsyllabusItems(syllabusItemsClone);
      }
    })
  }
  
  return (
    <div>
      <button onClick={logout} id="logout">Logout</button>
      <button onClick={DisplayForm} id="syllabusBtn">Add syllabus</button>
      {syllabusItems.map((syllabusItem, index) => {
        return((syllabusItem.editMode === true ? 
          (<SyllabusForm key={`SyllabusForm-${index}`} syllabusData={syllabusItem} index={index} onSave={save} onCancel={cancel}></SyllabusForm>)
          :(<SyllabusCard key={`SyllabusCard-${index}`} syllabusData={syllabusItem} index={index} edit={handleEdit} delete={handleDelete}></SyllabusCard>)))}
      )}
    </div>
    )
  }

  export default Syllabus;