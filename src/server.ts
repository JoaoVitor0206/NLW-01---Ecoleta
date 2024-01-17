import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';

const app = express();

app.use(cors()); // permite que qualquer aplicação acesse a API
app.use(express.json());
app.use(routes);

app.use("/uploads", express.static(path.resolve(__dirname, '..', 'uploads'))); // rota para acessar arquivos estáticos (imagens) (http://localhost:3333/uploads/imagename.jpg)

app.listen(3333);