const pool = require("../db.js");
const client = require("../Redis/client.js");
const DEFAULT_EXP = 3600;

module.exports.createProduct = async function createProduct(req, res) {
    try {
        let {
            name,
            price,
            countInStock,
            details,
            category,
            rating
        } = req.body;

        let matchedProd = await pool.query(
            "select * from product_table where name = $1 and category = $2 and price = $3",
            [name, category, price]
        );
        // console.log(matchedProd.rows[0].countinstock);

        let updatedProd;

        // same product exists - we just need to increment the value of the variable named "countInStocks".
        if(matchedProd.rows.length > 0)
        {
            updatedProd = await pool.query(
                "update product_table set countInStock = $1 where name = $2 and category = $3 and price = $4 returning *",
                [countInStock+matchedProd.rows[0].countinstock, name, category, price]
            );
        }
        else 
        {
            // creating a wholesome new product
            updatedProd = await pool.query(
                "insert into product_table (name, price, countInStock, details, category, rating) values ($1, $2, $3, $4, $5, $6) returning *",
                [
                    name,
                    price,
                    countInStock,
                    details,
                    category,
                    rating
                ]
            );
        }

        let product_id = updatedProd.rows[0].product_id;

        await client.set(`product_details_id=${product_id}`, JSON.stringify(updatedProd.rows[0]));

        await client.expire(`product_details_id=${product_id}`, DEFAULT_EXP);

        let allProducts = await pool.query(
            "select * from product_table"
        );

        await client.set("All_products_details", JSON.stringify(allProducts.rows));

        await client.expire("All_products_details", DEFAULT_EXP);

        return res.status(200).json({
            message: "Product created!",
            product_Details : updatedProd.rows[0]
        })

    } catch (error) {
        console.log(error);
    }
}

module.exports.getAllProducts = async function getAllProducts(req, res){
    try {
        let cachedData = await client.get("All_products_details");
        if(cachedData){
            return res.status(200).json({
                message: "All products details",
                product_Details : JSON.parse(cachedData)
            });
        }

        let products = await pool.query(
            "select * from product_table"
        );

        let productsInfo = products.rows;
        await client.set("All_products_details", JSON.stringify(productsInfo));
        await client.expire("All_products_details", DEFAULT_EXP);
        return res.status(200).json({
            message: "All products details",
            product_Details : productsInfo
        });
    } catch (error) {
        console.log(error.message);
    }
}

module.exports.getProduct = async function getProduct(req, res){
    try {
        let product_id = req.params.id;

        let cachedData = await client.get(`product_details_id=${product_id}`);
        if(cachedData){
            return res.status(200).json({
                message : "Product details",
                productDetails : JSON.parse(cachedData)
            });
        }

        let productDetails = await pool.query(
            "select * from product_table where product_id = $1",
            [product_id]
        );

        await client.set(`product_details_id=${product_id}`, JSON.stringify(productDetails.rows[0]));
        await client.expire(`product_details_id=${product_id}`, DEFAULT_EXP);
        return res.status(200).json({
            message : "Product details",
            productDetails : productDetails.rows[0]
        });
    } catch (error) {
        console.log(error.message);
    }
}

module.exports.similarProducts = async function similarProducts(req, res){
    try {
        let product_id = req.params.id;
        let cachedData = await client.get(`product_details_id=${product_id}`);
        let prod_category;
        if(cachedData){
            prod_category = cachedData.category;
        }
        let product = await pool.query(
            "select * from product_table where product_id = $1",
            [product_id]
        );
        prod_category = product.rows[0].category;

        let similarProduct = await pool.query(
            "select * from product_table where category = $1",
            [prod_category]
        );

        return res.status(200).json({
            message : "All similar products",
            similar_products : similarProduct.rows
        });
    } catch (error) {
        console.log(error.message);
    }
}

module.exports.updateProduct = async function updateProduct(req, res){
    try {
        let product_id = req.params.id;
        let dataToBeUpdated = req.body;
        /*

        name : Prod-69,
        price : 600,
        category : Clothing

        update product_table set name = $2, price = $3, category = $4 where product_id = $1
        */

        let arrayQuery = [], arrayValues = [];
        arrayValues.push(product_id);
        let count = 2;
        for(let key in dataToBeUpdated)
        {
            arrayQuery.push(`${key} = $${count}`);
            arrayValues.push(dataToBeUpdated[key]);
            count++;
        }

        let query = `update product_table set ${arrayQuery.join(", ")} where product_id = $1 returning *`;
        let updatedProd = await pool.query(query, arrayValues);
        let prod = updatedProd.rows[0];
        await client.set(`product_details_id=${product_id}`, JSON.stringify(prod));
        await client.expire(`product_details_id=${product_id}`, DEFAULT_EXP);
        let allProducts = await pool.query(
            "select * from product_table"
        );
        await client.set("All_products_details", JSON.stringify(allProducts.rows));
        await client.expire("All_products_details", DEFAULT_EXP);
        return res.status(200).json({
            message : "Product details updated",
            product_Details : prod
        });
    } catch (error) {
        console.log(error.message);
    }
}

module.exports.deleteProduct = async function deleteProduct(req, res){
    try {
        let product_id = req.params.id;
        await pool.query(
            "delete from product_table where product_id = $1",
            [product_id]
        );

        await client.del(`product_details_id=${product_id}`, (error, reply) => {
            if(error)
                console.log("Error deleting the product from redis!");
            else
                console.log("Product deleted from redis");
        })

        let allProducts = await pool.query(
            "select * from product_table"
        );
        await client.set("All_products_details", JSON.stringify(allProducts.rows));
        await client.expire("All_products_details", DEFAULT_EXP);

        res.send("Product deleted successfully!");
        
    } catch (error) {
        console.log(error.message);
    }
}