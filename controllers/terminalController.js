// controllers/terminalController.js

const { Op } = require('sequelize');
const Line = require('../models/Line'); 
const Vehicle = require('../models/Vehicle');
const Terminal = require('../models/Terminal'); 
const User = require('../models/User');
const sequelize = require('../db');


module.exports.getAllTerminals = async (req,res) => {
try{
const Terminals=await Terminal.findAll();

res.status(200).json({
status:'success',
results:Terminals.length,
data:Terminals
})


}

catch(err){
res.status(400).json({
    status:'error',
    message:`Error fetching terminals: ${err.message}`

});


}
}

module.exports.getATerminal = async (req,res) => {
try{
const terminal = await Terminal.findOne(
    {
        where:{
            terminal_id:req.params.id
            
        },
        //attributes: ['terminal_name']
    }
);
if (terminal) {
    res.status(200).json({
        status: 'success',
        data: terminal
    });
} else {
    res.status(404).json({
        status: 'error',
        message: 'Terminal not found'
    });
}


}


catch(err){
    res.status(400).json({
    status:'error',
    message:`Terminal not found: ${err.message}`
})



}
}

module.exports.getLinesByTerminal= async (req, res) => {
try {
const lines=await Line.findAll(
    {
        where: {
            terminal_id: req.params.id
        },
        attributes:['line_name','last_updated','current_vehicles_count']
    });
    

    res.status(200).json({
        status: 'success',
        results: lines.length,
        data: lines
    
    },
    
)    
} 

catch (error) {

    res.status(400).json({
        status: 'error',
        message: `Error fetching lines for terminal: ${error.message}`
    });
    
}

}
module.exports.getAllTerminalsManager= async (req, res) => {
try {
    const lineManagers=await User.findAll(
        {
            where: {
                role: 'line_manager'
            },
            attributes: ['username','phone_number'],
            
            
        });
        
        if (lineManagers) {
            res.status(200).json({
                status: 'success',
                results: lineManagers.length,
                data: lineManagers
            });
        } else {
            console.log(`No line managers found`); // Debugging line
            res.status(404).json({
                status: 'error',
                message: 'No line managers found'
            });
        



}
}
 catch (error) {
    res.status(400).json({
        status: 'error',
        message: `Error fetching line managers: ${error.message}`
    });
    
}
}







