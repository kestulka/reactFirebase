// React, mui
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
  Divider,
  FormControl,
} from "@mui/material";
// -------------------------------------

// Firebase stuff
import db from "../firebase_config"; // Import Firestore instance directly
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
// -------------------------------------

const Form = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    // fetch data @ https://firebase.google.com/docs/firestore/query-data/get-data
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "formData")); // pavadinima galim keisti, taciau reikia keisti ir line 48, 60
      if (!querySnapshot.empty) {
        // Butina prachekinti pries naudojant for each
        const data = [];
        querySnapshot.forEach((document) => {
          data.push(document.data());
        });
        setFormData(data);
      } else {
        console.log("No documents found");
      }
    };
    fetchData();

    // real time updates @ https://firebase.google.com/docs/firestore/query-data/listen
    onSnapshot(collection(db, "formData"), (snapshot) => {
      const newFormData = [];
      snapshot.forEach((doc) => {
        newFormData.push(doc.data());
      });
      setFormData(newFormData);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "formData"), {
      name,
      email,
      question,
      timestamp: serverTimestamp(),
    });

    setName("");
    setEmail("");
    setQuestion("");
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{
        height: "100vh",
        backgroundImage: "url('https://fergusfrl.com/images/firebase.png')",
        backgroundSize: "cover",
      }}
    >
      <Grid
        item
        xs={12}
        md={6}
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.55)",
          padding: "30px",
          borderRadius: "10px",
        }}
      >
        <FormControl fullWidth component="form" onSubmit={handleSubmit}>
          <TextField
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            InputProps={{ inputProps: { type: "text" } }}
            required
          />
          <TextField
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            InputProps={{ inputProps: { type: "email" } }}
            required
          />
          <TextField
            label="Question"
            variant="outlined"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            multiline
            fullWidth
            margin="normal"
            InputProps={{ inputProps: { type: "text" } }}
            required
          />
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Send
          </Button>
        </FormControl>
        <Divider
          style={{
            marginTop: "40px",
            marginBottom: "20px",
            backgroundColor: "black",
            height: "2px",
          }}
        />
        <Typography variant="h4" align="center">
          Client Questions:
        </Typography>
        <List>
          {/* renderinam irasus is db i forma */}
          {formData.map((data, index) => (
            <ListItem
              key={index}
              style={{
                border: "1px solid black",
                borderRadius: "5px",
                marginBottom: "5px",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <ListItemText secondary="Client Name:" />
                </Grid>
                <Grid item xs={3}>
                  <ListItemText primary={data.name} />
                </Grid>
                <Grid item xs={3}>
                  <ListItemText secondary="Client question:" />
                </Grid>
                <Grid item xs={3}>
                  <ListItemText
                    primary={data.question}
                    style={{ wordWrap: "break-word" }} // sutvarko kad ilgas tekstas neisseitu is formos ribu
                  />
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
};
export default Form;
