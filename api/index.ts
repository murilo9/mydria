//require("dotenv-safe").config();
import app from "./App";

const port = process.env.PORT || 8888;
 
/* Inicia o servidor */

app.listen(port, () => { 
  console.log('Servidor iniciado na porta ' + port); 
}); 