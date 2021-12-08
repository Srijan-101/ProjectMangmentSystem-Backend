exports.RegisterUser = (fullname, email, hashedpassword, salt, appRole) => {
    return `INSERT INTO users (fullname,email,hashedpassword,salt,appRole) 
    VALUES('${fullname}','${email}',
       '${hashedpassword}','${salt}','${appRole}')`
}

exports.getUserbyEmail = email => {
    return `SELECT * FROM users WHERE email='${email}'`
}

exports.verifyUser = email => {
    return `UPDATE users SET isVerified = 1 WHERE email='${email}'`;
}

exports.updateLink = (email, link) => {
    return `UPDATE users SET resetPassworLink ='${link}' WHERE email='${email}'`;
}

exports.PasswordLink = (link) => {
    return `SELECT * FROM users WHERE resetPassworLink ='${link}'`
}

exports.UpdatePassword = (email, newlink, password, salt) => {
    return `UPDATE users SET resetPassworLink ='${newlink}',hashedpassword = '${password}' , salt = '${salt}' WHERE email='${email}'`
}

exports.insertProject = (title,desc,wemail,aemail,date) => {
    return `INSERT INTO PROJECTS (title,description,Useremail,Adminemail,date) VALUES ('${title}','${desc}','${wemail}','${aemail}','${date}')`
}

exports.getProjectbyEmailUser = (email) => {
    return `SELECT * FROM PROJECTS WHERE Useremail ='${email}'`;
}


exports.deleteProject = (id,email) => {
    return `DELETE FROM PROJECTS WHERE id=${id} AND Adminemail ='${email}'`
}

exports.getUserbytitle = (title) => {
    return `SELECT Useremail FROM PROJECTS WHERE title='${title}'` 
}

exports.addTask = (title,description,assignto,priority,date,projectname,status) => {
    return `INSERT INTO tasks (title,description,assignto,priority,date,projectname,status)
     VALUES ('${title}','${description}','${assignto}','${priority}','${date}','${projectname}','${status}')`;
}

exports.getTask = (title) => {
    return `SELECT * FROM tasks WHERE projectname ='${title}' `;
}

exports.getTaskbyEmail = (email) => {
    return `SELECT * FROM tasks WHERE assignto ='${email}'`;
}

exports.updateStatus = (title,email,status) => {
    return `UPDATE tasks SET status = '${status}' WHERE assignto = '${email}' AND title = '${title}'`;
}