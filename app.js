var express = require('express'); // importo express framework
var mongoose = require('mongoose'); // Driver de Mongo DB
var app = express(); //asigno express a una variable

mongoose.connect("mongodb://localhost/bike");//Conexion con la Base De Datos

//Definimos Nuestro Schema

var productosSchema = {

	nombre : String,
	categoria : String,
	precio : Number

};

//Creamos Nuestro Modelo 
var ProductModel = mongoose.model("Product",productosSchema);

/*
var data = {

	nombre: "Zapatillas Ruta",
	categoria: "Ruta",
	precio: 120000
}

var prd = new ProductModel(data);

prd.save(function(err){
	console.log(prd);
})
*/

app.set("view engine","jade"); //defino jade como engine de las vistas
app.use(express.static("public"));//deifinimos mi Ruta Estatica

app.get("/",function(require,response){

	console.log('corriendo');
	response.render("index");
	//response.end("Ready End");

});

app.listen(8080);