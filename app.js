var express = require('express'); // importo express framework
var mongoose = require('mongoose'); // Driver de Mongo DB
var bodyParser = require('body-parser'); // Nos Parsea eL contenido del Formulario
var app = express(); //asigno express a una variable

mongoose.connect("mongodb://localhost/bike"); //Conexion con la Base De Datos


//Definimos Nuestro Schema
var productosSchema = {

	nombre: String,
	categoria: String,
	precio: Number,
	descripcion: String

};

//Creamos Nuestro Modelo 
var ProductModel = mongoose.model("Product", productosSchema);

app.set("view engine", "jade"); //defino jade como engine de las vistas
app.use(express.static("public")); //definimos mi Ruta Estatica
app.use(bodyParser.json()); //Necesario de Body-Parser
app.use(bodyParser.urlencoded({
	extended: true
})); //Necesario de Body-Parser


app.post("/product", function(require, response) {


	var data = {

		nombre: require.body.nombre,
		categoria: require.body.categoria,
		precio: require.body.precio,
		descripcion: require.body.descripcion
	}

	var prd = new ProductModel(data);

	prd.save(function(err) {
		console.log(prd);
		response.render("index");
	});


});

// ruta para formulario Nuevo Producto Renderizamos vista
app.get("/new", function(require, response) {

	response.render("new");

});

//ruta para el index Renderizamos vista
app.get("/", function(require, response) {

	console.log('corriendo');
	response.render("index");
	//response.end("Ready End");

});

//Puerto de escucha del Server
app.listen(8080);