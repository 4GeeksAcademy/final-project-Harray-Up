import { useState, useRef, useContext, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { Button, Box, Typography } from '@mui/material';
import { useLevelContext } from './Contexts/LevelContext';
import { levelList } from './levels';

function CodeEditor() {
  const { setFruits, setLevel, level } = useLevelContext(); // Obtenemos setFruits del contexto

  const [buttonIsVisible, setButtonIsVisible] = useState(true);

  const [code, setCode] = useState(level.staticCode);
  const [message, setMessage] = useState(''); // Estado para manejar el mensaje
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(0)

  const editorRef = useRef(null);

  function handleEditorWillMount(monaco) {
    // Configuraciones previas si las necesitas
  }
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    const model = editor.getModel();

  }

  function extractStaticLines(Lines, start, end) {
    const staticLines = Lines.filter((_, index) => {
      return index < start || index > end;
    });

    return staticLines;
  }


  useEffect(() => {
    setCode(level.staticCode)
    if (level == levelList[4]){
      setButtonIsVisible(false)
    }else{setButtonIsVisible(true)}
  }, [level])


  useEffect(() => {

    const newLines = code.split('\n');
    const newStartIndex = newLines.findIndex(line => line.includes('// Write your code below this line'));
    const newEndIndex = newLines.findIndex(line => line.includes('// Write your code above this line'));
    setStartIndex(newStartIndex)
    setEndIndex(newEndIndex)

  }, [code]);


  const checkCodeModification = (startIndex, endIndex) => {
    if (startIndex === -1 || endIndex === -1) {
      console.warn("No se encontraron los comentarios delimitadores.");
      return false;
    }

    const newLines = code.split('\n');
    const initialLines = level.staticCode.split('\n');

    const initialStartIndex = initialLines.findIndex(line => line.includes('// Write your code below this line'));
    const initialEndIndex = initialLines.findIndex(line => line.includes('// Write your code above this line'));

    const initialStaticLines = extractStaticLines(initialLines, initialStartIndex, initialEndIndex);
    const currentStaticLines = extractStaticLines(newLines, startIndex, endIndex);


    return initialStaticLines.length === currentStaticLines.length &&
      initialStaticLines.every((val, index) => val === currentStaticLines[index]);
  };


  const handleRun = () => {
    if (!checkCodeModification(startIndex, endIndex)) {
      setMessage("You cannot modify lines outside the marks.");
      return;
    }

    try {
      let output;
      const wrappedCode = `
        ${code}
        
      `;
      eval(wrappedCode); // Execute user code

      if (Array.isArray(output)) {
        setFruits(output); // Update global state if output is an array
      
        if (JSON.stringify(output) === (level.goalArray)) {
          setMessage("Congratulations! You got the correct result.");
        } else {
          setMessage("Keep trying, the array does not match.");
        }
      } else {
        setMessage("Code executed, but 'output' is not an array.");
      }
    } catch (error) {
      setMessage(`Error in the code: ${error.message}`);
    }
  };

  const handleReset = () => {
    setCode(level.staticCode);
    setMessage(''); // Limpiamos el mensaje al resetear el código
  };

  const nextLevel = () => {
    let index = levelList.indexOf(level);
    if (index !== -1 && index < levelList.length - 1) {
      setLevel(levelList[index + 1]);
    }
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Editor
        height="370px"
        theme="vs-dark"
        value={code}
        options={{
          fontSize: "20px"
        }}
        language="javascript"
        beforeMount={handleEditorWillMount}  // Aquí
        onMount={handleEditorDidMount}      // Aquí
        onChange={(value) => setCode(value)} // Mantener el estado del código
      />

      {/* Modificación aquí: los botones alineados a la izquierda */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          gap: 2,
          marginTop: 2,
          marginLeft: 2,
          marginRight: 1,
          alignItems: 'center', // Esto centra el contenido en la caja
          height: '55px' // Para asegurarse de que haya suficiente espacio vertical
        }}
      >
        <Button
          size="large"
          variant="contained"
          onClick={handleRun}
          color="tertiary"
          sx={{
            fontSize: '16px',
            '&:hover': { backgroundColor: '#303f9f' },
          }}
        >
          Run
        </Button>
        <Button
          size="large"
          color="tertiary"
          variant="contained"
          onClick={handleReset}
          sx={{
            fontSize: '16px',
            '&:hover': { backgroundColor: '#d32f2f' },
          }}
        >
          Reset
        </Button>
        { buttonIsVisible &&
          <Button
            size="large"
            color="tertiary"
            variant="contained"
            onClick={nextLevel}
            sx={{
              fontSize: '16px',
              '&:hover': { backgroundColor: '#d32f2f' },
            }}
          >
            Next Level
          </Button>
        }


        {/* Mostrar el mensaje a la derecha de los botones */}
        {message && (
          <Typography
            sx={{
              marginLeft: 2,
              fontSize: '25px',
              color: 'tertiary.main',
              display: 'flex',
              alignItems: 'center' // Centra verticalmente el mensaje
            }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default CodeEditor;
