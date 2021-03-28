let express         = require('express'),
    session         = require('express-session'),
    cookieParser    = require('cookie-parser'),
    fileUpload      = require('express-fileupload'),
    bodyParser      = require('body-parser'), //pour récupérer les résultats des post
    http            = require('http'),
    path            = require('path');

let app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('port', 6900);
app.set('views', path.join(__dirname, '/views'));

// routes static, le routeur n'y aura pas accès
app.use(express.static(path.join(__dirname, '../common')));

// Enable file upload using express-fileupload
app.use(fileUpload({
    createParentPath: true
}));

app.use(cookieParser());

app.use(session({
    secret: 'nC0@#1pM/-0qA1+é',
    name: 'VipNodeAdmin',
    resave: true,
    saveUninitialized: true
}));

/* ces lignes permettent d'utiliser directement les variables de session dans handlebars
 UTILISATION : {{session.MaVariable}}  */
app.use((request, response, next) => {
    response.locals.session = request.session;
    next();
});

let exphbs = require('express-handlebars');
app.set('view engine', 'handlebars'); //nom de l'extension des fichiers
let handlebars  = require('./helpers/handlebars.js')(exphbs); //emplacement des helpers
// helpers : extensions d'handlebars

app.engine('handlebars', handlebars.engine);


// chargement du routeur
require('./router/router')(app);


http.createServer(app).listen(app.get('port'), () => {
    console.log('Serveur Node.js admin en attente sur le port ' + app.get('port') + ' http://localhost:' + app.get('port'));
});
