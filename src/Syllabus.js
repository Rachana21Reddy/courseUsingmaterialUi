import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import Axios from './Header';
import { TextField, Button, Card, CardActions, Chip }from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

const objectivesList = [];
const SyllabusForm = props => {
  const [syllabusTitle, setTitle] = useState(props.syllabusData.syllabusTitle);
  const [description, setDescription] = useState(props.syllabusData.description);
  const [objectives, setObjectives] = useState([...objectivesList,props.syllabusData.objectives]);
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [objectivesError, setObjectivesError] = useState(false);

  const handleChange = event => {
    if(event.target.name === "syllabusTitle") setTitle(event.target.value);
    if(event.target.name === "description") setDescription(event.target.value);
    if(event.target.name === "objectives") {
      setObjectives(
        ...objectivesList,
        event.target.value
      );
    }
  }

  const syllabus={
    "syllabusTitle":syllabusTitle,
    "description":description,
    "objectives":objectives
  };

  const handleSave = () =>{
    setTitleError(false);
    setDescriptionError(false);
    setObjectivesError(false);
    if(syllabusTitle === "") {
      setTitleError(true);
    }
    if(description === "") {
      setDescriptionError(true);
    }
    if(objectives === "") {
      setObjectivesError(true);
    }
    const index = props.index;
    const updateMode = props.syllabusData.updateMode;
    props.onSave(index, syllabus, updateMode); 
  }
  const handleCancel = () => props.onCancel(props.index);

  return(
    <>
    <br></br>
    <TextField required id="outlined-basic" name="syllabusTitle" label="syllabusTitle" variant="outlined"  value={syllabusTitle}  onChange={handleChange} error={titleError} helperText={titleError === true ? "Title is Required" : " "} fullWidth />
    <TextField required id="outlined-basic" name="description" label="description" variant="outlined" value={description} onChange={handleChange}  error={descriptionError} helperText={descriptionError === true ? "Description is Required" : " "} fullWidth/>
    <Autocomplete
        multiple
        id="tags-filled"
        options={objectivesList.map((option) => option)}
        defaultValue={objectives}
        onChange={handleChange}
        freeSolo
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              label={option}
              {...getTagProps({ index })}
            />
          ))
        }
        // multiple
        // id="tags-filled"
        // options={objectivesList.map((option) => option)}
        // defaultValue={objectives}
        // freeSolo
        // renderTags={(value, getTagProps) =>
        //   value.map((option, index) => (
        //     <Chip
        //       variant="outlined"
        //       label={option}
        //       {...getTagProps({ index })}
        //     />
        //   ))
        // }
      renderInput={(params) => (<TextField {...params} required id="outlined-basic" name="objectives" label="objectives" error={objectivesError} helperText={objectivesError === true ? "Objectives Required" : " "} value={params.value} variant="outlined" fullWidth />)}
    />
    <Button variant="outlined" color="primary" onClick={handleSave} id="save">Save</Button>
    <Button variant="outlined" color="primary" onClick={handleCancel} id="cancel">Cancel</Button>
    </>
  );  
}

const SyllabusCard = props => {
  const editsyllabus = () => props.edit(props.index);
  const deletesyllabus = () => props.delete(props.index);
  return (
      <Card id="card" variant="outlined">
        <br></br><label id="index"><strong>{props.index+1}</strong></label><br></br>
        <label>syllabusTitle:{props.syllabusData.syllabusTitle}</label><br></br>
        <label>Description:{props.syllabusData.description}</label><br></br>
        <label>objectives:{props.syllabusData.objectives}</label><br></br>
      <CardActions id="action">
        <Button onClick={editsyllabus} id="edit" variant="outlined"  color="primary">Edit</Button>
        <Button onClick={deletesyllabus} id="delete" variant="outlined"  color="primary">Delete</Button>
      </CardActions>
    </Card>
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
      objectives: [],
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
        Axios.post("http://localhost:4000/api/syllabus",
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
      <Button onClick={logout} id="logout" variant="outlined"  color="primary">Logout</Button>
      <Button onClick={DisplayForm} id="syllabusBtn" variant="outlined"  color="primary">Add syllabus</Button>
      <br></br>
      <br></br>
      {syllabusItems.map((syllabusItem, index) => {
        return((syllabusItem.editMode === true ? 
          (<SyllabusForm key={`SyllabusForm-${index}`} syllabusData={syllabusItem} index={index} onSave={save} onCancel={cancel}></SyllabusForm>)
          :(<SyllabusCard key={`SyllabusCard-${index}`} syllabusData={syllabusItem} index={index} edit={handleEdit} delete={handleDelete}></SyllabusCard>)))}
      )}
    </div>
    )
  }

  export default Syllabus;