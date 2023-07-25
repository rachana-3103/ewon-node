const axios = require("axios");
const qs = require("qs");
const { ewons, tags } = require("../models/index");
const { Sequelize, NOW } = require("sequelize");
const moment = require("moment");
const { sequelize } = require("../config/squelize-connect");

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
    const { startTime, endTime, hour, minutes, day, week } = req.query;
    let responseData = {};
    const tagsToFetch = [
      "CM160FIT0003_VAL_PV",
      "CM160PIT0023_VAL_PV",
      "CM160LIT0008_VAL_PV",
    ];
    const dynamicDate = moment().format("YYYY-MM-DD HH:mm:ss");

    const tagPlaceholders = tagsToFetch
      .map((tag, index) => `:tag${index}`)
      .join(", ");

    const tagReplacements = tagsToFetch.reduce(
      (replacements, tag, index) => ({ ...replacements, [`tag${index}`]: tag }),
      {}
    );

    let time;
    let data;
    let interval;
    if (!startTime && !endTime) {
      if (hour) {
        time = moment(dynamicDate).subtract(hour, "hour");
        interval = `${hour}` + " " + "HOUR";
      } else if (minutes) {
        time = moment.utc(dynamicDate).subtract(minutes, "minutes");
        interval = `${minutes}` + " " + "MINUTE";
      } else if (day) {
        time = moment.utc(dynamicDate).subtract(day, "day");
        interval = `${day}` + " " + "DAY";
      } else if (week) {
        time = moment.utc(dynamicDate).subtract(week, "week");
        interval = `${week}` + " " + "WEEK";
      } else {
        time = moment.utc(dynamicDate).subtract(30, "minutes");
        interval = `${30}` + " " + "MINUTE";
      }
      time = moment(time).format("YYYY-MM-DD HH:mm:ss");
      const query = `
      select id, name, history from ewon.tags cross join json_table(history, '$[*]' columns (date datetime path '$.date')) as history_date where
       name IN (${tagPlaceholders}) AND history_date.date > DATE_SUB(:currentDate, INTERVAL ${interval}) GROUP BY id;`;

      data = await sequelize.query(query, {
        replacements: { ...tagReplacements, currentDate: dynamicDate },
        type: Sequelize.QueryTypes.SELECT,
      });

    } else {
      const query = `SELECT id, name, history FROM ewon.tags CROSS JOIN json_table(history, '$[*]' COLUMNS (date datetime PATH '$.date')) AS history_date
        WHERE name IN (${tagPlaceholders}) AND history_date.date BETWEEN :startTime AND :endTime GROUP BY id;`;
       data = await sequelize.query(query, {
          replacements: {
            ...tagReplacements,
            startTime: startTime,
            endTime: endTime, 
          },
          type: Sequelize.QueryTypes.SELECT,
        });
    }

    const CM160FIT0003_VAL_PV = [];
    const CM160PIT0023_VAL_PV = [];
    const CM160LIT0008_VAL_PV = [];
    for (const obj of data) {
      for (const history of obj.history) {
        if (obj.name == "CM160FIT0003_VAL_PV") {
          history.value = Number(history.value).toFixed(3);
          CM160FIT0003_VAL_PV.push(history);
        }
        if (obj.name == "CM160PIT0023_VAL_PV") {
          history.value = Number(history.value).toFixed(3);
          CM160PIT0023_VAL_PV.push(history);
        }
        if (obj.name == "CM160LIT0008_VAL_PV") {
          history.value = Number(history.value).toFixed(3);
          CM160LIT0008_VAL_PV.push(history);
        }
      }
    }
    responseData.CM160FIT0003_VAL_PV_count = CM160FIT0003_VAL_PV.length;
    responseData.CM160PIT0023_VAL_PV_count = CM160PIT0023_VAL_PV.length;
    responseData.CM160LIT0008_VAL_PV_count = CM160LIT0008_VAL_PV.length;

    responseData.CM160FIT0003_VAL_PV = CM160FIT0003_VAL_PV;
    responseData.CM160PIT0023_VAL_PV = CM160PIT0023_VAL_PV;
    responseData.CM160LIT0008_VAL_PV = CM160LIT0008_VAL_PV;

    res.send(responseData);
  } catch (error) {
    console.log(error, "....................error");
  }
};
