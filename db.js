const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'ayush@localhost',
    password: 'ayush2384',
    database: 'autoquora'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database as id', connection.threadId);
});


// C
function createCredential(email, password) {
    const newCredential = { email: email, password: password };
    connection.query('INSERT INTO credentials SET ?', newCredential, (error, results) => {
        if (error) throw error;
        console.log('Inserted new credential with ID:', results.insertId);
    });
}

// R
function getCredentials() {
    connection.query('SELECT * FROM credentials', (error, results) => {
        if (error) throw error;
        console.log('Credentials:', results);
    });
}

function getCredentialByemail(email) {
    connection.query('SELECT * FROM credentials WHERE email = ?', [email], (error, results) => {
        if (error) throw error;
        console.log('Credential:', results);
    });
}

// U
function updateCredential(email, newPassword) {
    const updatedCredential = { password: newPassword };
    connection.query('UPDATE credentials SET ? WHERE email = ?', [updatedCredential, email], (error, results) => {
        if (error) throw error;
        console.log('Updated credential for email:', email);
    });
}


// D
function deleteCredential(email) {
    connection.query('DELETE FROM credentials WHERE email = ?', [email], (error, results) => {
        if (error) throw error;
        console.log('Deleted credential for email:', email);
    });
}


module.exports = {
    createCredential,
    getCredentials,
    getCredentialByemail,
    updateCredential,
    deleteCredential
};