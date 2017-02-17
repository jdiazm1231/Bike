var express = require('express'); // importo express framework
var mongoose = require('mongoose'); // Driver de Mongo DB
var bodyParser = require('body-parser'); // Nos Parsea eL contenido del Formulario
var multer = require('multer'); // multer es para poder subir archivos al server se manera facil
var app = express(); //asigno express a una variable
var override = require('method-override');
mongoose.connect("mongodb://localhost/bike"); //Conexion con la Base De Datos


//Definimos Nuestro Schema
var productosSchema = {

	nombre: String,
	categoria: String,
	precio: Number,
	descripcion: String,
	img: String

};

//Creamos Nuestro Modelo
var ProductModel = mongoose.model("Product", productosSchema);

app.set("view engine", "jade"); //defino jade como engine de las vistas
app.use(express.static("public")); //definimos mi Ruta Estatica
app.use(bodyParser.json()); //Necesario de Body-Parser
app.use(override("_method"));
app.use(bodyParser.urlencoded({
	extended: true
})); //Necesario de Body-Parser
app.use(multer({
	dest: 'public/uploads/'
}).single('inputFileName'));


//Creamos Ruta para mostrar todos los productos actuales
app.get("/admin", function(require, response) {

	ProductModel.find(function(err, productos) {

		if (err) {
			console.log(err);
		}
		response.render("admin", {
			products: productos
		});

	});
});

//Traemos todos los Datos  de un producto y renderizamos para proceder a  Modificar
app.get("/admin/edit/:id", function(require, response) {

	var product_id = require.params.id;
	ProductModel.findOne({
		"_id": product_id
	}, function(err, productos) {

		if (err) {
			console.log("ERROR EN BUSQUEDA  PRODUCTO : " + err)
		} else {

			response.render("edit", {
				products: productos
			});
		}
	})

});

//Actualizamos el producto que antes le habiamos rellenado los Datos
app.put("/admin/:id", function(require, response) {

	if (require.file) {
		var data = {

			nombre: require.body.nombre,
			categoria: require.body.categoria,
			precio: require.body.precio,
			descripcion: require.body.descripcion,
			img: require.file.filename
		}
	} else {
		var data = {

			nombre: require.body.nombre,
			categoria: require.body.categoria,
			precio: require.body.precio,
			descripcion: require.body.descripcion,
			img: 'default.jpg'
		}
	}

	ProductModel.update({
		"_id": require.params.id
	}, data, function(producto) {

		response.redirect("/product");

	});

});

/*Eliminamos un producto dependiendo el id que tengamos estamos haciendolo por metodo .get lo conveniente es
 hacerlo por metodo .delete */
app.get("/delete/:id", function(require, response) {

	ProductModel.remove({
		"_id": require.params.id
	}, function(err) {

		if (err) {
			console.log("Error Al eliminar Producto" + err)
		} else {

			response.redirect("/admin");
		}

	});

});

//Guardamos el producto subiendo la imagen  pero antes tenemos que crear el modelo de mongodb
app.post("/product", function(require, response) {

	if (require.file) {
		var data = {

			nombre: require.body.nombre,
			categoria: require.body.categoria,
			precio: require.body.precio,
			descripcion: require.body.descripcion,
			img: require.file.filename
		}
	} else {
		var data = {

			nombre: require.body.nombre,
			categoria: require.body.categoria,
			precio: require.body.precio,
			descripcion: require.body.descripcion,
			img: 'default.jpg'
		}
	}

	var prd = new ProductModel(data);
	console.log(require.file);

	prd.save(function(err) {
		console.log(prd);
		response.redirect("/product");
	});


});

// ruta para formulario Nuevo Producto Renderizamos vista
app.get("/new", function(require, response) {

	response.render("new");

});

// Listamos Todos los Productos EXistentes solo como visualizacion
app.get("/product", function(require, response) {

	ProductModel.find(function(err, productos) {

		if (err) {
			console.log(err);
		}
		response.render("productos", {
			products: productos
		});

	});
});

//ruta para el index Renderizamos vista
app.get("/", function(require, response) {

	console.log('corriendo');
	response.render("index");
	//response.end("Ready End");

});

//Puerto de escucha del Server
app.listen(8080);