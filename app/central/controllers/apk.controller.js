const db = require("../models/user");
const APK_details = db.apk_details;
const ReadText = require('text-from-image')

exports.create = (req, res) => {
    var error =[];
    if (Object.keys(req.files).length  === 0) {
        res.status(400).send({
          message: "APK'S can not be empty !",
        });
        return;
      }
      
  else{
    var path1;
    var path2;
    var path3;
    var path4;
    if (req.files.rest_desktop_apk == undefined || req.files.rest_android_apk == undefined || req.files.mart_desktop_apk == undefined || req.files.mart_android_apk == undefined) 
    {
        res.status(400).send({
          message: "APK's can not be empty !",
        });
        return;
    }
  else
  {
      path1 = req.protocol+ '://' + req.get('Host') + '/public/pos_apk/' + req.files.rest_desktop_apk[0].filename;
      path2 = req.protocol+ '://' + req.get('Host') + '/public/pos_apk/' + req.files.rest_android_apk[0].filename;
      path3 = req.protocol+ '://' + req.get('Host') + '/public/pos_apk/' + req.files.mart_desktop_apk[0].filename;
      path4 = req.protocol+ '://' + req.get('Host') + '/public/pos_apk/' + req.files.mart_android_apk[0].filename;
   
      
        const apk_details = {
            rest_desktop_apk: path1,
            rest_android_apk: path2,
            mart_desktop_apk: path3,
            mart_android_apk: path4,
            remarks: req.body.remarks,
            status:'1',
        };
        if(error.length!=0){
            if (req.files.rest_desktop_apk != undefined) {
              fs.unlinkSync('public/pos_apk/' + req.files.rest_desktop_apk[0].filename)
            }
            if (req.files.rest_android_apk != undefined) {
              fs.unlinkSync('public/pos_apk/' + req.files.rest_android_apk[0].filename)
            }
            if (req.files.mart_desktop_apk != undefined) {
              fs.unlinkSync('public/pos_apk/' + req.files.mart_desktop_apk[0].filename)
            }
            if (req.files.mart_android_apk != undefined) {
              fs.unlinkSync('public/pos_apk/' + req.files.mart_android_apk[0].filename)
            }
            
            res.status(203).send(error);
          }
          else
          {
                APK_details.findAll()
                .then((data) => {
                    if(!data.length)
                    {
                        APK_details.create(apk_details)
                        .then((data1) => {
                        res.status(200).send(data1);
                        })
                        .catch((err) => {
                            res.status(500).send({
                            message: err.message || "Some error occurred while create the APK",
                            });
                        });
                        
                    }
                    else
                    {
                        APK_details.update({status:0}, {
                            where: { status: 1 },
                        }).then((data) => {
                            // if (data[0] != 0) {
                                APK_details.create(apk_details)
                                .then((data1) => {
                                res.status(200).send(data1);
                                })
                                .catch((err) => {
                                    res.status(500).send({
                                    message: err.message || "Some error occurred while create the APK",
                                    });
                                });
                            // } else {
                            // res.status(500).send({
                            //     message: `Cannot update APK data`,
                            // });
                            // }
                        });
                    }
                
                })
                .catch((err) => {
                    res.status(502).send({
                    message: err.message || "Some error occured while retrieving APK",
                    });
                });

          }
      }
    }
  
};

exports.findAll = (req, res) => {
    APK_details.findAll({
      where:{status:1},
    })
    .then((data) => {
      if(!data.length)
      {
         res.status(500).send({
                 message: "Data Not Found",
            });
      }
      else
      {
         res.status(200).send(data);
      }
    })
    .catch((err) => {
      res.status(502).send({
        message: err.message || "Some error occured while retrieving APK",
      });
    });
};

exports.findAllData = (req, res) => {
  APK_details.findAll()
  .then((data) => {
    if(!data.length)
    {
       res.status(500).send({
               message: "Data Not Found",
          });
    }
    else
    {
       res.status(200).send(data);
    }
  })
  .catch((err) => {
    res.status(502).send({
      message: err.message || "Some error occured while retrieving APK",
    });
  });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  APK_details.findByPk(id)
    .then((data) => {
      if(!data)
        {
           res.status(500).send({
                   message: "Sorry! Data Not Found With Id=" + id,
              });
        }
        else
        {
           res.status(200).send(data);
        }
    })
    .catch((err) => {
      res.status(502).send({
        message: "Error retrieving APK with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {
    APK_details.update(req.body, {
      where: { apk_det_id: id },
    }).then((data) => {
      if (data[0] != 0) {
        res.status(200).send({
          message: "APK was updated successfully",
        });
      } else {
        res.status(500).send({
          message: `Cannot update APK with id=${id}`,
        });
      }
    });
  }
};

exports.delete = (req, res) => {
  const id = req.params.id;

  APK_details.destroy({
    where: { apk_det_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "APK was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete APK with id=${id}`,
      });
    }
  });
};


exports.test_image = (req, res) => {
  ReadText('https://na001.leafletscdns.com/ca/data/1/42663/2.webp?t=1654675400').then((text) => {
    console.log(text);
    res.status(200).send(text);
}).catch(err => {
    console.log(err);
    res.status(500).send(err);
})
};
