const pool = require('../db.js');
const client = require('../redis/client.js');
const DEFAULT_EXP = 3600;

module.exports.getAllCustomers = async function getAllCustomers(req, res){
    try {
        let cachedData = await client.get("All_customers_data");
        if(cachedData)
        {
            res.status(200).json({
                message: "All customers data",
                Customer_data : JSON.parse(cachedData)
            })
        }

        let customers = await pool.query(
            "select * from customer_table"
        );

        await client.set("All_customers_data", JSON.stringify(customers.rows));
        await client.expire("All_customers_data", DEFAULT_EXP);

        res.status(200).json({
            message: "All customers data",
            Customer_data : customers.rows
        })
    } catch (error) {
        console.log(error.message);
    }
}

module.exports.getCustomer = async function getCustomer(req, res){
    try {
        let id = req.id;
        // console.log(req.id, req.email);
        let cachedData = await client.get(`customer_Details_id=${id}`);
        if(cachedData)
        {
            return res.status(200).json({
                message: "Customer details fetched",
                customerDetails : JSON.parse(cachedData)
            })
        }

        let customer = await pool.query(
            "select * from customer_table where customer_id = $1",
            [id]
        );
        let data = customer.rows[0];
        await client.set(`customer_Details_id=${id}`, JSON.stringify(data));
        await client.expire(`customer_Details_id=${id}`, DEFAULT_EXP);
        return res.status(200).json({
            message: "Customer details fetched",
            customerDetails : customer.rows[0]
        })
    } catch (error) {
        console.log(error.message);
    }
}

module.exports.updateCustomer = async function updateCustomer(req, res){
    try {
        let id = req.id;
        let dataToBeUpdated = req.body;
        let count = 2;
        let arrayQuery = [], arrayValues = [];
        arrayValues.push(id);
        for(let key in dataToBeUpdated)
        {
            arrayQuery.push(`${key} = $${count}`);
            arrayValues.push(dataToBeUpdated[key]);
            count++;
        }

        let query = `UPDATE customer_table SET ${arrayQuery.join(", ")} where customer_id = $1 returning *`;
        let customerData = await pool.query(query, arrayValues);

        await client.set(`customer_Details_id=${id}`, JSON.stringify(customerData.rows[0]));
        await client.expire(`customer_Details_id=${id}`, DEFAULT_EXP);

        return res.status(200).json({
            message: "Updated customer info",
            customerData : customerData.rows[0]
        });
    } catch (error) {
        console.log(error.message);
    }
}

module.exports.deleteCustomer = async function deleteCustomer(req, res){
    try {
        let id = req.id;
        res.cookie('refreshToken', ' ', {maxAge : 1});
        await pool.query(
            "delete from customer_table where customer_id = $1",
            [id]
        );
    
        await client.del(`customer_Details_id=${id}`, (error, reply) => {
            if(err)
                console.log("Error deleting the client info from redis");
            else 
                console.log("key deleted from redis: " + id);
        });
    
        res.status(200).send("Customer Information deleted succcessfully");
    } catch (error) {
        console.log(error.message);
    }
}