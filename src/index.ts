import {Client} from 'pg'

const client = new Client({
    connectionString : 'postgresql://postgres:mysecretpassword@localhost/postgres'
})

async function createUserTable(){

    await client.connect();
    const result = await client.query(`
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE  NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `)
    console.log(result)
}
// createUserTable()

async function insertUserDate (username : string, email:string, password:string){
    await client.connect();
    const result = await client.query(`
        INSERT INTO users (username, email, password) VALUES ($1, $2, $3)
    `,[username,email,password])
    console.log(result)
}

// insertUserDate('Bipin','abc@gmail.com','2343');

async function getUserData (){
    await client.connect()
    const result = await client.query(`
        SELECT * FROM users
    `)
    console.log(result.rows[0])
}

// getUserData();


async function createAddressTable() {
    await client.connect();

    const result = await client.query(`
    
    CREATE TABLE addresses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        city VARCHAR(100) NOT NULL,
        country VARCHAR(100) NOT NULL,
        street VARCHAR(255) NOT NULL,
        pincode VARCHAR(20),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    `)
    console.log(result)
}
// createAddressTable();

async function insertAddressData(user_id:any, city:string, country:string, street:string, pincode:string) {
    await client.connect();

    const result = await client.query(
        ` 
            INSERT INTO addresses (user_id, city, country, street, pincode) VALUES ($1,$2,$3,$4,$5)
        `,[user_id, city,country,street,pincode]
    )

    console.log(result)
}

// insertAddressData(1,'kushinagar','india','hata','274206')

async function getAddresses() {
    await client.connect()

    const result = await client.query(
        `SELECT * FROM addresses`
    )
    console.log(result.rows);
}

// getAddresses()

async function transactionsQuery() {
    await client.connect()
    await client.query('BEGIN')
    const result1= await client.query(
        `SELECT * FROM users`
    )

    const result2 = await client.query(`
    SELECT * FROM addresses`)

    client.query('COMMIT')
    console.log(result1.rows)
    console.log(result2.rows)
}
transactionsQuery();

async function joins(){
    await client.connect()
    const result = await client.query(
        `SELECT * FROM users INNER JOIN addresses ON users.id = addresses.user_id`
    );
    console.log(result.rows)
}

// joins();