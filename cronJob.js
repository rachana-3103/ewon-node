const cron = require("node-cron");
const axios = require("axios");
const qs = require("qs");
const { ewons, tags } = require("./models/index");

cron.schedule("* * * * *", async (req, res) => {
  try {
    // const data = {
    //   t2mdevid: process.env.T2MDEVID,
    //   t2mtoken: process.env.T2MTOKEN,
    // };

    // const response = await axios.post(process.env.SYNCDATA, qs.stringify(data));

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
    //     });
    //   }
    //   if (ewonData || getEwon) {
    //     for (const tag of ewon.tags) {
    //       const getTag = await tags.findOne({
    //         where: {
    //           id: tag.id,
    //         },
    //       });
    //       if (!getTag) {
    //         await tags.create({
    //           id: tag.id,
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
    //         });
    //       }

    //       res.render('tables', { title: 'Tables', ewonData: ewon});
    //     }
    //   }
    //   // res.send(response.data);
    // }







    const getTransaction = await ewons.findOne({});
    console.log("🚀  ~ getTransaction:", getTransaction)
    
    const data = {
      t2mdevid: process.env.T2MDEVID,
      t2mtoken: process.env.T2MTOKEN,
      createTransaction:true,
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
              transaction_id:response.data.transactionId,
              alarm_history: tag.alarmHistory,
              history: tag.history,
            });
        }
      }
    }
  } catch (error) {
    console.log(error, "....................error");
  }
  console.log("running a task every minute");
});
