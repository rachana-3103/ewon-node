const axios = require("axios");
const qs = require("qs");
const { ewons, tags } = require("../models/index");
const { Sequelize, Op } = require("sequelize");
const moment = require("moment");
exports.syncGetData = async (req, res) => {
  try {
    const getTransaction = await ewons.findOne({});
    console.log("🚀  ~ getTransaction:", getTransaction);

    const data = {
      t2mdevid: req.body.t2mdevid,
      t2mtoken: req.body.t2mtoken,
      createTransaction: req.body.createTransaction,
    };
    if (getTransaction) {
      Object.assign(data, {
        lastTransactionId: getTransaction.transaction_id,
      });
    }
    console.log("🚀  ~ data:", data);

    const response = await axios.post(process.env.SYNCDATA, qs.stringify(data));
    console.log(
      "🚀 ~ file: syncdata.js:13 ~ exports.syncGetData= ~ response:",
      response.data.transactionId
    );

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
          transaction_id: response.data.transactionId,
        });
      } else {
        await ewons.update(
          {
            transaction_id: response.data.transactionId,
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
            transaction_id: response.data.transactionId,
          });
        }
      }
    }
    res.send(response.data);
  } catch (error) {
    console.log(error, "....................error");
  }
};

exports.getData = async (req, res) => {
  try {
    const data = {
      t2mdevid: req.body.t2mdevid,
      t2mtoken: req.body.t2mtoken,
      ewonid: req.body.ewonid,
    };

    const response = await axios.post(process.env.GETDATA, qs.stringify(data));
    console.log(
      "🚀 ~ file: syncdata.js:13 ~ exports.syncGetData= ~ response:",
      response.data
    );

    // for (const ewon of response.data.ewons) {
    //   const getEwon = await ewons.findOne({
    //     where: {
    //       id: ewon.id,
    //     },
    //   });
    //   let ewonData;
    //   if (!getEwon) {
    //     ewonData = await ewons.create({
    //       id: ewon.id,
    //       name: ewon.name,
    //       lastSynchroDate: ewon.lastSynchroDate,
    //       transaction_id:response.data.transactionId
    //     });
    //   }
    //   else{
    //     await ewons.update(
    //       {
    //         transaction_id:response.data.transactionId,
    //       },
    //       {
    //         where: {
    //           id: getEwon.id,
    //         },
    //       }
    //     );
    //   }
    //   if (ewonData || getEwon) {
    //     for (const tag of ewon.tags) {

    //         await tags.create({
    //           tag_id: tag.id,
    //           name: tag.name,
    //           ewon_id: ewon.id,
    //           data_type: tag.dataType,
    //           description: tag.description,
    //           alarm_hint: tag.alarmHint,
    //           value: tag.value,
    //           quality: tag.quality,
    //           alarm_state: tag.alarmState,
    //           ewon_tag_id: tag.ewonTagId,
    //           alarm_history: tag.alarmHistory,
    //           history: tag.history,
    //           transaction_id:response.data.transactionId
    //         });
    //     }
    //   }
    // }
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

    await axios.post("https://data.2m.com/getewons`", data).then((response) => {
      console.log(response, "...............................resss");
    });
  } catch (error) {
    console.log(error, "....................error");
  }
};

exports.syncdataGraph = async (req, res) => {
  try {
  let time;
  let hour = Number(req.query.hour);
  let minutes = Number(req.query.minutes);
  let day = Number(req.query.day);
  let week = Number(req.query.week);

    if(hour){
       time = moment().subtract(hour, "hour").format();
    }else if(minutes){
      time = moment().subtract(minutes, "minutes").format();
    }else if(day){
      time = moment().subtract(day, "day").format();
    }else if(week){
      time = moment().subtract(week, "week").format();
    }else {
       time = moment().subtract(30, "minutes").format();
    }
    const data = await tags.findAll({});
    const CM160FIT0003_VAL_PV = [];
    const CM160LIT0008_VAL_PV = [];
    const CM160PIT0023_VAL_PV = [];

    for (const obj of data) {
      for (const historyObj of obj.history) {
        if (historyObj.date >= time && obj.name == 'CM160FIT0003_VAL_PV') {
          historyObj.value = Number(obj.value.toFixed(3));
          CM160FIT0003_VAL_PV.push(historyObj);
        }
        if (historyObj.date >= time && obj.name == 'CM160PIT0023_VAL_PV') {
          historyObj.value = Number(obj.value.toFixed(3));
          CM160PIT0023_VAL_PV.push(historyObj);
        }
        if (historyObj.date >= time && obj.name == 'CM160LIT0008_VAL_PV') {
          historyObj.value = Number(obj.value.toFixed(3));
          CM160LIT0008_VAL_PV.push(historyObj);
        }
      }
    }
    console.log("🚀 ~ file: syncdata.js:184 ~ exports.syncdataGraph= ~ CM160FIT0003_VAL_PV:", CM160FIT0003_VAL_PV.length)
    console.log("🚀 ~ file: syncdata.js:188 ~ exports.syncdataGraph= ~ CM160LIT0008_VAL_PV:", CM160LIT0008_VAL_PV.length)
    console.log("🚀 ~ file: syncdata.js:188 ~ exports.syncdataGraph= ~ CM160PIT0023_VAL_PV:", CM160PIT0023_VAL_PV.length)
  
    let responseData = {};
    responseData.CM160FIT0003_VAL_PV_count = CM160FIT0003_VAL_PV.length;
    responseData.CM160LIT0008_VAL_PV_count = CM160LIT0008_VAL_PV.length;
    responseData.CM160PIT0023_VAL_PV_count = CM160PIT0023_VAL_PV.length;

    responseData.CM160FIT0003_VAL_PV = CM160FIT0003_VAL_PV;
    responseData.CM160LIT0008_VAL_PV = CM160LIT0008_VAL_PV;
    responseData.CM160PIT0023_VAL_PV = CM160PIT0023_VAL_PV;

    res.send(responseData);
  } catch (error) {
    console.log(error, "....................error");
  }
};
