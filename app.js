var express = require('express'); // importo express framework
var mongoose = require('mongoose'); // Driver de Mongo DB
var bodyParser = require('body-parser'); // Nos Parsea eL contenido del Formulario
var multer = require('multer');
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

app.put("/admin/:id", function(require, response) {

	var data = {

		nombre: require.body.nombre,
		categoria: require.body.categoria,
		precio: require.body.precio,
		descripcion: require.body.descripcion,
		//img: require.file.path
	}

	ProductModel.update({
		"_id": require.params.id
	}, data, function(producto) {

		response.redirect("/product");

	});

});

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

app.post("/product", function(require, response) {


	var data = {

		nombre: require.body.nombre,
		categoria: require.body.categoria,
		precio: require.body.precio,
		descripcion: require.body.descripcion,
		img: require.file.filename
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

app.get("/product", function(require, response) {

		ProductModel.find(function(err, productos) {

			if (err) {
				console.log(err);
			}
			response.render("productos", {
				products: productos
			});

		});
	})
	//ruta para el index Renderizamos vista
app.get("/", function(require, response) {

	console.log('corriendo');
	response.render("index");
	//response.end("Ready End");

});

//Puerto de escucha del Server
app.listen(8080);