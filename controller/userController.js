
const con = require('../DataBase');




module.exports.getAllUsers=async(req,res)=>{
  
    try {
        const query = 'SELECT * FROM Users';
        con.query(query, (err, results) => {
            if (err) {
                res.status(400).json({
                    status: 'fail',
                    message: err.message
                });
                return;
            }
            res.status(200).json({
                status: 'success',
                results: results.length,
                data: results
            });
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
    
    };