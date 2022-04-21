import "./App.css";
import { FormControl, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const Input = styled("input")({
  display: "none",
});

function App() {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState("");

  const getPrediction = () => {
    let formData = new FormData();
    formData.append("file", file);
    axios
      .post("http://localhost:5000/image", formData)
      .then((res) => {
        console.log(res.data);
        setResultUrl(res.data.image_url);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setResultUrl("");
  }, [fileName]);

  return (
    <div className="App">
      <div className="header">
        <h1>Whisk(e)y Classifier</h1>
      </div>
      <div className="app-body">
        <FormControl
          sx={{
            m: 1,
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <label htmlFor="contained-button-file">
            <Input
              id="contained-button-file"
              multiple
              type="file"
              accept="image/*"
              onChange={(e) => {
                setFileName(e.target.value.substring(12));
                setFile(e.target.files[0]);
              }}
            />
            <Button
              variant="contained"
              component="span"
              color="primary"
              size="medium"
            >
              Choose Image
            </Button>
          </label>
        </FormControl>
        {file ? (
          <>
            <h3>Images chosen: {fileName}</h3>
            <FormControl
              margin="normal"
              sx={{
                m: 1,
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-around",
                width: "40%",
              }}
            >
              <Button
                variant="contained"
                component="span"
                color="primary"
                size="medium"
                disabled={loading}
                onClick={() => {
                  setLoading(true);
                  getPrediction();
                }}
              >
                Get Prediction
              </Button>
              <Button
                variant="contained"
                component="span"
                color="primary"
                size="medium"
                disabled={resultUrl === ""}
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = resultUrl;
                  document.body.appendChild(link);

                  // Start download
                  link.click();
                  link.parentNode.removeChild(link);
                }}
              >
                download
              </Button>
            </FormControl>
          </>
        ) : (
          <h3 className="file-warning">Please choose an image!</h3>
        )}
        {loading ? (
          <Oval height="100" width="100" color="green" ariaLabel="loading" />
        ) : null}
        {resultUrl !== "" ? (
          <>
            <img className="result-img" src={resultUrl} alt="result" />
          </>
        ) : null}
      </div>
    </div>
  );
}

export default App;
