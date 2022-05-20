const express = require("express");
const bodyParser = require('body-parser');
const { use } = require("express/lib/application");
const app = express();
const cors = require('cors');
const nodemailer = require('nodemailer');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/'));
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './views');

var usuarios = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/cadastro.html');
});

app.post('/', (req,res) => {
    if(!validateRegister(req.body.nome,usuarios.length)){
        usuarios.push({nome: req.body.nome, senha: req.body.pass});
        return res.redirect('login');
    } else{
        return res.status(500).render("register-err");
    }
    
})

app.get('/login', (req,res) => {
    res.sendFile(__dirname + '/public/login.html');
})

function validateRegister(name,tam){
    try{
        if(usuarios != undefined && usuarios != null){
            for(i=0;i<tam;i++){
                if(name == usuarios[i].nome){
                    return true;
                }
            }
        }
        return false;
    } catch (err){
        console.log(err);
    }   
}

function validateUser(name,pass,tam){
    try{
        if(usuarios != undefined && usuarios != null){
            for(i=0;i<tam;i++){
                if(name == usuarios[i].nome && pass == usuarios[i].senha){
                    return true;
                }
            }
        }
        return false;
    } catch (err){
        console.log(err);
    }   
}

app.post('/login', (req,res) => {
    let name = req.body.nome;
    let pass = req.body.pass;
    let tam = usuarios.length;
    if(validateUser(name,pass,tam)) {
        return res.redirect("/logado");
    }else{
        return res.status(500).render("login-err");
    }
})
    

app.get('/logado', (req,res) => {
    let users = usuarios;
    res.render("home-email", {usuario: users});
})

app.post('/sendmail', (req,res) => {
    let dest = req.body.to;
    let subject = req.body.subject;
    let text = req.body.mytext;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'projectpucc@gmail.com',
          pass: 'zgdvwzmcstvnxrbn'
        }
    });

    var mailOptions = {
        from: 'projectpucc@gmail.com',
        to: dest,
        subject: subject,
        text: text
    };
      
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        return res.status(500).render("home-email-err");
    } else {
        return res.status(500).render("home-email-sucess");
    }
    }); 
    
})


const port = process.env.PORT || 3000;
app.listen(port);