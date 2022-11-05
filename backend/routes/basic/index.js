const express = require("express");
const router = express.Router();

const Nurse = require('../../models/nurse.model');
const Patient = require('../../models/patient.model');
const User = require('../../models/user.model');
const Holiday = require('../../models/holiday.model');

router.route("/list").get(function(req,res){
    Nurse.find({},function(err,nurseData){
        if(!err){
            Patient.find({},function(err,patientData){
                if(!err){
                    Holiday.find({},function(err,holidayData){
                        let holidays;
                        if(holidayData == null || holidayData.length == 0){
                            holidays = [];
                        }else{
                            holidays = holidayData[0].holiday
                        }
                        res.send({
                            state:'success',
                            nurse:nurseData,
                            patient:patientData,
                            holiday:holidays
                        });
                    });
                }
            });
        }
    });
});
router.route('/login').post(function(req,res){
    const user = req.body;
    User.findOne({user:user.email},function(err,data){
        if(!err){
            if(data == null){
                res.send({
                    state:'nouser',
                });
            }else{
                if(data.password == user.password){
                    if(!err){
                        res.send({
                            state:'success',
                            token:data.token,
                            role:data.role
                        });
                    }
                }else{
                    res.send({state:'wrongpwd'});
                }
            }
        }else{
            res.send({
                state:"error"
            });
        }
    });
});
router.route('/holiday/get').post(function(req,res){
    const holiday = req.body;
    Holiday.find({},function(err,data){
        if(data == null || data.length == 0){
            Holiday.create({
                holiday:[holiday.date]
            },function(err,data){
                if(!err){
                    res.send({holiday:data.holiday});
                }
            });
        }else{
            if(holiday.state == false){
                Holiday.findOneAndUpdate({},
                    {$push:{"holiday":holiday.date}}
                ).then(function(data){
                    Holiday.find({},function(err,data){
                        if(data == null){
                            res.send({holiday:[]});
                        }else{
                            res.send({holiday:data[0].holiday});
                        }
                    });
                });
            }else{
                Holiday.findOneAndUpdate({},
                    {$pull:{"holiday":holiday.date}}
                ).then(function(data){
                    Holiday.find({},function(err,data){
                        if(data == null){
                            res.send({holiday:[]});
                        }else{
                            res.send({holiday:data[0].holiday});
                        }
                    });
                });
            }
        }
    });
});

module.exports = router;