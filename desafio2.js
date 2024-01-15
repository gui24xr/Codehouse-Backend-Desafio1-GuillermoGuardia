/*----------------------------------------------------------------------------------------------------------------- */
/*  CODERHOUSE - CURSO BACKEND - COMISION 50045
/*  DESAFIO: 2: Clases con ECMAScript y ECMAScript avanzado
/*  ALUMNO: Guillermo Guardia
/*  FECHA: 14-01-2024
/*
/*-------------------------------------------------------------------------------------------------------------------*/

/* Importamos el modulo fs */
const fs = require('fs')

class ProductManager {
    //Contador para siempre tener un ID diferente
    
    constructor(path) {
      this.path= path
      this.products = []
      this.countID = 1 
      /*Al crear la instancia ira a leer el archivo del path y de acuerdo a exista o no... 
       si no existe, lo crea e inicializa con un array vacio, si existe carga la data del archivo en this.products y pone el countID en el ultimo ID que estaba para poder agregar los productos nuevos...*/
      this.init()
    }

    init =  ()=>{
      if (!fs.existsSync(this.path)){
        this.saveProductsInFile('[]') 
        return []
      }
     else{//En este caso lo lei sincronicamente puesto que nuestro programa efectivamente necesita de los datos.
      const fileData = fs.readFileSync(this.path,'utf-8')//await this.readProductsInFile()
      //No solo debo ahora asignar la data a products, tmb debo actualizar el IDcount
      //Teniendo en cuenta en que productManager guarda en orden y sin repetir, leo el ultimo id y le sumo1.
      const productListInFile = JSON.parse(fileData)
      this.countID = productListInFile[productListInFile.length-1].productID + 1
      this.products = productListInFile
     }
       
    }
  
    AddProduct = async (product) => {
      
         if (!this.products.some((item) => item.code == product.code)) {
        /*Le damos un ID y luego incremento ese ID para que me quede listo al venir el siguiente producto.*/
        //this.products.push({productID: ProductManager.countID, ...product })
        this.products = [...this.products,{productID: this.countID, ...product }]
        console.log("Se Ingreso el producto solicitado con Id: " +  this.countID + ".");
        this.countID += 1;
        /*Guardamos el array productos*/
        await this.saveProductsInFile(this.products)
      } else {
        console.log("Ya existe el producto con code " + product.code + " !");
      }
    };
  
    // Devuelve la lista de prdductos.
    getProducts = async () => {
        const productsInFile = await this.readProductsInFile()
        return productsInFile
    }
  
    /*
     Devuelve el producto que tiene el ID que se le pasa por parametro. SI existe un producto con ese ID entonces lo retorna, de lo contrario devuelve
     un array vacio y un mensaje por consola que dice 'not found!'.
     
     */
    getProductById = async (searchProductID) => {
        //Leo el archivo, a diferencia de mi desafio uno levanto los datos del archivo
        try{
            const productsList = await this.readProductsInFile()
            if (productsList.some((item) => item.productID == searchProductID)) {
            const searchedProduct = productsList.find((item) => item.productID == searchProductID)
            return searchedProduct;
            } else {
              throw new Error("Product Not Found")
            }
        } catch(error){
            console.log('Error: ', error.message)
            return null
        }
    };

    async updateProduct(productIdToUpdate,updateItems){
        
        try{
            //Actualizamos en this.products y luego volcamos todo al archivo
            const productIndex = this.products.findIndex(item => item.productID == productIdToUpdate)
            if (productIndex >= 0){
                //Actualizo a this.products con la informacion recibida por parametro y sin borrar ID
                //Pero debo cuidar que de afuera me envien keys que correspondan para no llenar de basura la BD ni modificar productID.
                if (!Object.keys(updateItems).includes('productID')){
                this.products[productIndex] = {...this.products[productIndex],...updateItems}
                //Ingreso la modificacion de this.products al archivo.
                await this.saveProductsInFile(this.products)
                }
                else{
                  throw new Error("No se puede modificar productID !!!")
                }
                 }
        } catch(error){
          console.log('Error: ', error.message)
          return null
        }
        
      
    }

    async deleteProduct(productIdToDelete){
       try{ //Si existe el producto buscado proceso al borrado
        if (this.products.some((item) => item.productID == productIdToDelete)){
          //Lo modifico en this.products, en este caso lo elimino. Busco su index.
          const productIndex = this.products.findIndex(item => item.productID == productIdToDelete)
          //Como ya use el metodo some ya se que existe por lo tanto proceso a su borrado.
          this.products.splice(productIndex,1)
          //console.log('Ahora ', this.products)
          //Actualizo el archivo.
          this.saveProductsInFile(this.products)
        }
        else{
          throw new Error("No existe el producto con el productID ingresado !!!")
        }

       } catch(error){
        console.log('Error: ', error.message)
        return null
       }
 
    }


    async saveProductsInFile(content){
        //Genero el archivo. Ya que siempre antes de guardar pusheo el array entonces puedo pisar tranquilo el archivo.
        try{
            //console.log('Content: ', content)
            const jsonString = JSON.stringify(content, null, 1)
            await fs.promises.writeFile(this.path,jsonString)
        }
        catch(error){
            console.log('Error al guardar el archivo.',error)
        }
    }

    readProductsInFile = async () => {
        try{ //Leo y retorno la respuesta de la lectura asincrona del archivo.
            const fileContent = await fs.promises.readFile(this.path,"utf-8")
            return JSON.parse(fileContent)
        }
        catch(error){
            console.log('Error al leer el archivo.',error)
        }
    }

  }
  
  
/*- TESTING   -----------------------------------------------------------------------------------------------------------------*/
  /* OBJETOS PARA UTILIZAR EN EL TESTING*/
  const product1 = { title: "producto prueba1",  description: "Este es un producto prueba1",  price: 2001,  thumbnail: "Sin imagen",
  code: "abc12311", stock: 251,}

  const product2 = { title: "producto prueba2",  description: "Este es un producto prueba2",  price: 2002,  thumbnail: "Sin imagen",
  code: "abc12322", stock: 252,}

  const product3 = { title: "producto prueba3",  description: "Este es un producto prueba3",  price: 2003,  thumbnail: "Sin imagen",
  code: "abc12333", stock: 253,}

  const product4 = { title: "producto prueba4",  description: "Este es un producto prueba4",  price: 2004,  thumbnail: "Sin imagen",
  code: "abc12334", stock: 253,}

  const product1Updated = { title: "producto prueba1Updates",  description: "Este es un producto prueba1Updated",  price: 2001,  thumbnail: "Sin imagen",
  code: "abc12311", stock: 251,}

  
  //Funciones auxiliares
  const testSeparatorLine = (oneString) => {
    const quantityAsteriscs = process.stdout.columns - oneString.length - 120
    console.log('\x1b[36m','\n\n** ' + oneString + ' ' + '*'.repeat(quantityAsteriscs)+'\n','\x1b[0m')
  }
  
  /* TESTING PROPIO */

  //Se creará una instancia de la clase “ProductManager”
  const pathFile = './archivoproducts.json'
  const myProductManager = new ProductManager(pathFile);

  
  async function myTest(){

  //Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
    testSeparatorLine('Test getProducts aray vacio.')
    let response = await myProductManager.getProducts()
    console.log(response)

    //Se llamará al método “addProduct” con los campos.. (objeto product1)
    //El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
    testSeparatorLine('Test addProduct')
    await myProductManager.AddProduct(product1) //OK!
    await myProductManager.AddProduct(product2) //OK!
    await myProductManager.AddProduct(product2) //OK!
    await myProductManager.AddProduct(product3) //OK! 
    await myProductManager.AddProduct(product4) //OK!

  //Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
  testSeparatorLine('Test getProducts con productos agregados.')
  response = await myProductManager.getProducts()
  console.log(response) //OK!

  //Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.
  testSeparatorLine('Test getProductByID con producto existente.')
  response = await myProductManager.getProductById(1)
  console.log(response) //OK!
  response = await myProductManager.getProductById(2)
  console.log(response) //OK!

  testSeparatorLine('Test getProductByID con producto no existente.')
  response = await myProductManager.getProductById(23)
  console.log(response) //OK!

  //Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.
  testSeparatorLine('Test update por el campo title pero intentando modificar el ID.')
  await myProductManager.updateProduct(1,{title:'Titulo Actualizado !!',productID:23}) //OK!

  testSeparatorLine('Test update por el campo title.')
  await myProductManager.updateProduct(1,{title:'Titulo Actualizado !!',price:252}) //OK!


  testSeparatorLine('Test update por el campo title.')
  await myProductManager.updateProduct(2,{title:'Titulo Actualizado 2 !!',stock:255}) //OK!

  //Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
  testSeparatorLine('Test deleteProduct con producto no existente.')
  await myProductManager.deleteProduct(23)//OK!

  testSeparatorLine('Test deleteProduct con producto existente.')
  await myProductManager.deleteProduct(2)//OK!

}

//Ejecuto el test.
myTest()

