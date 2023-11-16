const express = require('express');
const router = express.Router();

const { signUp, Login, accountActivation, forgotPassword, resetPassword, ResendVerify } = require('../Controller/user.controller')
const {addProject,Fetchproject, fetchUser,addTask,getTask,getTaskbyEmail,updateStatus,deleteProject} = require('../Controller/project.controller');






router.post('/signUp', signUp);
router.post('/login', Login);
router.post('/accountActivation', accountActivation);
router.post('/forgotPassword', forgotPassword);
router.put('/resetPassword', resetPassword);
router.post('/resendVerify', ResendVerify);


router.post('/addProject', addProject);
router.get('/fetchproject/:email/',Fetchproject)
router.delete('/deleteproject',deleteProject)
router.get('/getEmail/:title/',fetchUser)


router.post('/addTask',addTask)
router.get('/getTask/:projectName/',getTask);
router.get('/getTaskbyemail/:email/',getTaskbyEmail);

router.put('/updateStatus',updateStatus);

module.exports = router;