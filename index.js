const express = require('express');
const app = express();        
const handlebars = require("express-handlebars");
const bodyParser = require('body-parser');
const port = 3009; 
const sql = require('mssql');
const connStr = "Server=Servidor;Database=database;User Id=usuario;Password=senha;";

app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.engine('handlebars', handlebars({
    defaultLayout: 'main',

}))

//fazendo a conexão global
sql.connect(connStr)
   .then(conn => GLOBAL.conn = conn)
   .catch(err => console.log(err));

//configurando o body parser 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());   

//definindo as rotas
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.use('/', router);

//inicia o servidor
app.listen(port);
console.log('API funcionando!');

function execSQLQuery(sqlQry, res){
    GLOBAL.conn.request()
              .query(sqlQry)
              //.then(result => res.json(result.recordset))
              .then(result => res.send('Arquivo gerado com sucesso!'))
              .catch(err => res.send(err));
}
// Chamando a procedure SQL
router.post('/api_teste', (req, res) =>{
    execSQLQuery('dbo.ExportaArquivosREF', res)
})

app.get('/api', function(req, res){
    res.render('processar')
});