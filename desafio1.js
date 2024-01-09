/*----------------------------------------------------------------------------------------------------------------- */
/*  CODERHOUSE - CURSO BACKEND - COMISION 50045
/*  DESAFIO: 1: Clases con ECMAScript y ECMAScript avanzado
/*  ALUMNO: Guillermo Guardia
/*  FECHA: 09-01-2024
/*
/*-------------------------------------------------------------------------------------------------------------------*/

class ProductManager {
  static countID = 1; //Contador para siempre tener un ID diferente

  constructor() {
    this.products = [];
  }

  AddProduct = (product) => {
    /* Primero chequeo que no exista otro producto en mi array products que tenga el mismo code que el producto que se esta ingresando.
       Si no existe proceso a ingresar el producto y de lo contrario emito mensaje por consola de que ya existe un producto con dicho codigo.
    */

    if (!this.products.some((item) => item.code == product.code)) {
      /*Le damos un ID y luego incremento ese ID para que me quede listo al venir el siguiente producto.*/
      this.products.push({ ...product, productID: ProductManager.countID });
      console.log(
        "Se Ingreso el producto solicitado con Id: " +
          ProductManager.countID +
          "."
      );
      ProductManager.countID += 1;
    } else {
      console.log("Ya existe el producto con code " + product.code + " !");
    }
  };

  // Devuelve la lista de prdductos.
  getProducts = () => this.products;

  /*
   Devuelve el producto que tiene el ID que se le pasa por parametro. SI existe un producto con ese ID entonces lo retorna, de lo contrario devuelve
   un array vacio y un mensaje por consola que dice 'not found!'.
   
   */
  getProductById = (searchProductID) => {
    if (this.products.some((item) => item.productID == searchProductID)) {
      const searchedProduct = this.products.filter(
        (item) => item.productID == searchProductID
      );
      return searchedProduct[0];
    } else console.log("Product Not found !");
    return [];
  };
}



/* TESTING PROPIO 

//Se creará una instancia de la clase “ProductManager”
const myProductManager = new ProductManager([]);

//Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío [].
console.log(myProductManager.getProducts());

const product1 = { title: "producto prueba",  description: "Este es un producto prueba",  price: 200,  thumbnail: "Sin imagen",
  code: "abc123", stock: 25,}

//Se llamará al método “addProduct” con los campos...(objeto product1).
//El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE.
myProductManager.AddProduct(product1);

//Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado.
console.log(myProductManager.getProducts());

//Se llamará al método “addProduct” con los mismos campos de arriba, debe arrojar un error porque el código estará repetido.
myProductManager.AddProduct(product1);

//Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo
console.log("Busqueda Product by ID  CASO ENCONTRADO: ", myProductManager.getProductById(1));
console.log("Busqueda Product by ID  CASO NO ENCONTRADO: ", myProductManager.getProductById(2));
*/