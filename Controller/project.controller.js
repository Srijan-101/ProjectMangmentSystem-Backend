const conn = require("../Dbconnection/connection");
const { insertProject, getUserbyEmail,getProjectbyEmailUser, getUserbytitle,addTask,getTask,getTaskbyEmail,updateStatus,deleteProject} = require("../Query/query");

exports.addProject = (req,res) => {
    const {title,projectDescription,workerEmail,Adminemail,sDate} = req.body;
        workerEmail.forEach(ele => {
            conn.query(getUserbyEmail(ele),(err,sucess) => {
                if(sucess.length === 0){
                    return res.status(400).json({
                        error: `User with email ${ele} doesnot exist`
                    })
                }else{
                    conn.query(insertProject(title,projectDescription,ele,Adminemail,sDate),(err,sucess) => {
                        if(err){
                            return res.status(400).json({
                               error: `User with email ${ele} doesnot exist`
                            })
                         }
                    })
               }
        })
    })
    return res.status(200).json({
        message : "sucess"
    })
}



exports.Fetchproject = (req,res) => {
    const {email}  = req.params;
    conn.query(getProjectbyEmailUser(email),(err,result) => {
         if(err){
            return res.status(400).json({
                 error : "ERROR"
             })
         }else{
             return res.status(200).json(result);
         }
    })
}


exports.fetchUser = (req,res) => {
    const {title} = req.params;
    conn.query(getUserbytitle(title),(err,result) => {
        if(!err){
            res.status(200).json(result);
        }
    })
}


exports.deleteProject = (req,res) => {
    const {id,Adminemail} = req.body;
    conn.query(deleteProject(id,email = Adminemail),(err,result) => {
           if(err) {
            console.log(err);
            return res.status(400).json({
                message : "ERROR"
             })
           }
          console.log(result);
          return res.status(200);
     })
}


exports.addTask = (req,res) => {
     const {title,description,assignTo,priority,sDate,projectName,status} = req.body;
     conn.query(addTask(title,description,assignTo,priority,sDate,projectName,status),(err,sucess) => {
         if(err){
             console.log(err);
             res.status(400).json({
                 message : "ERROR"
             })
         }else{
             res.status(200).json({
                 message : "Task Added"
             })
         }
     })
}

exports.getTask = (req,res) => {
    const {projectName} = req.params;
    
    conn.query(getTask(projectName),(err,result) => {
        if(err) {
            res.status(400).json({
                message : "error"
            })
        }else{
            res.status(200).json(result);
        }
    })
 }

 exports.getTaskbyEmail = (req,res) => {
    const {email} = req.params;
    conn.query(getTaskbyEmail(email),(err,result) => {
        if(err) {
            res.status(400).json({
                message : "error"
            })
        }else{
            res.status(200).json(result);
        }
    })
 }

 exports.updateStatus = (req,res) => {
     const {email,statuss,title} = req.body;
     conn.query(updateStatus(title,email,statuss),(err,result) => {
         if(err){
             return res.status(400).json(err);
         }else{
             return res.status(200).json({message:"updating"})
         }
     })
 }