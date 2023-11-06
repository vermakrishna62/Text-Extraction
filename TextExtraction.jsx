import React, { useState } from "react";

import {
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  ThemeProvider,
  CircularProgress,
} from "@mui/material";

import { Fade } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";

import {
  CloudUpload as CloudUploadIcon,
  Description,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { createTheme, useTheme } from "@mui/material/styles";

import axios from "axios";

const theme = createTheme();

const TextExtraction = () => {
  const currentTheme = useTheme();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [imgfile, setImgfile] = useState("");

  const [showResetButton, setShowResetButton] = useState(false);

  const handleReset = (e) => {
    // Reset all relevant state variables here
    setText("");
    setLoading(false);
    setFile(null);
    setImgfile("");
    setShowResetButton(false);

    window.location.reload();
  };

  const handleFileChange = async (e) => {
    e.preventDefault();
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    // console.log(selectedFile);
    setLoading(true);

    // axios.post("http://127.0.0.1:8000/api/extraction/");

    await axios
      .post(
        "http://127.0.0.1:8000/api/extraction/",
        { text_img: selectedFile },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        // console.log(res.data["img_fig"]["text_img"]);

        const path = "http://127.0.0.1:8000" + res.data["img_fig"]["text_img"];
        console.log(path);

        // const updatedPath = imgfile.replace(
        //   "localhost:5173/",
        //   "localhost:5173/api/"
        // );
        // setImgfile(updatedPath);

        const text_data = res.data["data"];
        const modifiedText = text_data.replace(/\n/g, ". ");

        setText(modifiedText);
        setImgfile(path);

        setShowResetButton(true);
      })
      .catch((error) => {
        console.log(error);
      });

    setTimeout(() => {
      setLoading(false);
      //   setText("This is the extracted text from the uploaded file.");
    }, 3000);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container style={{ marginTop: currentTheme.spacing(10) }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Paper style={{ padding: currentTheme.spacing(3) }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: currentTheme.spacing(2),
              }}
            >
              <Typography
                variant="h3"
                color="primary"
                style={{
                  flex: 1,
                  fontFamily: "cursive", // Replace with your preferred font family
                  display: "flex",
                  alignItems: "center",
                  fontSize: "24px",
                  fontWeight: 700,
                  //   color: "steelblue", // Custom text color (e.g., orange)
                  //   textShadow: "1px 1px 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                <DescriptionIcon />
                &nbsp;Online Text Extractor
              </Typography>

              <label htmlFor="upload-file">
                <input
                  type="file"
                  accept=".pdf, .jpg, .png, .jpeg, .gif"
                  style={{ display: "none" }}
                  id="upload-file"
                  onChange={handleFileChange}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload File
                </Button>
              </label>
            </div>

            {imgfile.length > 0 ? (
              <Container
                sx={{
                  mt: 6,
                  mb: 4,
                }}
              >
                <Paper
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={imgfile}
                    alt="Description of your image"
                    style={{ width: "50%", height: "auto" }}
                  />
                </Paper>
              </Container>
            ) : (
              ""
            )}

            {loading ? (
              <div
                style={{
                  marginTop: currentTheme.spacing(5),
                  textAlign: "center",
                  mb: 2,
                }}
              >
                <CircularProgress color="success" />
              </div>
            ) : (
              <Grid
                container
                sx={{ my: 3 }}
                spacing={3}
                style={{ marginBottom: currentTheme.spacing(2) }}
              >
                <Grid item xs={12}>
                  <TextField
                    label="Extracted Text"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={6}
                    value={text}
                    readOnly
                  />
                </Grid>
              </Grid>
            )}

            <Fade in={showResetButton}>
              <div style={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleReset}
                  startIcon={<RestoreIcon />}
                  sx={{ transition: "opacity 0.5s", px: 3, py: 1, mt: 2 }}
                >
                  Reset
                </Button>
              </div>
            </Fade>
          </Paper>
        </motion.div>
      </Container>
    </ThemeProvider>
  );
};

export default TextExtraction;
