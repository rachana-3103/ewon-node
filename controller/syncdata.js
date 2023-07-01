const axios = require("axios");
const qs = require("qs");
const { ewons, tags } = require("../models/index");

exports.syncGetData = async (req, res) => {
  try {
    const getTransaction = await ewons.findOne({});
    console.log("🚀  ~ getTransaction:", getTransaction)
    
    const data = {
      t2mdevid: req.body.t2mdevid,
      t2mtoken: req.body.t2mtoken,
      createTransaction:req.body.createTransaction,
    };
    if(getTransaction){
      Object.assign(data,{
        lastTransactionId: getTransaction.transaction_id
      })
    }
    console.log("🚀  ~ data:", data)

    const response = await axios.post(process.env.SYNCDATA, qs.stringify(data));
    console.log("🚀 ~ file: syncdata.js:13 ~ exports.syncGetData= ~ response:", response.data.transactionId)

    for (const ewon of response.data.ewons) {
      const getEwon = await ewons.findOne({
        where: {
          id: ewon.id,
        },
      });
      let ewonData;
      if (!getEwon) {
        ewonData = await ewons.create({
          id: ewon.id,
          name: ewon.name,
          lastSynchroDate: ewon.lastSynchroDate,
          transaction_id:response.data.transactionId
        });
      }
      else{
        await ewons.update(
          {
            transaction_id:response.data.transactionId,
          },
          {
            where: {
              id: getEwon.id,
            },
          }
        );
      }
      if (ewonData || getEwon) {
        for (const tag of ewon.tags) {
         
            await tags.create({
              tag_id: tag.id,
              name: tag.name,
              ewon_id: ewon.id,
              data_type: tag.dataType,
              description: tag.description,
              alarm_hint: tag.alarmHint,
              value: tag.value,
              quality: tag.quality,
              alarm_state: tag.alarmState,
              ewon_tag_id: tag.ewonTagId,
              alarm_history: tag.alarmHistory,
              history: tag.history,
              transaction_id:response.data.transactionId
            });
        }
      }
    }
    res.send(response.data);
  } catch (error) {
    console.log(error, "....................error");
  }
};

exports.getewons = async (req, res) => {
  try {
    const data = {
      t2mdevid: process.env.T2MDEVID,
      t2mtoken: process.env.T2MTOKEN,
    };
    console.log("🚀 .............................. ~ data:", data);

    await axios
      .post("https://data.2m.com/getewons`", data)
      .then((response) => {
        console.log(response, "...............................resss");
      });
  } catch (error) {
    console.log(error, "....................error");
  }
};
